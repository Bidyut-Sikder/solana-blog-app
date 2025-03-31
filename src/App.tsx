import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FullPost from "./pages/FullPost";
import { BlogProvider } from "./context/BlogContext";
// import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const App = () => {
  // const network = clusterApiUrl("devnet");

  const endpoint =
    "https://weathered-rough-bird.solana-devnet.quiknode.pro/c45a551b37ccf9d114e2d17657fc331b96c6abd8/";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <BlogProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/read-post/:id" element={<FullPost />} />
            </Routes>
          </BrowserRouter>
        </BlogProvider>
      </WalletProvider>
     </ConnectionProvider>
  );
};

export default App;



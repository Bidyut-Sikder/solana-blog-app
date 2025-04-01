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


// {
//   "version": "0.1.0",
//   "name": "blog_sol",
//   "constants": [
//     { "name": "USER_SEED", "type": "bytes", "value": "[117, 115, 101, 114]" },
//     { "name": "POST_SEED", "type": "bytes", "value": "[112, 111, 115, 116]" }
//   ],
//   "instructions": [
//     {
//       "name": "initUser",
//       "accounts": [
//         { "name": "userAccount", "isMut": true, "isSigner": false },
//         { "name": "authority", "isMut": true, "isSigner": true },
//         { "name": "systemProgram", "isMut": false, "isSigner": false }
//       ],
//       "args": [
//         { "name": "name", "type": "string" },
//         { "name": "avatar", "type": "string" }
//       ]
//     },
//     {
//       "name": "createPost",
//       "accounts": [
//         { "name": "postAccount", "isMut": true, "isSigner": false },
//         { "name": "userAccount", "isMut": true, "isSigner": false },
//         { "name": "authority", "isMut": true, "isSigner": true },
//         { "name": "systemProgram", "isMut": false, "isSigner": false }
//       ],
//       "args": [
//         { "name": "title", "type": "string" },
//         { "name": "content", "type": "string" }
//       ]
//     }
//   ],
//   "accounts": [
//     {
//       "name": "UserAccount",
//       "type": {
//         "kind": "struct",
//         "fields": [
//           { "name": "name", "type": "string" },
//           { "name": "avatar", "type": "string" },
//           { "name": "authority", "type": "publicKey" },
//           { "name": "lastPostId", "type": "u8" },
//           { "name": "postCount", "type": "u8" }
//         ]
//       }
//     },
//     {
//       "name": "PostAccount",
//       "type": {
//         "kind": "struct",
//         "fields": [
//           { "name": "id", "type": "u8" },
//           { "name": "title", "type": "string" },
//           { "name": "content", "type": "string" },
//           { "name": "user", "type": "publicKey" },
//           { "name": "authority", "type": "publicKey" }
//         ]
//       }
//     }
//   ],
//   "metadata":{
//     "address":"JC8GpV1hXD1Rh6ynZdNSErXBDZvp6LgmB1DneUXWThBA"
//   }
// }
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../idl.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";

const BlogContext = createContext<{
  initialized: boolean;
  user: anchor.IdlTypes<anchor.Idl>["userAccount"] | undefined;
  initUser: () => Promise<void>;
  createPost: (postTitle: string, postContent: string) => Promise<void>;

  posts: anchor.ProgramAccount<anchor.IdlTypes<anchor.Idl>>[];
}>({
  initialized: false,
  user: undefined,
  initUser: async () => {},
  createPost: async () => {},

  posts: [],
});

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogContextProvider");
  }
  return context;
};

export const BlogProvider = ({ children }: any) => {
  const [transactionPending, setTransanctionPending] = useState(false);
  const [posts, setPosts] = useState<
    anchor.ProgramAccount<anchor.IdlTypes<anchor.Idl>>[]
  >([]);
  const [user, setUser] = useState<
    anchor.IdlTypes<anchor.Idl>["userAccount"] | undefined
  >(undefined);
  const [initialized, setInitialized] = useState(false);

  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey } = useWallet();

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idl as anchor.Idl, PROGRAM_KEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    (async () => {
      if (program && publicKey) {
        try {
          const [userPda] = await findProgramAddressSync(
            [utf8.encode("user"), publicKey.toBuffer()],
            program.programId
          );
          const user = await program.account.userAccount.fetch(userPda);

          if (user) {
            // console.log(user);
            setUser(user);
            setInitialized(true);
            const postAccounts = await program.account.postAccount.all();
            setPosts(postAccounts);
          }
        } catch (error) {
          console.log("no user");
          setInitialized(false);
        } finally {
          setTransanctionPending(false);
        }
      }
    })();
  }, [program, publicKey, transactionPending]);

  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransanctionPending(true);
        const name = "bidyutsikder2";
        const avatar = "https://randomuser.me/api/portraits/men/85.jpg";
        const [userPda] = await findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        await program.methods
          .initUser(name, avatar)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            SystemProgram: SystemProgram.programId,
          })
          .rpc();
        setInitialized(true);
      } catch (error) {
        console.log(error);
      } finally {
        setTransanctionPending(false);
      }
    }
  };
  // console.log(user)
  const createPost = async (postTitle: string, postContent: string) => {
    if (program && publicKey) {
      setTransanctionPending(true);
      try {
        const [userPda] = await findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );

        const [postPda] = await findProgramAddressSync(
          [
            utf8.encode("post"),
            publicKey.toBuffer(),
            Uint8Array.from([user?.lastPostId]),
          ],
          program.programId
        );
        // console.log(postPda)
        await program.methods
          .createPost(postTitle, postContent)
          .accounts({
            userAccount: userPda,
            postAccount: postPda,
            authority: publicKey,
            SystemProgram: SystemProgram.programId,
          })
          .rpc();
        const postAccounts = await program.account.postAccount.all();
        setPosts(postAccounts);
      } catch (error) {
        console.log(error);
      } finally {
        setTransanctionPending(false);
      }
    }
  };

  return (
    <BlogContext.Provider
      value={{ initialized, user, initUser, createPost, posts }}
    >
      {children}
    </BlogContext.Provider>
  );
};

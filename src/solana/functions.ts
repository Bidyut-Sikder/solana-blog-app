import { PublicKey, SystemProgram } from "@solana/web3.js";

export async function getPostById(postId: any, program: any) {
  try {
    const post = await program.account.postAccount.fetch(new PublicKey(postId));
    const userId = post.user.toString();
    if (userId === SystemProgram.programId.toString()) {
      return;
    }
    return {
      id: postId,
      title: post.title,
      content: post.content,
      userId,
    };
  } catch (e: any) {
    console.log(e.message);
  }
}

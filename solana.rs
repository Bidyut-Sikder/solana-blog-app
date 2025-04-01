

use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub name: String,
    pub avatar: String,
    pub authority: Pubkey,
    pub last_post_id: u8,
    pub post_count: u8,
}

#[constant]
pub const USER_SEED: &[u8] = b"user";

#[constant]
pub const POST_SEED: &[u8] = b"post";

#[account]
#[derive(Default)]
pub struct PostAccount {
    pub id: u8,
    pub title: String,
    pub content: String,
    pub user: Pubkey,
    pub authority: Pubkey,
}

declare_id!("JC8GpV1hXD1Rh6ynZdNSErXBDZvp6LgmB1DneUXWThBA");

#[program]
pub mod blog_sol {
    use super::*;

    pub fn init_user(ctx: Context<InitUser>, name: String, avatar: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let authority = &ctx.accounts.authority;

        user_account.name = name;
        user_account.avatar = avatar;
        user_account.last_post_id = 0;
        user_account.post_count = 0;
        user_account.authority = authority.key();
        
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &ctx.accounts.authority;

        post_account.id = user_account.last_post_id;
        post_account.title = title;
        post_account.content = content;
        post_account.user = user_account.key();
        post_account.authority = authority.key();

        user_account.last_post_id = user_account.last_post_id.checked_add(1).unwrap();
        user_account.post_count = user_account.post_count.checked_add(1).unwrap();
        
        Ok(())
    }

}

#[error_code]
pub enum BlogError {
    #[msg("You are not authorized to delete this post.")]
    Unauthorized,
    
    #[msg("Invalid post ID.")]
    InvalidPostId,
}

#[derive(Accounts)]
pub struct InitUser<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump,
        space = 2312 + 8
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = authority,
        space = 2376 + 8,
        seeds = [POST_SEED, authority.key().as_ref(), &[user_account.last_post_id]],
        bump
    )]
    pub post_account: Account<'info, PostAccount>,

    #[account(
        mut,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(
        mut,
        close = authority,
        seeds = [POST_SEED, authority.key().as_ref(), &post_account.id.to_le_bytes()],
        bump
    )]
    pub post_account: Account<'info, PostAccount>,

    #[account(
        mut,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

































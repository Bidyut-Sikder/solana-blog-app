
use anchor_lang::prelude::*;
use anchor_lang::solitude_program::program::declare_program;

pub const USER_SEED: &[u8] = b"UserSeed";


declare_id!("11111111111111111111111111111111");

#[program]//program starts here
mod my_program{
    use super::*;
    pub fn solana_init(ctx:Context<SolanaInit>,name:String)->Result<()>{
    let user_account=&mut ctx.accounts.user_account;
    let authority=&mut ctx.account.authority;
    user_account.name=name;
    user_account.address='Tungipara';
    user_account.authority=authority.key()
    }
}


#[derive(Accounts)] //it tels anchor that solanaInit is a list of accounts required by the function.
pub struct SolanaInit<'info>{
    #[account(init,payer=authority,seed=[USER_SEED,authority.key().as_ref()],bump,space=444+33)]
    pub user_account: Account<'info,UserAccount>,
    #[account(mut)]
    pub authority: Signer <'info>,
    pub system_program: Program <'info, System>,
}



#[account]
pub struct UserAccount{
    pub name:String,
    pub address:String,
    pub user_id:u64

}


































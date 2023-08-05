contract;

mod errors;

use ::errors::{AuthorizationError};
use contract_libraries::SynthToken;
use std::{auth::msg_sender, constants::ZERO_B256, token::{burn, mint_to}};

configurable {
    /// The privileged user with the ability to
    /// mint and burn token
    MARKET_CONTROLLER: Identity = Identity::Address(Address::from(ZERO_B256)),
}

storage {
    total_supply: u64 = 0,
}

impl SynthToken for Contract {
    #[storage(read, write)]
    fn mint_to(amount: u64, to: Identity) {
        require(msg_sender().unwrap() == MARKET_CONTROLLER, AuthorizationError::OnlyMarketControllerAllowed);

        storage.total_supply.write(storage.total_supply.read() + amount);
        mint_to(amount, to);
    }

    #[storage(read, write)]
    fn burn(amount: u64) {
        require(msg_sender().unwrap() == MARKET_CONTROLLER, AuthorizationError::OnlyMarketControllerAllowed);

        storage.total_supply.write(storage.total_supply.read() - amount);
        burn(amount);
    }
}

#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod vcloud {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Errors that might occur while executing the contract.
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// The user is already exists.
        UserAlreadyExists,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    /// Events that are emitted after calls.
    #[ink(event)]
    pub struct UserCreated {
        #[ink(topic)]
        user: AccountId,
    }
    #[ink(event)]
    pub struct RequestCreated {
        #[ink(topic)]
        request_id: u64,
        #[ink(topic)]
        addressed_to: AccountId,
        #[ink(topic)]
        sent_by: AccountId,
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct User {
        email: String,
        phone: String,
        address: AccountId,
    }

    impl Default for User {
        fn default() -> Self {
            Self {
                email: String::from(""),
                phone: String::from(""),
                address: AccountId::from([0x0; 32]),
            }
        }
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Request {
        msg: String,
        addressed_to: AccountId,
        sent_by: AccountId,
        sent_at: Timestamp,
        request_id: u64,
    }

    impl Default for Request {
        fn default() -> Self {
            Self {
                msg: String::from(""),
                addressed_to: AccountId::from([0x0; 32]),
                sent_by: AccountId::from([0x0; 32]),
                sent_at: Timestamp::default(),
                request_id: 0,
            }
        }
    }

    #[ink(storage)]
    pub struct Vcloud {
        users: Mapping<AccountId, User>,
        users_items: Vec<AccountId>,
        requests: Mapping<u64, Request>,
        requests_items: Vec<u64>,
    }

    impl Vcloud {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                users: Mapping::new(),
                users_items: Vec::new(),
                requests: Mapping::new(),
                requests_items: Vec::new(),
            }
        }
        /// add new user
        #[ink(message)]
        pub fn add_user(&mut self, email: String, phone: String) -> Result<()> {
            let caller = self.env().caller();
            let user = User {
                email,
                phone,
                address: caller,
            };
            if self.users.contains(&caller) {
                return Err(Error::UserAlreadyExists);
            }
            self.users.insert(caller, &user);
            self.users_items.push(caller);
            self.env().emit_event(UserCreated { user: caller });
            Ok(())
        }
        //get user
        #[ink(message)]
        pub fn get_user(&self, user: AccountId) -> Option<User> {
            if !self.users.contains(&user) {
                return None;
            }
            Some(self.users.get(&user).unwrap())
        }
        /// create new document request
        #[ink(message)]
        pub fn create_request(
            &mut self,
            msg: String,
            addressed_to: AccountId,
            request_id: u64,
        ) -> Result<()> {
            let caller = self.env().caller();
            let request = Request {
                msg,
                addressed_to,
                sent_by: caller,
                sent_at: self.env().block_timestamp(),
                request_id,
            };
            self.requests.insert(request.request_id, &request);
            self.requests_items.push(request.request_id);
            self.env().emit_event(RequestCreated {
                request_id,
                addressed_to,
                sent_by: caller.clone(),
            });
            Ok(())
        }
    }
}

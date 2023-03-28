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
        /// Nounce Already Exists
        NounceAlreadyExists,
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
    #[ink(event)]
    pub struct ReplyCreated {
        #[ink(topic)]
        reply_id: u64,
        #[ink(topic)]
        request_id: u64,
        #[ink(topic)]
        addressed_to: AccountId,
    }

    #[ink(event)]
    pub struct VaultCreated {
        #[ink(topic)]
        owner: AccountId,
    }

    #[ink(event)]
    pub struct VaultRemoved {
        #[ink(topic)]
        owner: AccountId,
    }
    #[ink(event)]
    pub struct ShareCreated {
        #[ink(topic)]
        share_id: String,
        #[ink(topic)]
        shared_by: AccountId,
        #[ink(topic)]
        shared_to: AccountId,
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

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Reply {
        msg: String,
        sent_by: AccountId,
        sent_at: Timestamp,
        request_id: u64,
        reply_id: u64,
    }

    impl Default for Reply {
        fn default() -> Self {
            Self {
                msg: String::from(""),
                sent_by: AccountId::from([0x0; 32]),
                sent_at: Timestamp::default(),
                request_id: 0,
                reply_id: 0,
            }
        }
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Vault {
        owner: AccountId,
        nounce: String,
    }

    impl Default for Vault {
        fn default() -> Self {
            Self {
                owner: AccountId::from([0x0; 32]),
                nounce: String::from(""),
            }
        }
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Share {
        entity_id: String,
        file_name: String,
        ipfs_cid: String,
        shared_by: AccountId,
        shared_at: Timestamp,
        shared_to: AccountId,
        file_key: String,
        share_id: String,
    }

    impl Default for Share {
        fn default() -> Self {
            Self {
                entity_id: String::from(""),
                file_name: String::from(""),
                ipfs_cid: String::from(""),
                shared_by: AccountId::from([0x0; 32]),
                shared_at: Timestamp::default(),
                shared_to: AccountId::from([0x0; 32]),
                file_key: String::from(""),
                share_id: String::from(""),
            }
        }
    }

    #[ink(storage)]
    pub struct Vcloud {
        users: Mapping<AccountId, User>,
        users_items: Vec<AccountId>,
        requests: Mapping<u64, Request>,
        requests_items: Vec<u64>,
        replies: Mapping<u64, Reply>,
        replies_items: Vec<u64>,
        vault: Mapping<AccountId, String>,
        shared: Mapping<String, Share>,
        shared_items: Vec<String>,
    }

    impl Vcloud {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                users: Mapping::new(),
                users_items: Vec::new(),
                requests: Mapping::new(),
                requests_items: Vec::new(),
                replies: Mapping::new(),
                replies_items: Vec::new(),
                vault: Mapping::new(),
                shared: Mapping::new(),
                shared_items: Vec::new(),
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
        /// get user
        #[ink(message)]
        pub fn get_user(&self, user: AccountId) -> Option<User> {
            if !self.users.contains(&user) {
                return None;
            }
            Some(self.users.get(&user).unwrap())
        }
        /// get all users
        #[ink(message)]
        pub fn get_users(&self) -> Vec<User> {
            let mut users = Vec::new();
            for user in self.users_items.iter() {
                users.push(self.users.get(user).unwrap());
            }
            users
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
        ///get request
        #[ink(message)]
        pub fn get_request(&self, request_id: u64) -> Option<Request> {
            if !self.requests.contains(&request_id) {
                return None;
            }
            Some(self.requests.get(&request_id).unwrap())
        }
        /// get all requests
        #[ink(message)]
        pub fn get_requests(&self) -> Vec<Request> {
            let mut requests = Vec::new();
            for request_id in self.requests_items.iter() {
                let request = self.requests.get(request_id).unwrap();
                requests.push(request);
            }
            requests
        }

        /// get all requests by sent_by
        #[ink(message)]
        pub fn get_request_by_sent_by(&self, sent_by: AccountId) -> Vec<Request> {
            let mut requests = Vec::new();
            for request_id in self.requests_items.iter() {
                let request = self.requests.get(request_id).unwrap();
                if request.sent_by == sent_by {
                    requests.push(request);
                }
            }
            requests
        }

        /// get all requests by addressed_to
        #[ink(message)]
        pub fn get_requests_by_addressed_to(&self, addressed_to: AccountId) -> Vec<Request> {
            let mut requests = Vec::new();
            for request_id in self.requests_items.iter() {
                let request = self.requests.get(request_id).unwrap();
                if request.addressed_to == addressed_to {
                    requests.push(request);
                }
            }
            requests
        }

        /// create new document reply
        #[ink(message)]
        pub fn create_reply(&mut self, msg: String, request_id: u64, reply_id: u64) -> Result<()> {
            let caller = self.env().caller();
            let reply = Reply {
                msg,
                sent_by: caller,
                sent_at: self.env().block_timestamp(),
                request_id: request_id.clone(),
                reply_id,
            };
            self.replies.insert(reply.reply_id, &reply);
            self.replies_items.push(reply.reply_id);
            self.env().emit_event(ReplyCreated {
                reply_id,
                request_id,
                addressed_to: caller.clone(),
            });
            Ok(())
        }
        ///get reply
        #[ink(message)]
        pub fn get_reply(&self, reply_id: u64) -> Option<Reply> {
            if !self.replies.contains(&reply_id) {
                return None;
            }
            Some(self.replies.get(&reply_id).unwrap())
        }
        /// get all replies
        #[ink(message)]
        pub fn get_all_replies(&self) -> Vec<Reply> {
            let mut replies = Vec::new();
            for reply_id in self.replies_items.iter() {
                let reply = self.replies.get(reply_id).unwrap();
                replies.push(reply);
            }
            replies
        }
        /// get all replies by each request id
        #[ink(message)]
        pub fn get_replies_by_request(&self, request_id: u64) -> Vec<Reply> {
            let mut replies = Vec::new();
            for reply_id in self.replies_items.iter() {
                let reply = self.replies.get(reply_id).unwrap();
                if reply.request_id == request_id {
                    replies.push(reply);
                }
            }
            replies
        }

        /// add nounce to vault
        #[ink(message)]
        pub fn add_nounce(&mut self, nounce: String) -> Result<()> {
            let caller = self.env().caller();
            if self.vault.contains(&caller) {
                return Err(Error::UserAlreadyExists);
            }
            self.vault.insert(caller, &nounce);
            self.env().emit_event(VaultCreated { owner: caller });
            Ok(())
        }

        /// get nounce from vault
        #[ink(message)]
        pub fn get_nounce(&self) -> Option<String> {
            let caller = self.env().caller();
            if !self.vault.contains(&caller) {
                return None;
            }
            Some(self.vault.get(&caller).unwrap())
        }

        /// remove nounce
        #[ink(message)]
        pub fn remove_nounce(&mut self) -> Result<()> {
            let caller = self.env().caller();
            if !self.vault.contains(&caller) {
                return Err(Error::UserAlreadyExists);
            }
            self.vault.remove(&caller);
            self.env().emit_event(VaultRemoved { owner: caller });
            Ok(())
        }
        /// create a share for a document present in our web3 storage with a wallet address or email address
        #[ink(message)]
        pub fn create_share(
            &mut self,
            entity_id: String,
            file_name: String,
            ipfs_cid: String,
            shared_to: AccountId,
            file_key: String,
            share_id: String,
        ) -> Result<()> {
            let caller = self.env().caller();
            let share = Share {
                entity_id,
                file_name,
                ipfs_cid,
                shared_to,
                shared_at: self.env().block_timestamp(),
                file_key,
                share_id: share_id.clone(),
                shared_by: caller,
            };
            self.shared.insert(share_id.clone(), &share);
            self.shared_items.push(share_id.clone());
            self.env().emit_event(ShareCreated {
                share_id,
                shared_to,
                shared_by: caller,
            });
            Ok(())
        }

        /// get shared Files
        #[ink(message)]
        pub fn get_shared_files(&self) -> Vec<Share> {
            let mut shares = Vec::new();
            for file_id in self.shared_items.iter() {
                let share = self.shared.get(file_id).unwrap();
                shares.push(share);
            }
            shares
        }

        /// get shared Files by sent_by
        #[ink(message)]
        pub fn get_shared_files_by_sent_by(&self) -> Vec<Share> {
            let caller = self.env().caller();
            let mut shares = Vec::new();
            for file_id in self.shared_items.iter() {
                let share = self.shared.get(file_id).unwrap();
                if share.shared_by == caller {
                    shares.push(share);
                }
            }
            shares
        }

        /// get shared Files by sent_to
        #[ink(message)]
        pub fn get_shared_files_by_sent_to(&self) -> Vec<Share> {
            let caller = self.env().caller();
            let mut shares = Vec::new();
            for file_id in self.shared_items.iter() {
                let share = self.shared.get(file_id).unwrap();
                if share.shared_to == caller {
                    shares.push(share);
                }
            }
            shares
        }

        /// Adds User with unique nounce
        #[ink(message)]
        pub fn add_user_with_nounce(
            &mut self,
            email: String,
            phone: String,
            nounce: String,
        ) -> Result<()> {
            let caller = self.env().caller();
            if self.users.contains(&caller) {
                return Err(Error::UserAlreadyExists);
            }

            let user = User {
                email,
                phone,
                address: caller,
            };

            self.users.insert(caller, &user);
            self.users_items.push(caller);

            self.vault.insert(caller, &nounce);

            self.env().emit_event(UserCreated { user: caller });

            Ok(())
        }

        /// Fn that shares a file and automatically sends a reply to the request
        #[ink(message)]
        pub fn share_with_reply(
            &mut self,
            entity_id: String,
            file_name: String,
            ipfs_cid: String,
            shared_to: AccountId,
            file_key: String,
            share_id: String,
            request_id: u64,
            reply_id: u64,
        ) -> Result<()> {
            let caller = self.env().caller();
            let share = Share {
                entity_id,
                file_name,
                ipfs_cid,
                shared_to,
                shared_at: self.env().block_timestamp(),
                file_key,
                share_id: share_id.clone(),
                shared_by: caller.clone(),
            };
            self.shared.insert(share_id.clone(), &share);
            self.shared_items.push(share_id.clone());
            let msg = String::from("The requested file has been shared");

            let reply = Reply {
                request_id,
                reply_id,
                msg,
                sent_by: caller.clone(),
                sent_at: self.env().block_timestamp(),
            };

            self.replies.insert(reply_id, &reply);

            self.replies_items.push(reply_id);

            self.env().emit_event(ShareCreated {
                share_id,
                shared_to,
                shared_by: caller.clone(),
            });
            Ok(())
        }
    }
}

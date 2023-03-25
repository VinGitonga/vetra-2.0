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
        #[ink(topic)]
        msg: String,
    }
    #[ink(event)]
    pub struct ReplyCreated {
        #[ink(topic)]
        reply_id: u64,
        #[ink(topic)]
        request_id: u64,
        #[ink(topic)]
        addressed_to: AccountId,
        #[ink(topic)]
        sent_by: AccountId,
        #[ink(topic)]
        msg: String,
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
        addressed_to: AccountId,
        sent_by: AccountId,
        sent_at: Timestamp,
        request_id: u64,
        document_name: String,
        document_cid: String,
        reply_id: u64,
    }

    impl Default for Reply {
        fn default() -> Self {
            Self {
                msg: String::from(""),
                addressed_to: AccountId::from([0x0; 32]),
                sent_by: AccountId::from([0x0; 32]),
                sent_at: Timestamp::default(),
                request_id: 0,
                document_name: String::from(""),
                document_cid: String::from(""),
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
                msg,
            });
            Ok(())
        }
        ///get request
        #[ink(message)]
        pub fn get_request(&self, request_id: u64) -> Request {
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
                if request.addressed_to == user {
                    requests.push(request);
                }
            }
            requests
        }

        /// get all requests by addressed_to
        #[ink(message)]
        pub fn get_request_by_addressed_to(&self, addressed_to: AccountId) -> Vec<Request> {
            let mut requests = Vec::new();
            for request_id in self.requests_items.iter() {
                let request = self.requests.get(request_id).unwrap();
                if request.addressed_to == user {
                    requests.push(request);
                }
            }
            requests
        }

        /// create new document reply
        #[ink(message)]
        pub fn create_reply(
            &mut self,
            msg: String,
            document_name: String,
            document_cid: String,
            request_id: u64,
            reply_id: u64,
        ) -> Result<()> {
            let caller = self.env().caller();
            let reply = Reply {
                msg,
                addressed_to: self.requests.get(&request_id).unwrap().addressed_to,
                sent_by: caller,
                sent_at: self.env().block_timestamp(),
                request_id: request_id.clone(),
                document_name,
                document_cid,
                reply_id,
            };
            self.replies.insert(reply.reply_id, &reply);
            self.replies_items.push(reply.reply_id);
            self.env().emit_event(ReplyCreated {
                reply_id,
                request_id,
                addressed_to: caller.clone(),
                sent_by: caller.clone(),
                msg,

            });
            Ok(())
        }
        ///get reply
        #[ink(message)]
        pub fn get_reply(&self, reply_id: u64) -> Reply {
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
        /// get all replies by sent_by
        #[ink(message)]
        pub fn get_reply_by_sent_by(&self, sent_by: AccountId) -> Vec<Reply> {
            let mut replies = Vec::new();
            for reply_id in self.replies_items.iter() {
                let reply = self.replies.get(reply_id).unwrap();
                if reply.sent_by == user {
                    replies.push(reply);
                }
            }
            replies
        }
        /// get all replies by addressed_to
        #[ink(message)]
        pub fn get_reply_by_addressed_to(&self, addressed_to: AccountId) -> Vec<Reply> {
            let mut replies = Vec::new();
            for reply_id in self.replies_items.iter() {
                let reply = self.replies.get(reply_id).unwrap();
                if reply.addressed_to == user {
                    replies.push(reply);
                }
            }
            replies
        }

    }
}

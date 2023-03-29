import * as IronSession from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      address?: string;
      email?: string;
      phone?: string;
      secret?: string;
    };
  }
}

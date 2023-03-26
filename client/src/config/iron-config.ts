// lib/config.ts

import {
  iron_session_cookie_name,
  iron_session_pass_key,
  production_mode,
} from "@/../env";

export const ironOptions = {
  cookieName: iron_session_cookie_name,
  password: iron_session_pass_key,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: production_mode,
  },
};

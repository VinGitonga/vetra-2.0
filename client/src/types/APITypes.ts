import { NextApiRequest, NextApiResponse } from "next";

export type AppNextApiRequest = NextApiRequest;

export interface AppNextApiResponse<T = any> extends NextApiResponse<T> {}

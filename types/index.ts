import { NextApiRequest } from "next";

export interface HomeProps {
    isLoggedIn: Boolean;
}

export interface User {
    id?: BigInt,
    google_id: String,
    name: String,
    given_name: String,
    family_name: String,
    picture: String
}

export interface DBToken {
    id: BigInt,
    uuid: String,
    user_id: BigInt,
    revoke: Boolean,
    expire_at: Date
}

export interface FileType {
    id: BigInt,
    uuid: String,
    name: String,
    mime_type: String,
    user_id: BigInt,
    url: String,
}

export type NextApiRequestWithUser = NextApiRequest & {
    user: User
}
  
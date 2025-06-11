import { User } from "./types";

export {}
declare global {
    interface customJwtSessionClaims extends User {}

}
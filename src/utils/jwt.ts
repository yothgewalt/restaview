import { env } from "@restaview/env.mjs";

import { encode, decode } from "next-auth/jwt";

import type { Users } from "@prisma/client";

export type Authentication = Omit<Users, "Password">;

export const tokenOneDay = 24 * 60 * 60;
export const tokenOneWeek = tokenOneDay * 7;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-interface
const createJWT = (token: Authentication, duration: number) => encode({ token, secret: env.JWT_SECRET, maxAge: duration });

export const jwtHelper = {
    createAcessToken: (token: Authentication) => createJWT(token, tokenOneDay),
    createRefreshToken: (token: Authentication) => createJWT(token, tokenOneWeek),
    verifyToken: (token: string) => decode({ token, secret: env.JWT_SECRET })
}

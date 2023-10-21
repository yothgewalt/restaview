import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";

import { db } from "@restaview/server/db";

import argon2 from 'argon2';
import { type Authentication, jwtHelper, tokenOneDay, tokenOneWeek } from "@restaview/utils/jwt";
import type { JWT } from "next-auth/jwt";
import { Statuses } from "@prisma/client";

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/auth/signin'
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60,
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentails",
            credentials: {
                username: {
                    label: "อีเมลของคุณ",
                    type: "email",
                    placeholder: "อีเมล",
                },
                password: {
                    label: "รหัสผ่านของคุณ",
                    type: "password",
                    placeholder: "รหัสผ่าน"
                },
            },
            async authorize(credentials, _request) {
                try {
                    const user = await db.users.findFirst({
                        where: {
                            email_address: credentials?.username,
                        },
                    });

                    if (user && credentials) {
                        const validPassword = await argon2.verify(
                            user.password,
                            credentials?.password,
                        );

                        if (validPassword) {
                            return {
                                id: user.id,
                                email_address: user.email_address,
                                role: user.role as string | undefined,
                                status: user.status as string | undefined
                            };
                        }
                    }
                } catch (error) {
                    console.log(error);
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const authUser = {
                    id: user.id,
                    email_address: user.email_address,
                    role: user.role,
                    status: user.status
                } as Authentication & JWT;

                const accessToken = await jwtHelper.createAcessToken(authUser);
                const refreshToken = await jwtHelper.createRefreshToken(authUser);
                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
                const refreshTokenExpired = Date.now() / 1000 + tokenOneWeek;

                return {
                    ...token, accessToken, refreshToken, accessTokenExpired, refreshTokenExpired,
                    user: authUser
                }
            } else {
                if (token) {
                    if (Date.now() / 1000 > token.accessTokenExpired) {
                        const verifyToken = await jwtHelper.verifyToken(token.refreshToken)

                        if (verifyToken) {
                            const user = await db.users.findFirst({
                                where: {
                                    email_address: token.user.email_address
                                }
                            })

                            if (user) {
                                const accessToken = await jwtHelper.createAcessToken(token.user);
                                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

                                return {
                                    ...token,
                                    accessToken,
                                    accessTokenExpired,
                                }
                            }

                            return {
                                ...token,
                                error: "RefreshAccessTokenError"
                            }
                        }
                    }
                }
            }

            return token
        },

        signIn({ user }) {
            if (user.status === Statuses.SUSPENDED) {
                throw new Error('บัญชีของคุณถูกระงับการใช้งานจากเว็บไซต์ของเรา');
            }

            return true;
        },

        session({ session, token }) {
            if (token) {
                session.user = {
                    user_id: token.user.id,
                    email_address: token.user.email_address,
                    role: token.user.role as string,
                    status: token.user.status as string
                }
            }

            session.error = token.error;

            return session;
        }

    }
};

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};

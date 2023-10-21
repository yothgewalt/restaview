import type { Authentication } from "@restaview/utils/jwt";

declare module "next-auth" {
    interface User {
        user_id?: string;
        email_address?: string;
        role?: string;
        status?: string;
    }

    interface Session {
        user: {
            user_id?: string;
            email_address?: string;
            role?: string;
            status?: string;
        },
        error?: "RefreshAccessTokenError"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: Authentication;
        accessToken: string;
        refreshToken: string;
        accessTokenExpired: number;
        refreshTokenExpired: number;
        error?: "RefreshAccessTokenError"
    }
}

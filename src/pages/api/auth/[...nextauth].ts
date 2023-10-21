import NextAuth from "next-auth";

import { authOptions } from "@restaview/server/auth";

export default NextAuth(authOptions);

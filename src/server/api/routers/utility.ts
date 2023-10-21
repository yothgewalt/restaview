import { createTRPCRouter, protectedProcedure } from "../trpc";

export const utilityRotuer = createTRPCRouter({
    secret: protectedProcedure.query(() => {
        return { secret: "test is secret" };
    }),
});

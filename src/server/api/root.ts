import { createTRPCRouter } from "@restaview/server/api/trpc";
import { userRouter } from "./routers/user";
import { utilityRotuer } from "./routers/utility";
import { reviewRouter } from "./routers/review";
import { restaurantRouter } from "./routers/restaurant";

export const appRouter = createTRPCRouter({
    utility: utilityRotuer,
    user: userRouter,
    review: reviewRouter,
    restaurant: restaurantRouter
});

export type AppRouter = typeof appRouter;

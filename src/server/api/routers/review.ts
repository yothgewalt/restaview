import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { Prisma, type Roles } from "@prisma/client";

const defaultReviewSelector = Prisma.validator<Prisma.ReviewsSelect>()({
    id: true,
    created_at: true,
    updated_at: true,
    user_id: true,
    restaurant_id: true,
    review_text: true,
});

type ReviewResponse = {
    created_at: Date;
    restaurant_id: string;
    restaurant_name: string;
    review_text: string | null;
    author_id: string;
    author: string;
    role: Roles | null;
};

export const reviewRouter = createTRPCRouter({
    createOneReview: protectedProcedure
        .input(
            z.object({
                restaurant_id: z.string(),
                review_text: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const Review = await ctx.db.reviews.findFirst({
                    where: {
                        user_id: ctx.session.user.user_id,
                        restaurant_id: input.restaurant_id
                    }
                });

                if (Review?.user_id) {
                    throw new Error('คุณไม่สามารถรีวิวได้เนื่องจากได้รีวิวไปแล้ว');
                }
            } catch (error) {
                return error
            }

            try {
                const Review = await ctx.db.reviews.create({
                    data: {
                        user_id: String(ctx.session.user.user_id),
                        restaurant_id: input.restaurant_id,
                        review_text: input.review_text
                    }
                });

                await ctx.db.$queryRaw`UPDATE restaurants SET "number_of_reviews" = "number_of_reviews" + 1 WHERE id = ${input.restaurant_id}`;

                return Review;
            } catch (error) {
                return error;
            }
        }),
    getAllReviewByRestaurantID: publicProcedure
        .input(
            z.object({
                restaurant_id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const response: ReviewResponse[] = [];

            const reviews = await ctx.db.reviews.findMany({
                select: defaultReviewSelector,
                where: {
                    restaurant_id: input.restaurant_id
                },
                orderBy: {
                    created_at: 'asc'
                }
            });

            for (const review of reviews) {
                const user = await ctx.db.users.findFirst({
                    where: {
                        id: review.user_id
                    }
                })

                const restaurant = await ctx.db.restaurants.findFirst({
                    where: {
                        id: review.restaurant_id
                    }
                })

                response.push({
                    created_at: review.created_at,
                    restaurant_id: review.restaurant_id,
                    restaurant_name: restaurant!.name,
                    review_text: review.review_text,
                    author_id: user!.id,
                    author: user!.email_address,
                    role: user!.role
                });
            }

            return {
                reviews: response,
            };
        }),
    getLatestReviews: publicProcedure
        .query(async ({ ctx }) => {
            const response: ReviewResponse[] = [];

            const reviews = await ctx.db.reviews.findMany({
                select: defaultReviewSelector,
                where: {},
                orderBy: {
                    created_at: 'asc'
                }
            });

            for (const review of reviews) {
                const user = await ctx.db.users.findFirst({
                    where: {
                        id: review.user_id
                    }
                })

                const restaurant = await ctx.db.restaurants.findFirst({
                    where: {
                        id: review.restaurant_id
                    }
                })

                response.push({
                    created_at: review.created_at,
                    restaurant_id: review.restaurant_id,
                    restaurant_name: restaurant!.name,
                    review_text: review.review_text,
                    author_id: user!.id,
                    author: user!.email_address,
                    role: user!.role
                });
            }

            return {
                reviews: response,
            };
        })
});

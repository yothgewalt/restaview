import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { Prisma, Roles } from "@prisma/client";

const defaultRestaurantSelector = Prisma.validator<Prisma.RestaurantsSelect>()({
    id: true,
    created_at: true,
    updated_at: true,
    enabled: true,
    name: true,
    location: true,
    phone_number: true,
    number_of_reviews: true,
});

export const restaurantRouter = createTRPCRouter({
    createOneRestaurant: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                location: z.string().nullable(),
                phone_number: z.string().nullable()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.user.role != Roles.ADMINISTRATOR) {
                return new Error('คุณไม่มีสิทธิ์มากพอที่จะสร้างร้านอาหาร')
            }

            try {
                const Restaurant = await ctx.db.restaurants.create({
                    data: {
                        enabled: true,
                        name: input.name,
                        location: input.location,
                        phone_number: input.phone_number,
                        number_of_reviews: 0
                    }
                });

                return Restaurant;

            } catch (error) {
                return error;
            }
        }),
    getOneRestaurant: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const Restaurant = await ctx.db.restaurants.findFirst({
                select: defaultRestaurantSelector,
                where: {
                    id: input.id
                },
                orderBy: {
                    created_at: 'asc'
                }
            })

            return Restaurant
        }),
    getLatestRestaurants: publicProcedure
        .query(async ({ ctx }) => {
            const items = await ctx.db.restaurants.findMany({
                select: defaultRestaurantSelector,
                where: {},
                orderBy: {
                    created_at: 'asc'
                }
            });

            return {
                items: items,
            };
        }),
    getRecommendedRestaurants: publicProcedure
        .query(async ({ ctx }) => {
            const items = await ctx.db.restaurants.findMany({
                select: defaultRestaurantSelector,
                take: 6,
                where: {
                    number_of_reviews: {
                        gt: 0,
                    }
                },
                orderBy: {
                    number_of_reviews: 'desc'
                }
            });

            return {
                items: items,
            };
        })
});

import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { Prisma, Roles, Statuses } from '@prisma/client';
import argon2 from 'argon2';

const defaultUsersSelector = Prisma.validator<Prisma.UsersSelect>()({
    id: true,
    created_at: true,
    updated_at: true,
    email_address: true,
    first_name: true,
    last_name: true,
    role: true,
    status: true
});

export const userRouter = createTRPCRouter({
    createOneUser: publicProcedure
        .input(
            z.object({
                email_address: z.string().email(),
                first_name: z.string(),
                last_name: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const Hashed = await argon2.hash(input.password);

            try {
                const User = await ctx.db.users.create({
                    data: {
                        email_address: input.email_address,
                        first_name: input.first_name,
                        last_name: input.last_name,
                        password: Hashed,
                        role: Roles.USER,
                        status: Statuses.NORMAL
                    },
                });

                return User;

            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        return new Error('ดูเหมือนอีเมลจะซ้ำกับผู้ใช้งานคนอื่น');
                    }
                }

                throw error;
            }
        }),
    getOneUserByID: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const Item = await ctx.db.users.findFirst({
                select: defaultUsersSelector,
                where: {
                    id: input.id
                },
            })

            return Item;
        }),
});

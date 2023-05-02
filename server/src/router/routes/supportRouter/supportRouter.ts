import { protectedProcedure, publicProcedure, t } from "../../../trpc/trpc";
import bcrypt from "bcrypt";
import { z } from "zod";
import { TO_REMOVE } from "../../../utils/TO_REMOVE";
import _ from "lodash";
import { removeProperties } from "../../../utils/removeProperties";
import { SUPPORT_CATEGS } from "../../../utils/support";

export const supportRouter = t.router({
    // procedures 
    getReasons: publicProcedure.mutation(async ({ ctx, input }) => {
        return { success:true, data: SUPPORT_CATEGS }
    }),
    createTicket: protectedProcedure
        .input(z.object({
            category: z.enum(SUPPORT_CATEGS as [string, ...string[]], { description: '"Reservation inquiries" | "Billing and payment issues" | "Car availability and selection" | "Pick-up and drop-off procedures" | "Insurance and liability questions" | ... 4 more ... | "General inquiries and feedback"' }).default("General inquiries and feedback").optional(),
            body: z.string().nonempty(),
            file: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            if(input.file){
                
            }
        })
});

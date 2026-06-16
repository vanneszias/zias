import { createDb } from "@zias/db";
import { contacts } from "@zias/db/schema/journal";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../index";

export const contactRouter = router({
  /** Public: submit contact form */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().max(100).optional(),
        email: z.email(),
        message: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ input }) => {
      const db = createDb();
      await db.insert(contacts).values({ id: nanoid(), ...input });
      return { success: true };
    }),

  /** Admin: list all messages */
  list: protectedProcedure.query(async () => {
    const db = createDb();
    return db.query.contacts.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });
  }),

  /** Admin: mark a message as read */
  markRead: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const db = createDb();
    await db
      .update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, input));
    return { success: true };
  }),
});

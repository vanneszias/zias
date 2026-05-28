import { publicProcedure, router } from "../index";
import { contactRouter } from "./contact";
import { journalRouter } from "./journal";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => "OK"),
	journal: journalRouter,
	contact: contactRouter,
});

export type AppRouter = typeof appRouter;

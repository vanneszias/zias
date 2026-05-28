import { TRPCError } from "@trpc/server";
import { calcReadingTime, generateSlug, POST_CATEGORIES } from "@zias/content";
import { createDb } from "@zias/db";
import { posts } from "@zias/db/schema/journal";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../index";

const PostCreateInput = z.object({
	title: z.string().min(1).max(200),
	category: z.enum(POST_CATEGORIES),
	excerpt: z.string().max(500).default(""),
	content: z.string().nullable().default(null),
	isCustomPage: z.boolean().default(false),
	isDraft: z.boolean().default(true),
	slug: z.string().optional(),
	publishedAt: z.string().nullable().optional(),
});

const PostUpdateInput = PostCreateInput.partial().extend({ id: z.string() });

export const journalRouter = router({
	/** Public: list published posts, newest first */
	list: publicProcedure
		.input(
			z.object({
				category: z.enum(POST_CATEGORIES).optional(),
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().default(0),
			}),
		)
		.query(async ({ input }) => {
			const db = createDb();
			const conditions = [
				eq(posts.isDraft, false),
				isNotNull(posts.publishedAt),
			];
			if (input.category) conditions.push(eq(posts.category, input.category));

			return db.query.posts.findMany({
				where: and(...conditions),
				orderBy: [desc(posts.publishedAt)],
				limit: input.limit,
				offset: input.offset,
				columns: {
					id: true,
					slug: true,
					title: true,
					category: true,
					excerpt: true,
					readTime: true,
					publishedAt: true,
					isCustomPage: true,
					isDraft: true,
				},
			});
		}),

	/** Public: get single published post by slug */
	bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
		const db = createDb();
		const post = await db.query.posts.findFirst({
			where: and(eq(posts.slug, input), eq(posts.isDraft, false)),
		});
		if (!post) throw new TRPCError({ code: "NOT_FOUND" });
		return post;
	}),

	/** Admin: list all posts including drafts */
	adminList: protectedProcedure.query(async () => {
		const db = createDb();
		return db.query.posts.findMany({
			orderBy: [desc(posts.createdAt)],
		});
	}),

	/** Admin: create a post */
	create: protectedProcedure
		.input(PostCreateInput)
		.mutation(async ({ input, ctx }) => {
			const db = createDb();
			const slug = input.slug ?? generateSlug(input.title);
			const readTime = input.content ? calcReadingTime(input.content) : 1;

			const [post] = await db
				.insert(posts)
				.values({
					id: nanoid(),
					slug,
					title: input.title,
					category: input.category,
					excerpt: input.excerpt,
					content: input.content,
					readTime,
					isCustomPage: input.isCustomPage,
					isDraft: input.isDraft,
					authorId: ctx.session.user.id,
					publishedAt: input.publishedAt
						? new Date(input.publishedAt)
						: input.isDraft
							? null
							: new Date(),
				})
				.returning();

			return post;
		}),

	/** Admin: update a post */
	update: protectedProcedure
		.input(PostUpdateInput)
		.mutation(async ({ input }) => {
			const db = createDb();
			const { id, content, publishedAt, ...rest } = input;

			const readTime =
				content !== undefined && content !== null
					? calcReadingTime(content)
					: undefined;

			const [updated] = await db
				.update(posts)
				.set({
					...rest,
					...(content !== undefined ? { content } : {}),
					...(readTime !== undefined ? { readTime } : {}),
					...(publishedAt !== undefined
						? {
								publishedAt: publishedAt ? new Date(publishedAt) : null,
							}
						: rest.isDraft === false
							? { publishedAt: new Date() }
							: {}),
				})
				.where(eq(posts.id, id))
				.returning();

			if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
			return updated;
		}),

	/** Admin: delete a post */
	delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
		const db = createDb();
		await db.delete(posts).where(eq(posts.id, input));
		return { success: true };
	}),
});

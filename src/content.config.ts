import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const videos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    youtube_id: z.string().optional(),
    channel: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: ["about.md", "where-to-find-me.md", "paracord.md", "tech.md"],
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    channel_name: z.string().optional(),
  }),
});

const channels = defineCollection({
  loader: file("src/data/channels.yaml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    handle: z.string(),
    url: z.string(),
    page: z.string(),
    description: z.string(),
    subscribers: z.string().default(""),
  }),
});

export const collections = { videos, pages, channels };

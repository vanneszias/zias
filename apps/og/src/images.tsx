import { PostImage, WordImage } from "./layout";
import type { Post } from "./posts";
import { renderPng } from "./render";
import { color, tones, toneForCategory } from "./tokens";

const siteImage = () =>
  renderPng(
    <WordImage
      word="zias."
      tone={tones.cobalt}
      top="Developer and designer"
      bottom="Considered software for people who care"
    />,
  );

export const staticImages = {
  site: siteImage,
  journal: () =>
    renderPng(
      <WordImage
        word="journal."
        tone={tones.butter}
        top="Words / Work / Misc"
        bottom="Writing, case studies and notes"
        arrow={color.cobalt}
      />,
    ),
  privacy: () =>
    renderPng(
      <WordImage
        word="privacy."
        tone={tones.pink}
        top="Privacy / Data"
        bottom="Clear data handling"
        arrow={color.cobalt}
      />,
    ),
  imprint: () =>
    renderPng(
      <WordImage
        word="imprint."
        tone={tones.butter}
        top="Legal / Contact"
        bottom="Who is behind this site"
        arrow={color.cobalt}
      />,
    ),
} satisfies Record<string, () => Promise<Uint8Array>>;

export type StaticImageName = keyof typeof staticImages;

export function postImage(post: Post) {
  const tag = [
    post.categoryLabel,
    post.readTime ? `${post.readTime} min read` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return renderPng(
    <PostImage
      title={post.title}
      tone={toneForCategory(post.categorySlug)}
      tag={tag || "Journal"}
    />,
  );
}

import { Card } from "./layout";
import type { Post } from "./posts";
import { renderPng } from "./render";

export const staticImages = {
  site: () =>
    renderPng(
      <Card text="Developer and designer in Leuven. I build web and mobile apps." />,
    ),
  journal: () => renderPng(<Card text="Journal" />),
  privacy: () => renderPng(<Card text="Privacy" />),
  imprint: () => renderPng(<Card text="Imprint" />),
} satisfies Record<string, () => Promise<Uint8Array>>;

export type StaticImageName = keyof typeof staticImages;

export function postImage(post: Post) {
  return renderPng(
    <Card text={post.title} note={post.categoryLabel ?? "Journal"} />,
  );
}

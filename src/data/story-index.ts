import index from "./story-index.json" with { type: "json" };
import type { GeoStory, RealmId } from "./types.ts";

/** 首页、路由要用的故事概要；由 `npm run story:index` 从完整故事生成 */
export type StoryCard = Pick<GeoStory, "id" | "realm" | "title" | "subtitle" | "badge" | "tags">;

export const storyCards = index as readonly StoryCard[];

export const storyCardsIn = (realm: RealmId): StoryCard[] => storyCards.filter((s) => s.realm === realm);

export const storyCardById = (id: string): StoryCard | undefined => storyCards.find((s) => s.id === id);

/** 完整故事（对白、分镜、测验）单独成包，进入故事 / 展厅或开始搜索时才加载 */
export const loadStories = () => import("./stories.ts");

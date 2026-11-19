import { earthStories } from "./stories-earth.ts";
import { expandedGeoStories, introGeoStories } from "./stories-expanded.ts";
import { worldGeoStories } from "./stories-world.ts";
import type { GeoStory, RealmId } from "./types.ts";

export const allStories: readonly GeoStory[] = [
  ...introGeoStories,
  ...earthStories,
  ...worldGeoStories,
  ...expandedGeoStories
];

export function storiesIn(realm: RealmId): GeoStory[] {
  return allStories.filter((s) => s.realm === realm);
}

export function storyById(id: string): GeoStory | undefined {
  return allStories.find((s) => s.id === id);
}

import { S } from "./sbg-settings-store.js";
import { makeKeySet } from "./sbg-keyset.js";

// A favorite is never pruned, so one on a deleted file matches again if the
// file comes back.
const _favorites = makeKeySet(S.FAVORITE_MEDIA, "sbg-favorites-changed");

export const favKey = _favorites.key;
export const favoriteKeys = _favorites.all;
export const isFavorite = _favorites.has;
export const toggleFavorite = _favorites.toggle;
export const hasFavoritesFor = _favorites.hasRoot;

export const favoriteTitle = (on) => (on ? "取消收藏" : "添加收藏");

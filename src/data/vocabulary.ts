import { VocabularyWord, WorldId } from '../types';
import { WORLDS } from './worlds';

export function getWorldVocabulary(worldId: WorldId): VocabularyWord[] {
  const world = WORLDS.find((w) => w.id === worldId);
  return world ? world.vocabulary : [];
}

export const ALL_VOCABULARY: VocabularyWord[] = WORLDS.flatMap((world) => world.vocabulary);

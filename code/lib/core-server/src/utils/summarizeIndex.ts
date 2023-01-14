import type { IndexEntry, StoryIndex } from '@storybook/types';

import { STORIES_MDX_TAG, isMdxEntry, AUTODOCS_TAG, PLAY_FN_TAG } from './StoryIndexGenerator';

const PAGE_REGEX = /(page|screen)/i;

export const isPageStory = (storyId: string) => PAGE_REGEX.test(storyId);

/**
 * Filter out example stories that are generated by the CLI
 */
const isExampleEntry = (entry: IndexEntry) => {
  return [
    'example-introduction--docs',
    'example-button--docs',
    'example-button--primary',
    'example-button--secondary',
    'example-button--large',
    'example-button--small',
    'example-header--docs',
    'example-header--logged-in',
    'example-header--logged-out',
    'example-page--logged-in',
    'example-page--logged-out',
  ].includes(entry.id);
};

export function summarizeIndex(storyIndex: StoryIndex) {
  let storyCount = 0;
  let exampleStoryCount = 0;
  let exampleDocsCount = 0;
  let pageStoryCount = 0;
  let playStoryCount = 0;
  let autodocsCount = 0;
  let storiesMdxCount = 0;
  let mdxCount = 0;
  Object.values(storyIndex.entries).forEach((entry) => {
    if (isExampleEntry(entry)) {
      if (entry.type === 'story') exampleStoryCount += 1;
      if (entry.type === 'docs') exampleDocsCount += 1;
    } else if (entry.type === 'story') {
      storyCount += 1;
      if (isPageStory(entry.title)) {
        pageStoryCount += 1;
      }
      if (entry.tags?.includes(PLAY_FN_TAG)) {
        playStoryCount += 1;
      }
    } else if (entry.type === 'docs') {
      if (isMdxEntry(entry)) {
        mdxCount += 1;
      } else if (entry.tags?.includes(STORIES_MDX_TAG)) {
        storiesMdxCount += 1;
      } else if (entry.tags?.includes(AUTODOCS_TAG)) {
        autodocsCount += 1;
      }
    }
  });
  return {
    storyCount,
    pageStoryCount,
    playStoryCount,
    autodocsCount,
    storiesMdxCount,
    mdxCount,
    exampleStoryCount,
    exampleDocsCount,
    version: storyIndex.v,
  };
}

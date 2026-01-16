import { WithId } from 'mongodb';

import { PostEntityType } from '../../types';

import { mapToPostViewModel } from './map-to-post-view-model';

type Args = {
  items: WithId<PostEntityType>[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export const mapToPostListViewModel = (args: Args) => {
  const { pageNumber, pageSize, items, totalCount } = args;

  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToPostViewModel),
  };
};

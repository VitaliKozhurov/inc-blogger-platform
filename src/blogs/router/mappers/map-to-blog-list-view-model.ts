import { WithId } from 'mongodb';

import { BlogEntityType } from '../../types';

import { mapToBlogViewModel } from './map-to-blog-view-model';

type Args = {
  items: WithId<BlogEntityType>[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export const mapToBlogListViewModel = (args: Args) => {
  const { pageNumber, pageSize, items, totalCount } = args;

  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToBlogViewModel),
  };
};

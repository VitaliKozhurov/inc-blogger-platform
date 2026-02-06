import { Sort } from 'mongodb';

import { SortDirection } from '../types/sort';

type Args = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};

export const getPaginationParams = ({ pageNumber, pageSize, sortBy, sortDirection }: Args) => {
  const sort: Sort = { [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 };
  const skip = (pageNumber - 1) * pageSize;

  return {
    sort,
    skip,
    limit: pageSize,
  };
};

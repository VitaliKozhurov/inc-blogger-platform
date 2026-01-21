import { Nullable } from '../../core/types';
import { SortDirection } from '../../core/types/sort';

import { UserSortFields } from './user-fields';

export type UserRequestQueryType = {
  searchLoginTerm: Nullable<string>;
  searchEmailTerm: Nullable<string>;
  sortBy: UserSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

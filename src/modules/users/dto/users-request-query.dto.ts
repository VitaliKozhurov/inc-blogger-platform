import { Nullable } from '../../../core/types';
import { SortDirection } from '../../../core/types/sort';
import { UserSortFields } from '../types/user-sort-fields.types';

export type UsersRequestQueryDTO = {
  searchLoginTerm?: Nullable<string>;
  searchEmailTerm?: Nullable<string>;
  sortBy: UserSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

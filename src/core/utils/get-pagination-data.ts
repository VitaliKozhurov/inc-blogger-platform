type Args<T> = { pageNumber: number; pageSize: number; items: T[]; totalCount: number };

export const getPaginationData = <T>(args: Args<T>) => {
  const { pageNumber, pageSize, items, totalCount } = args;

  return {
    pageCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};

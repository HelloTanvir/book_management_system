export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface DataWithId {
  id: string | number;
}

export interface TimeStampData {
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityData extends DataWithId, TimeStampData {}

export interface Column {
  key: string;
  label: string;
}

export interface SortableTableProps<T> {
  data: T[];
  columns: Column[];
  sortKey: keyof T;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof T) => void;
}
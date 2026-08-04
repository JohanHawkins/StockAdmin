export type ProductStatus = 'Activo' | 'Inactivo';

export interface Product {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  categoryCode: string;
  status: ProductStatus;
}

export interface ImportError {
  code?: string;
  row: number;
  message: string;
}

export interface ImportResult {
  created: number;
  createdCodes: string[];
  skipped: number;
  skippedCodes: string[];
  errors: ImportError[];
}

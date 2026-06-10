export interface Movement {
  id: string;
  productCode: string;
  type: 'ENTRADA' | 'SALIDA';
  quantity: number;
  date: Date;
}

export interface Movement {
  code: string;
  productCode: string;
  type: 'ENTRADA' | 'SALIDA';
  quantity: number;
  date: Date;
  observation: string;
}

export interface CreateProductDto {
  groupId: string;
  label: string;
  type: 'PRIZE' | 'SUPPLY' | 'MACHINE';
  quantity: number;
  cost: number;
}

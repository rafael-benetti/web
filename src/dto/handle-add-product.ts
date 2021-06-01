export interface HandleAddProductDto {
  groupId: string;
  quantity: number;
  type: 'PRIZE' | 'SUPPLY';
  cost: number;
}

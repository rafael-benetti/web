interface TransferTo {
  id: string;
  type: 'GROUP' | 'USER' | 'MACHINE';
  boxId?: string;
}

interface TransferFrom {
  id: string;
  type: 'GROUP' | 'USER' | 'MACHINE';
  boxId?: string;
}

export interface TransferProductDto {
  from: TransferFrom;
  productType: 'PRIZE' | 'SUPPLY';
  productQuantity: number;
  cost?: number;
  to: TransferTo;
}

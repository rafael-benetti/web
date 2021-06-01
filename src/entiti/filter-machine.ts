export interface FilterMachineDto {
  groupId?: string;
  categoryId?: string;
  routeId?: string;
  pointOfSaleId?: string | null;
  serialNumber?: string;
  isActive?: boolean;
  telemetryStatus?: 'ONLINE' | 'OFFLINE' | 'VIRGIN' | 'NO_TELEMETRY' | 'none';
  lean?: boolean;
}

export interface FilterMachinePage {
  groupId?: { label: string; value: string };
  categoryId?: { label: string; value: string };
  routeId?: { label: string; value: string };
  pointOfSaleId?: { label: string; value: string | null };
  serialNumber?: string;
  isActive?: boolean;
  telemetryStatus?: {
    label: string;
    value: 'ONLINE' | 'OFFLINE' | 'VIRGIN' | 'NO_TELEMETRY' | 'none';
  };
  lean?: boolean;
}

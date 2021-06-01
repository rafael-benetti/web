export interface MachineLog {
  createdAt: string;
  createdBy: string;
  groupId: string;
  machineId: string;
  observations: string;
  quantity: number;
  type: 'FIX_STOCK' | 'REMOTE_CREDIT';
}

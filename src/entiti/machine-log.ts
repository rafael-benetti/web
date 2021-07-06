export interface MachineLog {
  createdAt: string;
  createdBy: string;
  groupId: string;
  machineId: string;
  observations: string;
  quantity: number;
  user: { name: string };
  type: 'FIX_STOCK' | 'REMOTE_CREDIT';
}

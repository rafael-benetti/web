export interface OperatorPermissions {
  editMachines: boolean;
  deleteMachines: boolean;

  toggleMaintenanceMode: boolean;
  addRemoteCredit: boolean;

  editCollections: boolean;
  deleteCollections: boolean;

  fixMachineStock: boolean;
}
export interface HandleOperatorDto {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  groupIds: string[];
  isActive?: boolean;
  permissions: OperatorPermissions;
}

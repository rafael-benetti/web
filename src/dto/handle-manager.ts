export interface ManagerPermissions {
  createMachines: boolean;
  editMachines: boolean;
  deleteMachines: boolean;
  createProducts: boolean;
  editProducts: boolean;
  deleteProducts: boolean;
  createCategories: boolean;
  editCategories: boolean;
  deleteCategories: boolean;
  createGroups: boolean;
  editGroups: boolean;
  deleteGroups: boolean;
  createPointsOfSale: boolean;
  editPointsOfSale: boolean;
  deletePointsOfSale: boolean;
  createRoutes: boolean;
  editRoutes: boolean;
  deleteRoutes: boolean;
  listOperators: boolean;
  createOperators: boolean;
  listManagers: boolean;
  createManagers: boolean;
  toggleMaintenanceMode: boolean;
  addRemoteCredit: boolean;
  generateReports: boolean;
  fixMachineStock: boolean;
}

export interface HandleManagerDto {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  groupIds: string[];
  isActive?: boolean;
  permissions: ManagerPermissions;
}

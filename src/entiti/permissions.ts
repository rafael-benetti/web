export interface Permissions {
  createMachines: boolean;
  editMachines: boolean;
  deleteMachines: boolean;

  createProducts: boolean;
  editProducts: boolean;
  deleteProducts: boolean;
  transferProducts: boolean;

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
  editOperators: boolean;
  deleteOperators: boolean;

  listManagers: boolean;
  createManagers: boolean;
  editManagers: boolean;
  deleteManagers: boolean;

  toggleMaintenanceMode: boolean;
  addRemoteCredit: boolean;

  generateReports: boolean;
}

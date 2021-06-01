import { Stock } from './stock';

export interface Photo {
  key: string;
  downloadUrl: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: number;
  groupIds: string[];
  photo: Photo;
  phoneNumber?: string;
  role: 'OWNER' | 'MANAGER' | 'OPERATOR';
  stock?: Stock;
  permissions?: {
    createMachines?: boolean;
    editMachines?: boolean;
    deleteMachines?: boolean;
    createProducts?: boolean;
    editProducts?: boolean;
    deleteProducts?: boolean;
    createCategories?: boolean;
    editCategories?: boolean;
    deleteCategories?: boolean;
    createGroups?: boolean;
    editGroups?: boolean;
    deleteGroups?: boolean;
    createPointsOfSale?: boolean;
    editPointsOfSale?: boolean;
    deletePointsOfSale?: boolean;
    createRoutes?: boolean;
    editRoutes?: boolean;
    deleteRoutes?: boolean;
    listOperators?: boolean;
    createOperators?: boolean;
    listManagers?: boolean;
    createManagers?: boolean;
    toggleMaintenanceMode?: boolean;
    addRemoteCredit?: boolean;
    generateReports?: boolean;
    editCollections?: boolean;
    deleteCollections?: boolean;
    fixMachineStock?: boolean;
  };
}

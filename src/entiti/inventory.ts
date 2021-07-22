export interface Inventory {
  machinesPerCategory: {
    categoryLabel: string;
    totalInOperation: number;
    totalInStock: number;
  }[];
  prizes: {
    prizeLabel: string;
    groupsTotalPrizes: number;
    machinesTotalPrizes: number;
    usersTotalPrizes: number;
  }[];
  supplies: {
    supplieLabel: string;
    groupsTotalSupplies: number;
    usersTotalSupplies: number;
  }[];
}

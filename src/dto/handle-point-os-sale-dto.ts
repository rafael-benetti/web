import { Address } from '../entiti/address';

export interface HandlePointOfSaleDto {
  id?: string;
  ownerId: string;
  groupId: string;
  label: string;
  contactName: string;
  address: Address;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  rent: string;
  isPercentage: boolean;
}

export interface EditPointOfSaleDto {
  label: string;
  contactName: string;
  address?: { extraInfo?: string };
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  rent?: string;
  isPercentage?: boolean;
}

export interface EditRentDto {
  rent: string;
  isPercentage: boolean;
}

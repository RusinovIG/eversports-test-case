export interface CreateMembershipRequest {
  name: string;
  recurringPrice: number;
  paymentMethod: string;
  billingPeriods: number;
  billingInterval: string;
  validFrom?: string;
  userId: number;
}

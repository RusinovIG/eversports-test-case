import { MembershipState } from './MembershipState';
import { BillingInterval } from './BillingInterval';

export interface Membership {
  id?: number;
  uuid: string;
  name: string;
  user: number;
  state: MembershipState;
  validFrom: Date;
  validUntil: Date;
  assignedBy?: string;
  paymentMethod?: string;
  recurringPrice: number;
  billingPeriods: number;
  billingInterval: BillingInterval;
}

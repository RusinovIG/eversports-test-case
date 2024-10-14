import { MembershipPeriodState } from './';

export interface MembershipPeriod {
  id: number;
  uuid: string;
  membership: number;
  start: Date;
  end: Date;
  state: MembershipPeriodState;
}

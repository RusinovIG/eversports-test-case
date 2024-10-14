import { Membership, MembershipPeriod } from '../models';
import membershipsJson from '../../data/memberships.json';
import membershipPeriodsJson from '../../data/membership-periods.json';

class MembershipsRepository {
  private memberships: Membership[];
  private membershipPeriods: MembershipPeriod[];

  constructor() {
    this.memberships = this.loadMemberships();
    this.membershipPeriods = this.loadMembershipPeriods();
  }

  public getMemberships(): Membership[] {
    return this.memberships;
  }

  public getMembershipPeriods(membershipId: number): MembershipPeriod[] {
    return this.membershipPeriods.filter(
      (p: MembershipPeriod) => p.membership === membershipId,
    );
  }

  public createMembership(membership: Membership) {
    membership.id = this.memberships.length + 1;
    this.memberships.push(membership);
  }

  public createMembershipPeriod(period: MembershipPeriod) {
    this.membershipPeriods.push(period);
  }

  private loadMemberships(): Membership[] {
    return membershipsJson.map((membership: any) => ({
      ...membership,
      validFrom: new Date(membership.validFrom),
      validUntil: new Date(membership.validUntil),
    }));
  }

  private loadMembershipPeriods(): MembershipPeriod[] {
    return membershipPeriodsJson.map((period: any) => ({
      ...period,
      start: new Date(period.start),
      end: new Date(period.end),
    }));
  }
}

export default MembershipsRepository;

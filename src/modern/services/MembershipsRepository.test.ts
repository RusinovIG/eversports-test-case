import MembershipsRepository from './MembershipsRepository';
import {
  BillingInterval,
  Membership,
  MembershipPeriod,
  MembershipPeriodState,
  MembershipState,
} from '../models';
import membershipsData from '../../data/memberships.json';
import membershipPeriodsData from '../../data/membership-periods.json';

describe('MembershipsRepository', () => {
  let membershipsRepository: MembershipsRepository;

  beforeEach(() => {
    membershipsRepository = new MembershipsRepository();
  });

  it('should load memberships from JSON', () => {
    const memberships = membershipsRepository.getMemberships();
    const expectedMemberships = membershipsData.map((membership) => ({
      ...membership,
      validFrom: new Date(membership.validFrom),
      validUntil: new Date(membership.validUntil),
    }));
    expect(memberships).toEqual(expectedMemberships);
  });

  it('should load membership periods from JSON', () => {
    const membershipPeriods = membershipsRepository.getMembershipPeriods(1);
    const expectedPeriods = membershipPeriodsData
      .filter((period) => period.membership === 1)
      .map((period) => ({
        ...period,
        start: new Date(period.start),
        end: new Date(period.end),
      }));
    expect(membershipPeriods).toEqual(expectedPeriods);
  });

  it('should create a new membership', () => {
    const newMembership: Membership = {
      id: 0,
      uuid: 'new-uuid',
      name: 'New Membership',
      state: MembershipState.ACTIVE,
      user: 1,
      paymentMethod: 'credit_card',
      recurringPrice: 100,
      billingPeriods: 3,
      billingInterval: BillingInterval.MONTHLY,
      validFrom: new Date(),
      validUntil: new Date(),
    };

    membershipsRepository.createMembership(newMembership);
    const memberships = membershipsRepository.getMemberships();
    expect(memberships).toContainEqual(
      expect.objectContaining({ uuid: 'new-uuid' }),
    );
  });

  it('should create a new membership period', () => {
    const newPeriod: MembershipPeriod = {
      id: 0,
      uuid: 'new-period-uuid',
      membership: 1,
      start: new Date(),
      end: new Date(),
      state: MembershipPeriodState.PLANNED,
    };

    membershipsRepository.createMembershipPeriod(newPeriod);
    const membershipPeriods = membershipsRepository.getMembershipPeriods(1);
    expect(membershipPeriods).toContainEqual(
      expect.objectContaining({ uuid: 'new-period-uuid' }),
    );
  });
});

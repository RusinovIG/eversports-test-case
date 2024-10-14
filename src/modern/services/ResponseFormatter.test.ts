import ResponseFormatter from './ResponseFormatter';
import {
  BillingInterval,
  Membership,
  MembershipPeriod,
  MembershipPeriodState,
  MembershipState,
} from '../models';

describe('ResponseFormatter', () => {
  let responseFormatter: ResponseFormatter;

  beforeEach(() => {
    responseFormatter = new ResponseFormatter();
  });

  const createTestMembership = (): Membership => ({
    id: 1,
    uuid: 'uuid1',
    name: 'Test Membership',
    state: MembershipState.ACTIVE,
    validFrom: new Date('2023-01-01T00:00:00.000Z'),
    validUntil: new Date('2023-12-31T00:00:00.000Z'),
    user: 1,
    paymentMethod: 'credit_card',
    recurringPrice: 100,
    billingPeriods: 12,
    billingInterval: BillingInterval.MONTHLY,
  });

  const createTestPeriods = (): MembershipPeriod[] => [
    {
      id: 1,
      uuid: 'period1',
      membership: 1,
      start: new Date('2023-01-01T00:00:00.000Z'),
      end: new Date('2023-01-31T00:00:00.000Z'),
      state: MembershipPeriodState.PLANNED,
    },
  ];

  it('should format date correctly', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const formattedDate = responseFormatter['formatDate'](date);
    expect(formattedDate).toBe('2023-01-01');
  });

  it('should format membership response correctly', () => {
    const membership = createTestMembership();
    const periods = createTestPeriods();

    const formattedResponse = responseFormatter.formatMembershipResponse(
      membership,
      periods,
    );
    expect(formattedResponse).toEqual({
      membership: {
        ...membership,
        validFrom: '2023-01-01',
        validUntil: '2023-12-31',
      },
      periods: [
        {
          ...periods[0],
          start: '2023-01-01',
          end: '2023-01-31',
        },
      ],
    });
  });

  it('should format memberships with periods correctly', () => {
    const membership = createTestMembership();
    const periods = createTestPeriods();

    const membershipsWithPeriods = [
      {
        membership,
        periods,
      },
    ];

    const formattedResponse = responseFormatter.formatMembershipsWithPeriods(
      membershipsWithPeriods,
    );
    expect(formattedResponse).toEqual([
      {
        membership: {
          ...membershipsWithPeriods[0].membership,
          validFrom: '2023-01-01',
          validUntil: '2023-12-31',
        },
        periods: [
          {
            ...membershipsWithPeriods[0].periods[0],
            start: '2023-01-01',
            end: '2023-01-31',
          },
        ],
      },
    ]);
  });
});

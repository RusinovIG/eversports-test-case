import MembershipService from './MembershipService';
import MembershipsRepository from './MembershipsRepository';
import {
  CreateMembershipRequest,
  MembershipState,
  MembershipPeriodState,
} from '../models';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('MembershipService', () => {
  let membershipsRepository: jest.Mocked<MembershipsRepository>;
  let membershipService: MembershipService;

  beforeEach(() => {
    membershipsRepository = {
      createMembership: jest.fn(),
      createMembershipPeriod: jest.fn(),
      getMemberships: jest.fn(),
      getMembershipPeriods: jest.fn(),
    } as unknown as jest.Mocked<MembershipsRepository>;

    membershipService = new MembershipService(membershipsRepository);
  });

  const testCases = [
    {
      description: 'should create an active membership',
      request: {
        name: 'Active Membership',
        userId: 1,
        paymentMethod: 'credit_card',
        recurringPrice: 100,
        billingPeriods: 3,
        billingInterval: 'monthly',
        validFrom: new Date().toISOString(),
      },
      expectedState: MembershipState.ACTIVE,
    },
    {
      description: 'should create a pending membership',
      request: {
        name: 'Pending Membership',
        userId: 1,
        paymentMethod: 'credit_card',
        recurringPrice: 100,
        billingPeriods: 3,
        billingInterval: 'monthly',
        validFrom: new Date(Date.now() + 86400000).toISOString(), // 1 day in the future
      },
      expectedState: MembershipState.PENDING,
    },
    {
      description: 'should create an expired membership',
      request: {
        name: 'Expired Membership',
        userId: 1,
        paymentMethod: 'credit_card',
        recurringPrice: 100,
        billingPeriods: 3,
        billingInterval: 'monthly',
        validFrom: new Date(Date.now() - 31536000000).toISOString(), // 1 year in the past
      },
      expectedState: MembershipState.EXPIRED,
    },
  ];

  testCases.forEach(({ description, request, expectedState }) => {
    it(description, () => {
      const result = membershipService.createMembership(
        request as CreateMembershipRequest,
      );

      expect(membershipsRepository.createMembership).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: 'mock-uuid',
          name: request.name,
          state: expectedState,
          user: request.userId,
          paymentMethod: request.paymentMethod,
          recurringPrice: request.recurringPrice,
          billingPeriods: request.billingPeriods,
          billingInterval: request.billingInterval,
        }),
      );

      expect(
        membershipsRepository.createMembershipPeriod,
      ).toHaveBeenCalledTimes(request.billingPeriods);
      expect(result.membershipPeriods).toHaveLength(request.billingPeriods);
      expect(result.membershipPeriods[0]).toEqual(
        expect.objectContaining({
          id: 1,
          uuid: 'mock-uuid',
          membership: result.membership.id,
          state: MembershipPeriodState.PLANNED,
        }),
      );
    });
  });
});

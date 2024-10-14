import {
  BillingInterval,
  CreateMembershipRequest,
  Membership,
  MembershipPeriod,
  MembershipPeriodState,
  MembershipState,
} from '../models';
import { v4 as uuidv4 } from 'uuid';
import MembershipsRepository from './MembershipsRepository';

class MembershipService {
  private membershipsRepository: MembershipsRepository;

  constructor(membershipsRepository: MembershipsRepository) {
    this.membershipsRepository = membershipsRepository;
  }

  createMembership(data: CreateMembershipRequest) {
    const validFrom = data.validFrom ? new Date(data.validFrom) : new Date();
    const validUntil = this.calculateValidUntil(
      validFrom,
      data.billingInterval,
      data.billingPeriods,
    );

    const state = this.getMembershipState(validFrom, validUntil);

    const membership: Membership = {
      uuid: uuidv4(),
      name: data.name,
      state,
      validFrom,
      validUntil,
      user: data.userId,
      paymentMethod: data.paymentMethod,
      recurringPrice: data.recurringPrice,
      billingPeriods: data.billingPeriods,
      billingInterval: data.billingInterval as BillingInterval,
    };

    this.membershipsRepository.createMembership(membership);

    const membershipPeriods = this.createMembershipPeriods(membership);

    return { membership, membershipPeriods };
  }

  private calculateValidUntil(
    validFrom: Date,
    billingInterval: string,
    billingPeriods: number,
  ): Date {
    const validUntil = new Date(validFrom);
    if (billingInterval === 'monthly') {
      validUntil.setMonth(validFrom.getMonth() + billingPeriods);
    } else if (billingInterval === 'yearly') {
      validUntil.setMonth(validFrom.getMonth() + billingPeriods * 12);
    } else if (billingInterval === 'weekly') {
      validUntil.setDate(validFrom.getDate() + billingPeriods * 7);
    }
    return validUntil;
  }

  private getMembershipState(
    validFrom: Date,
    validUntil: Date,
  ): MembershipState {
    const now = new Date();
    if (validFrom > now) return MembershipState.PENDING;
    if (validUntil < now) return MembershipState.EXPIRED;
    return MembershipState.ACTIVE;
  }

  private createMembershipPeriods(membership: Membership): MembershipPeriod[] {
    const membershipPeriods: MembershipPeriod[] = [];
    let periodStart = membership.validFrom;
    for (let i = 0; i < membership.billingPeriods; i++) {
      const periodValidFrom = periodStart;
      const periodValidUntil = new Date(periodValidFrom);
      if (membership.billingInterval === BillingInterval.MONTHLY) {
        periodValidUntil.setMonth(periodValidFrom.getMonth() + 1);
      } else if (membership.billingInterval === BillingInterval.YEARLY) {
        periodValidUntil.setMonth(periodValidFrom.getMonth() + 12);
      } else if (membership.billingInterval === BillingInterval.WEEKLY) {
        periodValidUntil.setDate(periodValidFrom.getDate() + 7);
      }

      const period: MembershipPeriod = {
        id: i + 1, // id is unique per membership only
        uuid: uuidv4(),
        membership: membership.id as number,
        start: periodValidFrom,
        end: periodValidUntil,
        state: MembershipPeriodState.PLANNED,
      };

      this.membershipsRepository.createMembershipPeriod(period);
      membershipPeriods.push(period);
      periodStart = periodValidUntil;
    }
    return membershipPeriods;
  }

  public getMembershipsWithPeriods() {
    const memberships = this.membershipsRepository.getMemberships();
    return memberships.map((membership: Membership) => {
      return {
        membership,
        periods: this.membershipsRepository.getMembershipPeriods(
          membership.id as number,
        ),
      };
    });
  }
}

export default MembershipService;

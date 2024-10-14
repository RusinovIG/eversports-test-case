import { Membership, MembershipPeriod } from '../models';

class ResponseFormatter {
  /**
   * Formats membership and its periods, applying date formatting to "validFrom" and "validUntil"
   * @param membership Membership
   * @param periods Array of membership periods
   */
  public formatMembershipResponse(
    membership: Membership,
    periods: MembershipPeriod[],
  ) {
    return {
      membership: {
        ...membership,
        validFrom: this.formatDate(membership.validFrom),
        validUntil: this.formatDate(membership.validUntil),
      },
      periods: periods.map((period) => ({
        ...period,
        start: this.formatDate(period.start),
        end: this.formatDate(period.end),
      })),
    };
  }

  /**
   * Formats an array of memberships and their periods
   * @param membershipsWithPeriods Array of memberships with periods
   */
  public formatMembershipsWithPeriods(
    membershipsWithPeriods: {
      membership: Membership;
      periods: MembershipPeriod[];
    }[],
  ) {
    return membershipsWithPeriods.map((item) =>
      this.formatMembershipResponse(item.membership, item.periods),
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

export default ResponseFormatter;

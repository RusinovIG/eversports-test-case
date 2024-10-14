import { Request, Response, NextFunction } from 'express';
import { BillingInterval, CreateMembershipRequest } from '../models';

export const validateCreateMembership = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body: CreateMembershipRequest = req.body;

  if (!body.name || body.recurringPrice == null) {
    return res.status(400).json({ message: 'missingMandatoryFields' });
  }

  if (body.recurringPrice < 0) {
    return res.status(400).json({ message: 'negativeRecurringPrice' });
  }

  if (body.recurringPrice > 100 && body.paymentMethod === 'cash') {
    return res.status(400).json({ message: 'cashPriceBelow100' });
  }

  if (body.billingInterval === BillingInterval.MONTHLY) {
    if (body.billingPeriods > 12) {
      return res
        .status(400)
        .json({ message: 'billingPeriodsMoreThan12Months' });
    }
    if (body.billingPeriods < 6) {
      return res.status(400).json({ message: 'billingPeriodsLessThan6Months' });
    }
  } else if (body.billingInterval === BillingInterval.YEARLY) {
    if (body.billingPeriods > 10) {
      return res.status(400).json({ message: 'billingPeriodsMoreThan10Years' });
    } else if (body.billingPeriods < 3) {
      return res.status(400).json({ message: 'billingPeriodsLessThan3Years' });
    }
  } else if (body.billingInterval !== BillingInterval.WEEKLY) {
    return res.status(400).json({ message: 'invalidBillingPeriods' });
  }

  next();
};

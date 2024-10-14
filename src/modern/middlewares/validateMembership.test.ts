import request from 'supertest';
import express from 'express';
import { validateCreateMembership } from './validateMembership';

const app = express();
app.use(express.json());
app.post('/membership', validateCreateMembership, (req, res) => {
  res.status(200).json({ message: 'success' });
});

describe('validateCreateMembership Middleware', () => {
  const errorCases = [
    {
      description: 'name or recurringPrice is missing',
      payload: {
        paymentMethod: 'credit_card',
        billingPeriods: 6,
        billingInterval: 'monthly',
      },
      expectedMessage: 'missingMandatoryFields',
    },
    {
      description: 'recurringPrice is negative',
      payload: {
        name: 'Test',
        recurringPrice: -1,
        paymentMethod: 'credit_card',
        billingPeriods: 6,
        billingInterval: 'monthly',
      },
      expectedMessage: 'negativeRecurringPrice',
    },
    {
      description:
        'recurringPrice is greater than 100 and paymentMethod is cash',
      payload: {
        name: 'Test',
        recurringPrice: 101,
        paymentMethod: 'cash',
        billingPeriods: 6,
        billingInterval: 'monthly',
      },
      expectedMessage: 'cashPriceBelow100',
    },
    {
      description: 'billingPeriods is more than 12 for monthly billingInterval',
      payload: {
        name: 'Test',
        recurringPrice: 50,
        paymentMethod: 'credit_card',
        billingPeriods: 13,
        billingInterval: 'monthly',
      },
      expectedMessage: 'billingPeriodsMoreThan12Months',
    },
    {
      description: 'billingPeriods is less than 6 for monthly billingInterval',
      payload: {
        name: 'Test',
        recurringPrice: 50,
        paymentMethod: 'credit_card',
        billingPeriods: 5,
        billingInterval: 'monthly',
      },
      expectedMessage: 'billingPeriodsLessThan6Months',
    },
    {
      description: 'billingPeriods is more than 10 for yearly billingInterval',
      payload: {
        name: 'Test',
        recurringPrice: 50,
        paymentMethod: 'credit_card',
        billingPeriods: 11,
        billingInterval: 'yearly',
      },
      expectedMessage: 'billingPeriodsMoreThan10Years',
    },
    {
      description: 'billingPeriods is less than 3 for yearly billingInterval',
      payload: {
        name: 'Test',
        recurringPrice: 50,
        paymentMethod: 'credit_card',
        billingPeriods: 2,
        billingInterval: 'yearly',
      },
      expectedMessage: 'billingPeriodsLessThan3Years',
    },
    {
      description: 'billingInterval is invalid',
      payload: {
        name: 'Test',
        recurringPrice: 50,
        paymentMethod: 'credit_card',
        billingPeriods: 6,
        billingInterval: 'daily',
      },
      expectedMessage: 'invalidBillingPeriods',
    },
  ];

  errorCases.forEach(({ description, payload, expectedMessage }) => {
    it('should return 400 if ' + description, async () => {
      const response = await request(app).post('/membership').send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(expectedMessage);
    });
  });

  it('should pass validation for valid input', async () => {
    const response = await request(app).post('/membership').send({
      name: 'Test',
      recurringPrice: 50,
      paymentMethod: 'credit_card',
      billingPeriods: 6,
      billingInterval: 'monthly',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
});

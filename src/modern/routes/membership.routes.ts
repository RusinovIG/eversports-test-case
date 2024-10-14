import express, { Request, Response } from 'express';

import MembershipsRepository from '../services/MembershipsRepository';
import MembershipService from '../services/MembershipService';
import { validateCreateMembership } from '../middlewares';
import ResponseFormatter from '../services/ResponseFormatter';

const router = express.Router();

const membershipsRepository = new MembershipsRepository();
const membershipService = new MembershipService(membershipsRepository);
const responseFormatter = new ResponseFormatter();

/**
 * Create a new membership
 */
router.post('/', validateCreateMembership, (req: Request, res: Response) => {
  const userId = 2000;
  const createMembershipRequest = { ...req.body, userId };

  const { membership, membershipPeriods } = membershipService.createMembership(
    createMembershipRequest,
  );
  res
    .status(201)
    .json(
      responseFormatter.formatMembershipResponse(membership, membershipPeriods),
    );
});

/**
 * List all memberships
 */
router.get('/', (req: Request, res: Response) => {
  const memberships = membershipService.getMembershipsWithPeriods();
  res
    .status(200)
    .json(responseFormatter.formatMembershipsWithPeriods(memberships));
});

export default router;

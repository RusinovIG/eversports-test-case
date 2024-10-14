## Architecture of the project

Initial logic from the task was divided into separate components:

- Request validation logic moved to `validateMembership` middleware.
- Business logic to create and retrieve memberships moved to `MembershipService` class.
- Data storage logic is incapsulated in `MembershipsRepository` class. It could be further improved by extracting the interface and decoupling MembershipService from the concrete implementation.
- Response formatting logic is in `ResponseFormatter` class.

## Assumptions to complete the test case

- `userId = 2000` left hardcoded in the code. It could be taken from the request or from authorized user in the real application.
- There were a few inconsistencies in the code, that were not mentioned in the task:
  - User ID for membership in the json file was `userId`, while in the code it was: `user`. I unified it all to `user`
  - Membership ID in the json file was `membership`, while in the code: `membershipId`. I unified it also to `membership`.
- Error message for case where "recurringPrice > 100" is "cashPriceBelow100". I left it as is, but it should probably be changed to "recurringPrice > 100".
- `period.state` is hardcoded as `planned`. I left it untouched, but probably the same logic could be applied to it as for `membership.state` (based on validity dates).

## Simplifications for test case

- Validation logic moved to middleware, but it could be improved by using some validation library like `joi` or `yup`.
- `MembershipService` is initialized directly in the routes file. In the real application, it should be injected via dependency injection.
- Logging is missing for simplicity.

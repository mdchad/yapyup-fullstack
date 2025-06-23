import { createAccessControl } from "better-auth/plugins/access";
import {
  memberAc,
  ownerAc,
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  note: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
  note: ["create"],
  ...memberAc.statements,
});

const adminRole = ac.newRole({
  note: ["update", "delete"],
  ...adminAc.statements,
});

const owner = ac.newRole({
  ...ownerAc.statements,
  note: ["create", "update", "delete"],
});

export { ac, member, adminRole, owner };

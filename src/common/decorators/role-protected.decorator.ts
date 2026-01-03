import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "src/utils/constants";

export const RoleProtected = (...roles: string[]) => {
  return SetMetadata(ROLES_KEY, roles);
};

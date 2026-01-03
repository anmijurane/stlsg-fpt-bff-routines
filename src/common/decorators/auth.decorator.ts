import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { VerifyCredentialGuard } from '../guards/verify-credential.guard';

type Role = 'admin' | 'creator' | 'consultor';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(VerifyCredentialGuard),
  );
}

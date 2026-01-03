import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Role } from "../entities/role.entity";
import { Credential } from "../entities/credential.entity";
import { DateTime } from "luxon";

@Injectable()
export class VerifyCredentialGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesOfHandler = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    const roles = [...rolesOfHandler, 'root'];
    const { headers } = context.switchToHttp().getRequest();

    if (!roles || roles.length === 0) {
      throw new InternalServerErrorException('No roles provided');
    }
    const apiKey = headers['api-key'] || '';
    if (!apiKey.includes('sk_')) {  
      throw new UnauthorizedException('Unauthorized');
    }

    const [ username, accessKey ] = apiKey.split('sk_');
    const queryBuilder = this.dataSource.createQueryBuilder();
    queryBuilder
      .select([
        'c.active as active',
        'r.name as role',
        'c.uses_count as uses_count',
        'c.expires_at as expires_at',
        'c.last_used_at as last_used_at',
      ])
      .from(Credential, 'c')
      .innerJoin(Role, 'r', 'c.role_id = r.id')
      .where('c.username = :username', { username })
      .andWhere('c.access_key_hash = :accessKey', { accessKey });

    const result = await queryBuilder.getRawOne();

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!result.active) {
      throw new UnauthorizedException('Credential is not active');
    }

    if (!roles.includes(result.role)) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    const executeDate = DateTime.now().setZone('UTC');
    if (result.expires_at && DateTime.fromJSDate(result.expires_at) < executeDate) {
      throw new UnauthorizedException('Credential has expired');
    }

    const queryBuilderUpdate = this.dataSource
      .createQueryBuilder()
      .update(Credential)
      .set({ last_used_at: executeDate.toJSDate(), uses_count: result.uses_count + 1 })
      .where('username = :username', { username })
      .andWhere('access_key_hash = :accessKey', { accessKey });

    await queryBuilderUpdate.execute();

    return true;
  }
}

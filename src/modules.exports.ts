import { TypeOrmModule } from '@nestjs/typeorm';

export const PostgresTypeORMModule = () => {
  const module = TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    autoLoadEntities: true,
    synchronize: true,
    extra: {
      timezone: 'America/Mexico_City',
    },
  });
  return module;
};

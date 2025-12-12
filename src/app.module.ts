import { Module } from '@nestjs/common';
import {} from '@nestjs/core';
import { FeedbackModule } from './feedback/feedback.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresTypeORMModule } from './modules.exports';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresTypeORMModule(),
    FeedbackModule,
    InteractionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

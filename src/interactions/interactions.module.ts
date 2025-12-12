import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './entities/events.entity';
import { PageViews } from './entities/page_views.entity';
import { Sessions } from './entities/sessions.entity';
import { Clubs } from 'src/common/entities/clubs.entity';
import { Exercises } from 'src/common/entities/exercises.entity';
import { RoutineLevels } from 'src/common/entities/routine_levels.entity';

@Module({
  controllers: [InteractionsController],
  providers: [InteractionsService],
  imports: [TypeOrmModule.forFeature([
    Events,
    PageViews,
    Sessions,
    Clubs,
    Exercises,
    RoutineLevels
  ])],
})
export class InteractionsModule {}

import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Sessions } from 'src/interactions/entities/sessions.entity';
import { Role } from 'src/common/entities/role.entity';
import { Credential } from 'src/common/entities/credential.entity';
import { RoutineFeedback } from './entities/routine-feedback.entity';
import { Events } from 'src/interactions/entities/events.entity';
import { Exercises } from 'src/common/entities/exercises.entity';
import { DemographicForm } from './entities/demographic-form.entity';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [TypeOrmModule.forFeature([
    Feedback,
    Sessions,
    RoutineFeedback,
    Events,
    Exercises,
    Role,
    Credential,
    DemographicForm
  ])],
})
export class FeedbackModule {}

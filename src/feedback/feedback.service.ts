import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UUID } from 'node:crypto';

import { Feedback } from './entities/feedback.entity';
import { FeedbackDBInsert } from './types';
import { Sessions } from 'src/interactions/entities/sessions.entity';
import { RoutineFeedbackDto } from './dto/routine-feedback-req.dto';
import {
  RoutineFeedback,
  RoutineFeedbackType,
} from './entities/routine-feedback.entity';
import { Exercises } from 'src/common/entities/exercises.entity';
import { Events } from 'src/interactions/entities/events.entity';
import { DemographicFormReqDto } from './dto/demographic-form-req.dto';
import { DemographicForm } from './entities/demographic-form.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    private readonly dataSource: DataSource,
  ) {}

  async create(feedback: FeedbackDBInsert) {
    let feedbackRecord: Feedback;
    const session = await this.sessionsRepository.findOneBy({
      session_ref: feedback.session_id,
    });
    if (!session) {
      throw new InternalServerErrorException({
        status: 500,
        category: '23',
        code: 'E_BFF-ROUTINES-500_023',
        message: `Session Invalid`,
        name: 'E_BFF-ROUTINES-500_023',
      });
    }

    feedbackRecord = this.feedbackRepository.create({
      session_id: session.id,
      emoji: feedback.emoji,
      comment: feedback.comment,
      exercise_id: null,
      created_at: new Date(),
    });

    await this.feedbackRepository.save(feedbackRecord);
    console.log('SAVE W/', feedbackRecord.id);
    return {
      id: feedbackRecord.id,
    };
  }

  async addComment(id: UUID, comment: string) {
    const session = await this.sessionsRepository.findOneBy({
      session_ref: id,
    });
    if (!session) {
      throw new InternalServerErrorException({
        status: 500,
        category: '23',
        code: 'E_BFF-ROUTINES-500_023',
        message: `Session Invalid`,
        name: 'E_BFF-ROUTINES-500_023',
      });
    }
    console.log(session);
    const regitry = await this.feedbackRepository.findOneBy({
      session_id: session.id,
    });
    if (!regitry) {
      throw new NotFoundException('registry not found');
    }
    regitry.comment = comment;
    await this.feedbackRepository.save(regitry);
    return { id: regitry.id, comment: regitry.comment };
  }

  async createRoutineFeedback(sessionRef: string, body: RoutineFeedbackDto) {
    let typeEvent: RoutineFeedbackType = 'feedback_routine';

    if (body?.exercise_id) {
      typeEvent = 'feedback_exercise';
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const session = await queryRunner.manager.findOneBy(Sessions, {
        session_ref: sessionRef,
      });
      if (!session) {
        throw new NotFoundException('Session not found');
      }

      let exercise: Exercises | null = null;
      if (typeEvent === 'feedback_exercise') {
        exercise = await queryRunner.manager.findOneBy(Exercises, {
          id: body.exercise_id,
        });
        if (!exercise) {
          throw new NotFoundException('Exercise not found');
        }
      }

      const createdAt = new Date();
      const routineFeedback = queryRunner.manager.create(RoutineFeedback, {
        session_id: session.id,
        type: typeEvent,
        value: body.value,
        routine: body.routine,
        exercise_id: exercise?.id ?? null,
        level_id: body.level_id,
        day_routine: body.day_routine,
        created_at: createdAt,
      });
      const savedFeedback = await queryRunner.manager.save(routineFeedback);

      const event = queryRunner.manager.create(Events, {
        session_id: session.id,
        page_view_id: null,
        type: typeEvent,
        exercise_id: exercise?.id ?? null,
        exercise_name: exercise?.name ?? null,
        routine: body.routine,
        level_id: body.level_id,
        day_routine: body.day_routine,
        created_at: createdAt,
      });
      const savedEvent = await queryRunner.manager.save(event);

      await queryRunner.commitTransaction();

      return {
        id: savedFeedback.id,
        event_id: savedEvent.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not save routine feedback');
    } finally {
      await queryRunner.release();
    }
  }

  async createDemographicData(
    session_ref: string,
    body: DemographicFormReqDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const session = await queryRunner.manager.findOneBy(Sessions, {
        session_ref: session_ref,
      });
      if (!session) {
        throw new NotFoundException('Session not found');
      }

      const createdAt = new Date();
      const demographicData = queryRunner.manager.create(DemographicForm, {
        session_id: session.id,
        gender: body.gender,
        age_range: body.age_range,
        membership: body.membership,
        contact_email: body.contact?.email ?? null,
        contact_phone: body.contact?.phone ?? null,
        created_at: createdAt,
      });
      const savedDemographicData =
        await queryRunner.manager.save(demographicData);

      const event = queryRunner.manager.create(Events, {
        session_id: session.id,
        page_view_id: null,
        type: 'demographic_form',
        exercise_id: null,
        exercise_name: null,
        routine: null,
        level_id: null,
        day_routine: null,
        created_at: createdAt,
      });
      const savedEvent = await queryRunner.manager.save(event);

      await queryRunner.commitTransaction();

      return {
        id: savedDemographicData.id,
        event_id: savedEvent.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not save demographic data');
    } finally {
      await queryRunner.release();
    }
  }
}

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { Sessions } from './entities/sessions.entity';
import { PageViews } from './entities/page_views.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BuilderEvent, EventType, RoutineType, TypeView } from 'src/app-types/interactions';
import { decodeQueryString } from 'src/utils/decodeQueryString';
import { Events } from './entities/events.entity';
import { Exercises } from 'src/common/entities/exercises.entity';
import { DateTime } from 'luxon';

@Injectable()
export class InteractionsService {

  private logger = new Logger('InteractionsService');

  constructor(
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(PageViews)
    private readonly pageViewsRepository: Repository<PageViews>,
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Exercises)
    private readonly exercisesRepository: Repository<Exercises>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createInteraction: CreateInteractionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('CREATE INTERACTION');
      const date = DateTime.now().setZone('America/Mexico_City');
      const executeDate = DateTime.fromSQL(date.toSQL()).setZone('UTC');

      const sessionToInsert = {
        session_ref: createInteraction.session_ref,
        club_id: createInteraction.club_id,
        slug: createInteraction.club_id,
        client_ip: createInteraction.client.ip,
        user_agent_browser: createInteraction.client.browser,
        user_agent_os: createInteraction.client.os,
        user_agent_device: createInteraction.client.device,
        first_seen_at: executeDate,
        last_seen_at: executeDate,
      };

      const sessionInsertResult = await queryRunner.manager.createQueryBuilder()
        .insert()
        .into(Sessions)
        .values(sessionToInsert)
        .orUpdate(['last_seen_at'], ['session_ref'])
        .returning('*')
        .execute();

      this.logger.log('SESSION CREATED');

      const session = sessionInsertResult.raw[0];

      const pageSplit = createInteraction.page.path.split('/');

      const typeView = pageSplit?.[1] || 'home' as TypeView;

      const builderEvent: BuilderEvent = {
        home: async () => ({
          page_view: {
            routine: null,
            session_id: session.id,
            page_path: createInteraction.page.path,
            query_string: createInteraction.page.query_string,
            level_id: null,
            visited_at: executeDate.toJSDate(),
          },
          event: {
            session_id: session.id,
            type: 'home',
            exercise_id: null,
            exercise_name: null,
            routine: null,
            level_id: null,
            day_routine: null,
          }
        }),
        attention: async () => {
          const { level } = decodeQueryString<{ level: string }>(createInteraction.page.query_string);
          const routine = pageSplit[2] as RoutineType;
          return {
            page_view: {
              routine,
              session_id: session.id,
              page_path: createInteraction.page.path,
              query_string: createInteraction.page.query_string,
              level_id: parseInt(level, 10),
              visited_at: executeDate.toJSDate(),
            },
            event: {
              session_id: session.id,
              type: 'attention_view',
              exercise_id: null,
              exercise_name: null,
              routine,
              level_id: parseInt(level, 10),
              day_routine: null,
            }
          }
        },
        routine: async () => {
          const { level } = decodeQueryString<{ level: string }>(createInteraction.page.query_string);
          const routine = pageSplit[2] as RoutineType;
          return {
            page_view: {
              routine,
              session_id: session.id,
              page_path: createInteraction.page.path,
              query_string: createInteraction.page.query_string,
              level_id: parseInt(level, 10),
              visited_at: executeDate.toJSDate()
            },
            event: {
              session_id: session.id,
              type: 'routine_view',
              exercise_id: null,
              exercise_name: null,
              routine,
              level_id: parseInt(level, 10),
              day_routine: null,
            }
          }
        },
        exercise: async () => {
          let exerciseId = '07893b00';
          let exerciseName = `${pageSplit[2]} | NO CATALOGADO`;
          const exercise = await queryRunner.manager.findOne(Exercises, { where: { id: pageSplit[2] } });
          if (exercise) {
            exerciseId = exercise.id;
            exerciseName = exercise.name;
          }
          const { day, category, level } = decodeQueryString<{ level: string, day: string, category: RoutineType | null }>(createInteraction.page.query_string);
          return {
            page_view: {
              routine: category,
              session_id: session.id,
              page_path: createInteraction.page.path,
              query_string: createInteraction.page.query_string,
              level_id: parseInt(level, 10),
              visited_at: executeDate.toJSDate()
            },
            event: {
              session_id: session.id,
              type: 'exercise_view',
              exercise_id: exerciseId,
              exercise_name: exerciseName,
              routine: category,
              level_id: parseInt(level, 10),
              day_routine: parseInt(day, 10),
            }
          }
        },
      };

      if (!Object.keys(builderEvent).includes(typeView)) {
        throw new InternalServerErrorException({
          status: 500,
          category: '21',
          code: 'E_BFF-ROUTINES-500_021',
          message: `Type view ${typeView} not found`,
          name: 'E_BFF-ROUTINES-500_021'
        });
      }

      const { page_view, event } = await builderEvent[typeView]();

      const pageViewToInsert = this.pageViewsRepository.create({
        session_id: session.id,
        page_path: createInteraction.page.path,
        query_string: createInteraction.page.query_string,
        routine: page_view.routine,
        level_id: page_view.level_id,
        visited_at: executeDate.toJSDate(), //TODO: insert date of time zone of club
      });

      const pageViewInserted = await queryRunner.manager.save(PageViews, pageViewToInsert);

      this.logger.log('PAGE VIEW INSERTED');

      const eventToInsert = this.eventsRepository.create({
        session_id: session.id,
        page_view_id: pageViewInserted.id,
        type: event.type,
        exercise_id: event.exercise_id,
        exercise_name: event.exercise_name,
        routine: event.routine,
        level_id: event.level_id,
        day_routine: event.day_routine,
        created_at: executeDate.toJSDate(),
      });

      await queryRunner.manager.save(Events, eventToInsert);

      this.logger.log('EVENT INSERTED');

      await queryRunner.commitTransaction();

      return {
        eventToInsert,
        sessionToInsert: session,
        pageViewToInsert: pageViewInserted
      }

    } catch (error) {
       await queryRunner.rollbackTransaction();
       if (error instanceof InternalServerErrorException) {
         throw error;
       }
       throw new InternalServerErrorException({
        status: 500,
        category: '21',
        code: 'E_BFF-ROUTINES-500_021',
        message: `Error processing interaction: ${error.message}`,
        name: 'E_BFF-ROUTINES-500_021'
      });
    } finally {
      await queryRunner.release();
    }
  }
}

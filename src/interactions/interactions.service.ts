import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { Sessions } from './entities/sessions.entity';
import { PageViews } from './entities/page_views.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BuilderEvent, GetCommentsResult, RoutineType, TypeView } from 'src/app-types/interactions';
import { decodeQueryString } from 'src/utils/decodeQueryString';
import { Events } from './entities/events.entity';
import { Exercises } from 'src/common/entities/exercises.entity';
import { DateTime } from 'luxon';
import { GetCommentsDto } from './dto/get-comments.dto';
import { GetEmojiTotalDto } from './dto/get-emoji-total.dto';
import { GetInteractionsDto } from './dto/get-interactions.dto';
import { Clubs } from 'src/common/entities/clubs.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { errors } from 'src/utils/catalog.errors';
import { validateInteractionsRequest, validateCommentsRequest, validateEmojiRequest } from './validate_request';

@Injectable()
export class InteractionsService {

  private logger = new Logger('InteractionsService');

  constructor(
    @InjectRepository(PageViews)
    private readonly pageViewsRepository: Repository<PageViews>,
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Clubs)
    private readonly clubsRepository: Repository<Clubs>,
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
      const date = createInteraction?.date ? DateTime.fromISO(createInteraction.date).setZone('America/Mexico_City') : DateTime.now().setZone('America/Mexico_City');
      const executeDate =  DateTime.fromSQL(date.toSQL()).setZone('UTC')

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
        throw new InternalServerErrorException(errors.INTERNAL_002());
      }

      const { page_view, event } = await builderEvent[typeView]();

      const pageViewToInsert = this.pageViewsRepository.create({
        session_id: session.id,
        page_path: createInteraction.page.path,
        query_string: createInteraction.page.query_string,
        routine: page_view.routine,
        level_id: page_view.level_id,
        visited_at: page_view.visited_at
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(errors.INTERNAL_003());
    } finally {
      await queryRunner.release();
    }
  }

  async getInteractions(body: GetInteractionsDto) {
    try {
      this.logger.log('GET INTERACTIONS');

      const page = body.pagination?.page || 1;
      const limit = body.pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const notifications = validateInteractionsRequest(body);

      if (body.club_id) {
        const clubs = await this.clubsRepository.findOne({ where: { id: body.club_id } });
        if (!clubs) {
          notifications.push(errors.BAD_REQ_GEN('011').notifications[0]);
        }
      }

      if (body.exercise_id) { 
        const exercises = await this.exercisesRepository.findOne({ where: { id: body.exercise_id } });
        if (!exercises) {
          notifications.push(errors.BAD_REQ_GEN('012').notifications[0]);
        }
      }

      if (notifications.length > 0) {
        throw new BadRequestException({
          data: null,
          pagination: null,
          notifications: notifications
        });
      }

      const queryBuilder = this.dataSource
        .createQueryBuilder()
        .select([
          's.slug AS slug',
          's.club_id AS club_id',
          'c.name AS club_name',
          's.session_ref AS session_id',
          's.user_agent_browser AS user_browser',
          's.user_agent_os AS user_os',
          'e.routine AS routine_type',
          'e.level_id AS routine_level',
          'e.day_routine AS routine_day',
          'e.exercise_id AS exercise_id',
          'e.exercise_name AS exercise_name',
          'pv.page_path AS page_path',
          'pv.query_string AS query_string',
          'pv.visited_at AS visited_at',
        ])
        .from(PageViews, 'pv')
        .innerJoin(Sessions, 's', 's.id = pv.session_id')
        .leftJoin(Clubs, 'c', 'c.id = s.club_id')
        .leftJoin(Events, 'e', 'e.page_view_id = pv.id')
        .leftJoin(Exercises, 'ex', 'ex.id = e.exercise_id');

      if (body.club_id) {
        queryBuilder.andWhere('s.club_id = :club_id', { club_id: body.club_id });
      }

      if (body.session_id) {
        queryBuilder.andWhere('s.session_ref = :session_ref', { session_ref: body.session_id });
      }

      if (body.exercise_id) {
        queryBuilder.andWhere('e.exercise_id = :exercise_id', { exercise_id: body.exercise_id });
      }

      if (body.routine?.type) {
        queryBuilder.andWhere('e.routine = :routine', { routine: body.routine.type });
      }

      if (body.routine?.level) {
        queryBuilder.andWhere('e.level_id = :level_id', { level_id: body.routine.level });
      }

      if (body.routine?.day) {
        queryBuilder.andWhere('e.day_routine = :day_routine', { day_routine: body.routine.day });
      }

      if (body.timestamp?.start) {
        const startDateUTC = DateTime.fromFormat(body.timestamp.start, 'yyyy-MM-dd HH:mm:ss', {
          zone: 'America/Mexico_City'
        }).toUTC().toJSDate();
        
        queryBuilder.andWhere('pv.visited_at >= :start', { start: startDateUTC });
      }

      if (body.timestamp?.end) {
        const endDateUTC = DateTime.fromFormat(body.timestamp.end, 'yyyy-MM-dd HH:mm:ss', {
          zone: 'America/Mexico_City'
        }).toUTC().toJSDate();
        
        queryBuilder.andWhere('pv.visited_at <= :end', { end: endDateUTC });
      }

      queryBuilder
        .orderBy('s.id', 'ASC')
        .addOrderBy('pv.visited_at', 'ASC')
        .addOrderBy('e.created_at', 'ASC', 'NULLS LAST');

      const totalItems = await queryBuilder.getCount();

      queryBuilder.offset(skip).limit(limit);

      const rawResults = await queryBuilder.getRawMany();

      const data = rawResults.map((row) => ({
        slug: row.slug,
        club_id: row.club_id,
        club_name: row.club_name,
        session_id: row.session_id,
        user: {
          browser: row.user_browser,
          os: row.user_os,
        },
        routine: {
          type: row.routine_type,
          level: row.routine_level,
          day: row.routine_day,
        },
        exercise: {
          id: row.exercise_id,
          name: row.exercise_name,
        },
        page: `${row.page_path}${row.query_string ? `?${row.query_string}` : ''}`,
        timestamp: DateTime.fromJSDate(row.visited_at)
            .setZone('America/Mexico_City')
            .toFormat('yyyy-MM-dd HH:mm:ss'),
      }));

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data,
        pagination: {
          total_items_per_page: rawResults.length,
          total_items: +totalItems,
          total_pages: +totalPages,
          current_page: +page,
        },
        notifications: []
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error getting interactions', error);
      throw new InternalServerErrorException({
        status: 500,
        category: '22',
        code: 'E_BFF-ROUTINES-500_022',
        message: `Error getting interactions: ${error.message}`,
        name: 'E_BFF-ROUTINES-500_022',
      });
    }
  }

  async getComments(body: GetCommentsDto) {
    try {
      const page = body.pagination?.page || 1;
      const limit = body.pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const notifications = validateCommentsRequest(body);

      if (body.club_id) {
        const clubs = await this.clubsRepository.findOne({ where: { id: body.club_id } });
        if (!clubs) {
          notifications.push(errors.BAD_REQ_GEN('011').notifications[0]);
        }
      }

      if (notifications.length > 0) {
        throw new BadRequestException({
          data: null,
          pagination: null,
          notifications: notifications
        });
      }

      const queryBuilder = this.dataSource
        .createQueryBuilder()
        .select([
          's.club_id AS club_id',
          'c.name AS club_name',
          's.session_ref AS session_id',
          'fb.emoji AS emoji',
          'fb.comment AS comment',
          'fb.created_at AS visited_at',
        ])
        .from(Feedback, 'fb')
        .innerJoin(Sessions, 's', 's.id = fb.session_id')
        .leftJoin(Clubs, 'c', 'c.id = s.club_id');

      if (body.club_id) {
        queryBuilder.andWhere('s.club_id = :club_id', { club_id: body.club_id });
      }

      if (body.emoji) {
        queryBuilder.andWhere('fb.emoji = :emoji', { emoji: body.emoji });
      }

      if (body.session_id) {
        queryBuilder.andWhere('s.session_ref = :session_ref', { session_ref: body.session_id });
      }

      if (body.timestamp?.start) {
        const startDateUTC = DateTime.fromFormat(body.timestamp.start, 'yyyy-MM-dd HH:mm:ss', {
          zone: 'America/Mexico_City'
        }).toUTC().toJSDate();
        
        queryBuilder.andWhere('fb.created_at >= :start', { start: startDateUTC });
      }

      if (body.timestamp?.end) {
        const endDateUTC = DateTime.fromFormat(body.timestamp.end, 'yyyy-MM-dd HH:mm:ss', {
          zone: 'America/Mexico_City'
        }).toUTC().toJSDate();
        
        queryBuilder.andWhere('fb.created_at <= :end', { end: endDateUTC });
      }
      const totalItems = await queryBuilder.getCount();
      queryBuilder.offset(skip).limit(limit);
      const rawResults = await queryBuilder.getRawMany<GetCommentsResult>();
      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: rawResults.map((row) => ({
          club_id: row.club_id,
          club_name: row.club_name,
          session_id: row.session_id,
          emoji: row.emoji,
          comment: row.comment,
          timestamp: DateTime.fromJSDate(row.visited_at)
            .setZone('America/Mexico_City')
            .toFormat('yyyy-MM-dd HH:mm:ss'),
        })),
        pagination: {
          total_items_per_page: rawResults.length,
          total_items: +totalItems,
          total_pages: +totalPages,
          current_page: +page,
        },
        notifications: [],
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        status: 500,
        category: '25',
        code: 'E_BFF-ROUTINES-500_025',
        message: `Error getting comments: ${error.message}`,
        name: 'E_BFF-ROUTINES-500_025',
      });
    }
  }

  async getEmojiTotal(body: GetEmojiTotalDto) {

    try {
      
      const notifications = validateEmojiRequest(body);

      if (body.club_id) {
        const clubs = await this.clubsRepository.findOne({ where: { id: body.club_id } });
        if (!clubs) {
          notifications.push(errors.BAD_REQ_GEN('011').notifications[0]);
        }
      }

      if (notifications.length > 0) {
        throw new BadRequestException({
          data: null,
          pagination: null,
          notifications: notifications
        });
      }

      const queryBuilder = this.dataSource
        .createQueryBuilder()
        .select([
          's.club_id AS "club_id"',
          'c.name AS "club_name"',
          `SUM(CASE WHEN fb.emoji = 'happy' THEN 1 ELSE 0 END) AS happy_count`,
          `SUM(CASE WHEN fb.emoji = 'neutral' THEN 1 ELSE 0 END) AS neutral_count`,
          `SUM(CASE WHEN fb.emoji = 'sad' THEN 1 ELSE 0 END) AS sad_count`,
          'COUNT(*) AS total_feedbacks'
        ])
        .from(Feedback, 'fb')
        .innerJoin(Sessions, 's', 's.id = fb.session_id')
        .leftJoin(Clubs, 'c', 'c.id = s.club_id');

      if (body.club_id) {
        queryBuilder.andWhere('s.club_id = :club_id', { club_id: body.club_id });
      }

      if (body.session_id) {
        queryBuilder.andWhere('s.session_ref = :session_ref', { session_ref: body.session_id });
      }

      if (body.timestamp?.start) {
        const startDateUTC = DateTime.fromFormat(body.timestamp.start, 'yyyy-MM-dd HH:mm:ss', {
          zone: 'America/Mexico_City'
        }).toUTC().toJSDate();
        
        queryBuilder.andWhere('fb.created_at >= :start', { start: startDateUTC });
      }

      if (body.timestamp?.end) {
        const endDateUTC = DateTime.fromFormat(body.timestamp.end, 'yyyy-MM-dd HH:mm:ss', {
          zone: 'America/Mexico_City'
        }).toUTC().toJSDate();
        
        queryBuilder.andWhere('fb.created_at <= :end', { end: endDateUTC });
      }

      queryBuilder.groupBy('s.club_id');
      queryBuilder.addGroupBy('c.name');

      const rawResults = await queryBuilder.getRawMany();
      const results = rawResults.map(row => ({
        club_id: row.club_id,
        club_name: row.club_name,
        happy_count: +row.happy_count,
        neutral_count: +row.neutral_count,
        sad_count: +row.sad_count,
        total_feedbacks: +row.total_feedbacks
      }))

      return {
        data: results,
        pagination: {
          total_items_per_page: results.length,
        },
        notifications: []
      };

    } catch (error) {
      this.logger.error('Error getting emoji total', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        status: 500,
        category: '26',
        code: 'E_BFF-ROUTINES-500_026',
        message: `Error getting emoji total: ${error.message}`,
        name: 'E_BFF-ROUTINES-500_026',
      });
    }

  }
}


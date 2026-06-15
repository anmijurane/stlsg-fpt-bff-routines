import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'node:crypto';

import { Feedback } from './entities/feedback.entity';
import { FeedbackDBInsert } from './types';
import { Sessions } from 'src/interactions/entities/sessions.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,    
  ) {}

  async create(feedback: FeedbackDBInsert) {
    let feedbackRecord: Feedback;
    const session = await this.sessionsRepository.findOneBy({
      session_ref: feedback.session_id
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
      session_ref: id
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
    console.log(session)
    const regitry = await this.feedbackRepository.findOneBy({ session_id: session.id });
    if (!regitry) {
      throw new NotFoundException('registry not found');
    }
    regitry.comment = comment;
    await this.feedbackRepository.save(regitry);
    return { id: regitry.id, comment: regitry.comment };
  }
}

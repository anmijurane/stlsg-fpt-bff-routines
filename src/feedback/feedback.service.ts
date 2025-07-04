import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'node:crypto';

import { Feedback } from './entities/feedback.entity';
import { FeedbackDBInsert } from './types';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(feedback: FeedbackDBInsert) {
    let feedbackRecord: Feedback;
    const registry = await this.feedbackRepository.findOneBy({
      sessionId: feedback.session_id,
    });
    feedbackRecord = registry;
    if (!registry) {
      feedbackRecord = this.feedbackRepository.create({
        emoji: feedback.emoji,
        comment: feedback.comment,
        page_path: feedback.page_path,
        rejected: feedback.rejected,
        sedeId: feedback.sede_id,
        sessionId: feedback.session_id,
        ip: feedback.ip,
        user_agent: feedback.user_agent,
      });
    }
    await this.feedbackRepository.save(feedbackRecord);
    console.log('SAVE W/', feedbackRecord.id);
    return {
      id: feedbackRecord.id,
    };
  }

  async addComment(id: UUID, comment: string, sessionId: string) {
    const regitry = await this.feedbackRepository.findOneBy({ id, sessionId });
    if (!regitry) {
      throw new NotFoundException('registry not found');
    }
    regitry.comment = comment;
    await this.feedbackRepository.save(regitry);
    return { id: regitry.id, comment: regitry.comment };
  }
}

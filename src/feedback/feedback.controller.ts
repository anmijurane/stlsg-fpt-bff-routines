import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { EmojiFeedbackDto } from './dto/emoji-feedback-req.dto';
import { Headers } from 'src/common/decorators/raw-headers.decorator';
import { decodeBase64 } from 'src/utils/decodeBase64';
import { UserContext } from './types';
import { UUID } from 'node:crypto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoutineFeedbackDto } from './dto/routine-feedback-req.dto';
import { DemographicFormReqDto } from './dto/demographic-form-req.dto';

@Controller('/api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/emoji')
  @Auth('admin', 'creator')
  async create(
    @Body() body: EmojiFeedbackDto,
    @Headers() headers: Record<string, string>,
  ) {
    const userContextBase64 = headers['user-context'];
    const userContextJsonRaw = decodeBase64(userContextBase64);
    const userContext = JSON.parse(userContextJsonRaw) as UserContext;
    if (!userContext.ip || !userContext.session_id || !userContext.user_agent) {
      return new BadRequestException({
        data: null,
        notification: [{ message: 'userContext invalid' }],
      });
    }
    return await this.feedbackService.create({
      comment: body.comment,
      emoji: body.emoji,
      page_path: body.page_path,
      rejected: body.rejected,
      sede_id: body.sede_id,
      ip: userContext.ip,
      session_id: userContext.session_id,
      user_agent: userContext.user_agent,
    });
  }

  @Post('/comment/:id')
  @Auth('admin', 'creator')
  async update(
    @Param('id') id: UUID,
    @Body() body: Pick<EmojiFeedbackDto, 'comment'>,
    @Headers() headers: Record<string, string>,
  ) {
    const userContextBase64 = headers['user-context'];
    const userContextJsonRaw = decodeBase64(userContextBase64);
    const userContext = JSON.parse(userContextJsonRaw) as UserContext;
    if (!userContext.ip || !userContext.session_id || !userContext.user_agent) {
      return new BadRequestException({
        data: null,
        notification: [{ message: 'userContext invalid' }],
      });
    }
    return await this.feedbackService.addComment(
      userContext.session_id,
      body.comment,
    );
  }

  @Post('/routine-or-exercise')
  @Auth('admin', 'creator')
  async createRoutineFeedback(
    @Body() body: RoutineFeedbackDto,
    @Headers() headers: Record<string, string>,
  ) {
    const userContextBase64 = headers['user-context'];
    if (!userContextBase64) {
      throw new BadRequestException({
        data: null,
        notification: [{ message: 'userContext invalid' }],
      });
    }
    const userContextJsonRaw = decodeBase64(userContextBase64);
    const userContext = JSON.parse(userContextJsonRaw) as UserContext;
    if (!userContext.ip || !userContext.session_id || !userContext.user_agent) {
      throw new BadRequestException({
        data: null,
        notification: [{ message: 'userContext not exist' }],
      });
    }
    return this.feedbackService.createRoutineFeedback(
      userContext.session_id,
      body,
    );
  }

  @Post('/demographic-form')
  @Auth('admin', 'creator')
  async createDemographicForm(
    @Body() body: DemographicFormReqDto,
    @Headers() headers: Record<string, string>,
  ) {
    const userContextBase64 = headers['user-context'];
    if (!userContextBase64) {
      throw new BadRequestException({
        data: null,
        notification: [{ message: 'userContext invalid' }],
      });
    }
    const userContextJsonRaw = decodeBase64(userContextBase64);
    const userContext = JSON.parse(userContextJsonRaw) as UserContext;
    if (!userContext.ip || !userContext.session_id || !userContext.user_agent) {
      throw new BadRequestException({
        data: null,
        notification: [{ message: 'userContext not exist' }],
      });
    }

    return this.feedbackService.createDemographicData(
      userContext.session_id,
      body,
    );
  }
}

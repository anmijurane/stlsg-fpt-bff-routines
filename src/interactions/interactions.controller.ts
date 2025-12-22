import { Body, Controller, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { GetInteractionsDto } from './dto/get-interactions.dto';
import { GetEmojiTotalDto } from './dto/get-emoji-total.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { DateTime } from 'luxon';

@Controller('/v1/analytics')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('/create/interaction')
  createInteraction(@Body() body: CreateInteractionDto) {
    return this.interactionsService.create(body);
  }

  @Post('/interactions')
  create(@Body() body: GetInteractionsDto) {}

  @Post('/comments')
  getComments(@Body() body: GetCommentsDto) {
  }

  @Post('/emoji')
  getContableEmojiBehavior(@Body() body: GetEmojiTotalDto) {
  }

}

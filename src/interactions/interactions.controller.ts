import { Body, Controller, Get, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { GetInteractionsDto } from './dto/get-interactions.dto';
import { GetEmojiTotalDto } from './dto/get-emoji-total.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('/v1/analytics')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('/create/interaction')
  @Auth('admin', 'creator')
  createInteraction(@Body() body: CreateInteractionDto) {
    return this.interactionsService.create(body);
  }

  @Post('/interactions')
  @Auth('admin', 'consultor')
  create(@Body() body: GetInteractionsDto) {
    return this.interactionsService.getInteractions(body);
  }

  @Post('/comments')
  @Auth('admin', 'consultor')
  getComments(@Body() body: GetCommentsDto) {
    return this.interactionsService.getComments(body);
  }

  @Post('/emoji')
  @Auth('admin', 'consultor')
  getContableEmojiBehavior(@Body() body: GetEmojiTotalDto) {
    return this.interactionsService.getEmojiTotal(body);
  }

}

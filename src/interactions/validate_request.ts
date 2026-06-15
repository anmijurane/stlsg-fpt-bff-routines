import { DateTime } from "luxon";
import { GetInteractionsDto } from "./dto/get-interactions.dto";
import { errors } from "src/utils/catalog.errors";
import { GetCommentsDto } from "./dto/get-comments.dto";
import { GetEmojiTotalDto } from "./dto/get-emoji-total.dto";

interface CustomError {
  category: number,
  code: string,
  status: number,
  meta: {
    timestamp: string,
    log: string,
  }
}

type ValidateInteractionsRequestFunc = (body: GetInteractionsDto) => CustomError[];
type ValidateCommentsRequestFunc = (body: GetCommentsDto) => CustomError[];
type ValidateEmojiRequestFunc = (body: GetEmojiTotalDto) => CustomError[];


export const validateInteractionsRequest: ValidateInteractionsRequestFunc = (body) => {
  let notifications: CustomError[] = [];
  const routineType = ['adaptation', 'muscle_gain', 'health', 'fat_burning'];
  const level_and_days_types = [1,2,3,4];

  if (body.routine.level) {
    const level = parseInt(body.routine.level, 10);
    if (!level_and_days_types.includes(level)) {
      notifications.push(errors.BAD_REQ_GEN('006').notifications[0]);
    }
  }

  if (body.routine.day) {
    const day = parseInt(body.routine.day, 10);
    if (!level_and_days_types.includes(day)) {
      notifications.push(errors.BAD_REQ_GEN('007').notifications[0]);
    }
  }

  if (body.routine.type) {
    const routine = body.routine.type;
    if (!routineType.includes(routine)) {
      notifications.push(errors.BAD_REQ_GEN('008').notifications[0]);
    }
  }

  if (body.timestamp.start) {
    const startDateUTC = DateTime.fromFormat(body.timestamp.start, 'yyyy-MM-dd HH:mm:ss').isValid;
    if (!startDateUTC) {
      notifications.push(errors.BAD_REQ_GEN('009').notifications[0]);
    }
  }

  if (body.timestamp.end) {
    const endDateUTC = DateTime.fromFormat(body.timestamp.end, 'yyyy-MM-dd HH:mm:ss').isValid;
    if (!endDateUTC) {
      notifications.push(errors.BAD_REQ_GEN('010').notifications[0]);
    }
  }

  if (body) {}

  return notifications;

}


export const validateCommentsRequest: ValidateCommentsRequestFunc = (body) => {

  const emoji_types = ['happy', 'neutral', 'sad'];
  const notifications: CustomError[] = [];

  if (body.emoji) {
    const emoji = body.emoji;
    if (!emoji_types.includes(emoji)) {
      notifications.push(errors.BAD_REQ_GEN('012').notifications[0]);
    }
  }

  if (body.timestamp.start) {
    const startDateUTC = DateTime.fromFormat(body.timestamp.start, 'yyyy-MM-dd HH:mm:ss').isValid;
    if (!startDateUTC) {
      notifications.push(errors.BAD_REQ_GEN('009').notifications[0]);
    }
  }

  if (body.timestamp.end) {
    const endDateUTC = DateTime.fromFormat(body.timestamp.end, 'yyyy-MM-dd HH:mm:ss').isValid;
    if (!endDateUTC) {
      notifications.push(errors.BAD_REQ_GEN('010').notifications[0]);
    }
  }

  return notifications;

}

export const validateEmojiRequest: ValidateEmojiRequestFunc = (body) => {

  const notifications: CustomError[] = [];

  if (body.timestamp.start) {
    const startDateUTC = DateTime.fromFormat(body.timestamp.start, 'yyyy-MM-dd HH:mm:ss').isValid;
    if (!startDateUTC) {
      notifications.push(errors.BAD_REQ_GEN('009').notifications[0]);
    }
  }

  if (body.timestamp.end) {
    const endDateUTC = DateTime.fromFormat(body.timestamp.end, 'yyyy-MM-dd HH:mm:ss').isValid;
    if (!endDateUTC) {
      notifications.push(errors.BAD_REQ_GEN('010').notifications[0]);
    }
  }

  return notifications;

}

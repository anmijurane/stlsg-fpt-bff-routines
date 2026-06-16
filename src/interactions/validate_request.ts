import { GetInteractionsDto } from "./dto/get-interactions.dto";
import { errors } from "src/utils/catalog.errors";
import { GetCommentsDto } from "./dto/get-comments.dto";
import { GetEmojiTotalDto } from "./dto/get-emoji-total.dto";
import { parseTimestampRange } from "./timestamp-range";
import { GetDemographicFormValuesDto } from "./dto/get-demographic-form-values.dto";
import { GetDemographicSummaryDto } from "./dto/get-demographic-summary.dto";

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
type ValidateDemographicsRequestFunc = (body: GetDemographicFormValuesDto) => CustomError[];
type ValidateDemographicsSummaryRequestFunc = (body: GetDemographicSummaryDto) => CustomError[];

const validateTimestamp = (body: { timestamp?: { start: string; end: string } }) => {
  const notifications: CustomError[] = [];
  const { start, end } = parseTimestampRange(body.timestamp);

  if (body.timestamp?.start && !start.isValid) {
    notifications.push(errors.BAD_REQ_GEN('009').notifications[0]);
  }

  if (body.timestamp?.end && !end.isValid) {
    notifications.push(errors.BAD_REQ_GEN('010').notifications[0]);
  }

  if (start?.isValid && end?.isValid && start > end) {
    notifications.push(errors.BAD_REQ_GEN('013').notifications[0]);
  }

  return notifications;
};

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

  notifications = notifications.concat(validateTimestamp(body));

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

  notifications.push(...validateTimestamp(body));

  return notifications;

}

export const validateEmojiRequest: ValidateEmojiRequestFunc = (body) => {

  const notifications: CustomError[] = [];

  notifications.push(...validateTimestamp(body));

  return notifications;

}

export const validateDemographicsRequest: ValidateDemographicsRequestFunc = (body) => {

  const gender_types = ['male', 'female', 'other'];
  const age_range_types = ['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const membership_types = ['classic-card', 'pf-black-card', 'invite'];
  const notifications: CustomError[] = [];

  if (body.gender && !gender_types.includes(body.gender)) {
    notifications.push(errors.BAD_REQ_GEN('014').notifications[0]);
  }

  if (body.age_range && !age_range_types.includes(body.age_range)) {
    notifications.push(errors.BAD_REQ_GEN('015').notifications[0]);
  }

  if (body.membership && !membership_types.includes(body.membership)) {
    notifications.push(errors.BAD_REQ_GEN('016').notifications[0]);
  }

  notifications.push(...validateTimestamp(body));

  return notifications;

}

export const validateDemographicsSummaryRequest: ValidateDemographicsSummaryRequestFunc = (body) => {
  const notifications: CustomError[] = [];
  notifications.push(...validateTimestamp(body));
  return notifications;
}

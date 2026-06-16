import { DateTime } from 'luxon';
import { TimestampI } from 'src/app-types/interactions';

export const TIMESTAMP_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const TIMESTAMP_ZONE = 'America/Mexico_City';

export const parseTimestamp = (timestamp: string) =>
  DateTime.fromFormat(timestamp, TIMESTAMP_FORMAT, {
    zone: TIMESTAMP_ZONE,
  });

export const parseTimestampRange = (timestamp?: TimestampI) => {
  const start = timestamp?.start ? parseTimestamp(timestamp.start) : null;
  const end = timestamp?.end ? parseTimestamp(timestamp.end) : null;
  const endExclusive = end?.isValid ? end.plus({ seconds: 1 }) : null;

  return {
    start,
    end,
    endExclusive,
  };
};

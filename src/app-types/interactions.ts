import { Emoji } from "src/feedback/types";

export interface TimestampI {
  start: string;
  end: string;
}

export interface RoutineI {
  type: string;
  level: string;
  day: string;
}

export interface PaginationI {
  page: number;
  limit: number;
}

export type RoutineType = 'adaptation' | 'muscle-gain' | 'health' | 'fat-burning';

export type EventType = 'home' | 'attention_view' | 'exercise_view' | 'routine_view' | 'feedback' | 'other';

export type TypeView = 'home' | 'exercise' | 'routine' | 'attention';

export interface PageViewBuilder {
  routine: RoutineType;
  session_id: string;
  page_path: string;
  query_string: string;
  level_id: number;
  visited_at: Date;
}

export interface EventBuilder {
  session_id: string;
  type: EventType;
  exercise_id: string;
  exercise_name: string;
  routine: RoutineType;
  level_id: number;
  day_routine: number;
}

export type BuilderEvent = Record<TypeView, () => Promise<{ page_view: PageViewBuilder; event: EventBuilder }>>;

export interface GetCommentsResult {
  club_id: string;
  club_name: string;
  session_id: string;
  emoji: Emoji;
  comment: string;
  visited_at: Date;
}
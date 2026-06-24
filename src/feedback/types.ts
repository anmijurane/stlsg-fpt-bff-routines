import { UUID } from 'node:crypto';

export type Emoji = 'happy' | 'neutral' | 'sad' | null;

export interface UserContext {
  ip: string;
  user_agent: string;
  session_id: UUID;
}

export interface FeedbackDBInsert {
  comment: string;
  emoji: Emoji;
  page_path: string;
  rejected: boolean;
  ip: string;
  sede_id: string;
  session_id: string;
  user_agent: string;
}

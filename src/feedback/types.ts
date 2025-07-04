export type Emoji = 'happy' | 'neutral' | 'sad';

export interface UserContext {
  ip: string;
  user_agent: string;
  session_id: string;
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

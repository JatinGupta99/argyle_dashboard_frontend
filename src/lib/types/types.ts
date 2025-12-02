export interface ThunkError {
  message: string;
}

export interface AsyncThunkConfig {
  rejectValue: ThunkError;
  serializedErrorType?: ThunkError;
}

export enum SpeakerType {
  INTERVIEWER = 'Interviewer',
  INTRODUCER = 'Introducer',
  KEYNOTE = 'Keynote',
  PANELIST = 'Panelist',
  PANEL_MODERATOR = 'Panel Moderator',
  SPEAKER_MODERATOR = 'Speaker/Moderator',
  SPEAKER_TBD = 'Speaker TBD',
  THOUGHT_LEADERSHIP = 'Thought Leadership',
  LPP = 'LPP',
  EXTERNAL_MC = 'External MC',
}

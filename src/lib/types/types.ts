export interface ThunkError {
  message: string;
}

export interface AsyncThunkConfig {
  rejectValue: ThunkError;
  serializedErrorType?: ThunkError;
}

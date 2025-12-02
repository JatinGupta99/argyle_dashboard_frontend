import { SpeakerType } from './types';

export interface SpeakerView {
  title: string;
  photo: string;
}
export interface CreateSpeakerDto {
  name: {
    firstName: string;
    lastName: string;
  };
  title: string;
  email: string;
  contactId: string;
  speakerType: SpeakerType;
  companyName?: string;
  bio?: string;
  pictureUrl: string;
  linkedInUrl: string;
}

export interface UpdateSpeakerDto extends Partial<CreateSpeakerDto> {}

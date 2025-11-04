export interface Speaker {
  _id?: string;
  name: {
    firstName: string;
    lastName: string;
  };
  title: string;
  email: string;
  companyName: string;
  bio?: string;
  pictureUrl?: string;
  linkedInUrl?: string;
}

export interface CreateSpeakerDto {
  name: {
    firstName: string;
    lastName: string;
  };
  title: string;
  email: string;
  companyName: string;
  bio?: string;
  pictureUrl?: string;
  linkedInUrl?: string;
}

export interface UpdateSpeakerDto extends Partial<CreateSpeakerDto> {}

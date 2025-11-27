import type { SpeakerAssiciatedwithAgendas } from '@/lib/types/agenda';
import type { Speaker } from '@/lib/types/schedule';

export function mapSpeakerToRow(a: Partial<Speaker>): SpeakerAssiciatedwithAgendas {
 
  const obj= {
    _id: a._id || '',
    name: {
      firstName: a.name?.firstName || '',
      lastName: a.name?.lastName || '',
    },
    title: a.title || '',
    pictureUrl: a.pictureUrl || '',
    linkedInUrl: a.linkedInUrl || '',
  };
   console.log(obj,'mapSpeakerToRow')
  return obj;
}

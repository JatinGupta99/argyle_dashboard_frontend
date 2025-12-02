'use client';

import { Calendar, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';

/* SPEAKERS */
import {
  openSpeakerForm,
  setSpeakerDeleteTarget,
  setSpeakerEventId,
} from '@/redux/slices/speaker-slice';
import { deleteSpeaker, fetchSpeakers } from '@/redux/slices/speaker-thunks';
import { SpeakerFormDialog } from './speakers/components/SpeakerFormDialog';
import { SpeakersTable } from './speakers/components/SpeakersTable';

/* SPONSORS */
import {
  deleteSponsor,
  fetchSponsors,
  openForm as openSponsorDialog,
  setDeleteTarget as setSponsorDeleteTarget,
  setSponsorEventId,
} from '@/redux/slices/sponsor-slice';
import { SponsorFormDialog } from './sponsors/components/SponsorFormDialog';
import { SponsorsTable } from './sponsors/components/SponsorsTable';

/* AGENDA */
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';
import {
  openAgendaForm as openAgendaDialog,
  setAgendaDeleteTarget,
  setAgendaEventId,
} from '@/redux/slices/agenda-slice';
import { deleteAgenda, fetchAgendas } from '@/redux/slices/agenda-thunks';
import { mapAgendaToRow } from '@/utils/agenda.mapper';
import { mapSponsorToRow } from '@/utils/sponsor.mapper';
import { AgendaFormDialog } from './agenda/components/AgendaFormDialog';
import { AgendaTable } from './agenda/components/AgendaTable';
import { mapSpeakerToRow } from '@/utils/speaker.mapper';

export default function EventOverviewPage() {
  const event = useEventContext();
  const eventId = event?._id ?? '';
  const dispatch = useAppDispatch();

  const [agendaQuery, setAgendaQuery] = useState({ page: 1, limit: 10 });
  const [speakerQuery, setSpeakerQuery] = useState({ page: 1, limit: 10 });
  const [sponsorQuery, setSponsorQuery] = useState({ page: 1, limit: 10 });

  const {
    items: speakers,
    deleteTarget: speakerDelete,
    meta: speakerMeta,
  } = useAppSelector((s) => s.speakers);
  const {
    items: sponsors,
    deleteTarget: sponsorDelete,
    meta: sponsorsMeta,
  } = useAppSelector((s) => s.sponsors);
  const {
    items: agendas,
    deleteTarget: agendaDelete,
    meta: agendasMeta,
  } = useAppSelector((s) => s.agendas);

  /* ─── Sync eventId & fetch data ─── */
  useEffect(() => {
    if (!eventId) return;

    dispatch(setSpeakerEventId(eventId));
    dispatch(setSponsorEventId(eventId));
    dispatch(setAgendaEventId(eventId));

    dispatch(fetchSpeakers({ page: speakerQuery.page, limit: speakerQuery.limit }));
    dispatch(fetchAgendas({ page: agendaQuery.page, limit: agendaQuery.limit }));
    dispatch(fetchSponsors({ page: sponsorQuery.page, limit: sponsorQuery.limit }));

    dispatch(setExportLabel('Add Speaker'));
  }, [eventId, dispatch, agendaQuery, speakerQuery, sponsorQuery]);

  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-6 bg-gray-50 px-6 py-6">
        {/* EVENT CARD */}
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-black">Event</span>
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            <h1 className="font-semibold text-blue-500">{eventId}</h1>
          </div>
          <h1 className="text-2xl font-semibold">{event?.title}</h1>
          <p className="text-gray-600">{event?.eventDetails}</p>
          <div className="flex items-center gap-8 text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sky-50">
                <Calendar size={30} className="text-blue-500" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-gray-500">Date</span>
                <span className="font-medium text-gray-700">{event?.EventDate}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* TABLES */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* AGENDAS */}
          <Card className="rounded-xl shadow-sm md:col-span-2">
            <CardHeader className="flex items-center justify-between bg-gray-50/60 px-6">
              <CardTitle>Agenda</CardTitle>
              <Button
                size="sm"
                className="gap-1 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => dispatch(openAgendaDialog(null))}
              >
                <Plus size={16} /> Add New
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <AgendaTable
                data={agendas.map(mapAgendaToRow)}
                meta={{
                  total: agendasMeta?.total ?? 0,
                  totalPages: agendasMeta?.totalPages ?? 0,
                  page: agendasMeta?.page ?? 1,
                  limit: agendasMeta?.limit ?? 10,
                }}
                query={agendaQuery}
                setQuery={setAgendaQuery}
                onEdit={(row) => dispatch(openAgendaDialog(row))}
                onDelete={(row) => dispatch(setAgendaDeleteTarget(row))}
              />
            </CardContent>
          </Card>

          {/* SPEAKERS */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="flex items-center justify-between bg-gray-50/60 px-6">
              <CardTitle>Speakers</CardTitle>
              <Button
                size="sm"
                className="bg-blue-600 text-white"
                onClick={() => dispatch(openSpeakerForm(true))}
              >
                <Plus size={16} /> Add New
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <SpeakersTable
                data={speakers.map(mapSpeakerToRow)}
                meta={speakerMeta}
                query={speakerQuery}
                setQuery={setSpeakerQuery}
                onEdit={(row) => dispatch(openSpeakerForm(row))}
                onDelete={(row) => dispatch(setSpeakerDeleteTarget(row))}
              />
            </CardContent>
          </Card>
        </div>

        {/* SPONSORS */}
        <Card className="rounded-xl shadow-sm md:col-span-2">
          <CardHeader className="flex items-center justify-between bg-gray-50/60 px-6 py-4">
            <CardTitle>Sponsors</CardTitle>
            <Button
              size="sm"
              className="gap-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => dispatch(openSponsorDialog(true))}
            >
              <Plus size={16} /> Add Sponsors
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <SponsorsTable
              data={sponsors.map(mapSponsorToRow)}
              meta={{
                total: sponsorsMeta?.total ?? 0,
                totalPages: sponsorsMeta?.totalPages ?? 0,
                page: sponsorsMeta?.page ?? 1,
                limit: sponsorsMeta?.limit ?? 10,
              }}
              query={sponsorQuery}
              setQuery={setSponsorQuery}
              onEdit={(row) => dispatch(openSponsorDialog(row))}
              onDelete={(row) => dispatch(setSponsorDeleteTarget(row))}
            />
          </CardContent>
        </Card>

        {/* DIALOGS */}
        <SpeakerFormDialog />
        <SponsorFormDialog />
        <AgendaFormDialog />

        {/* DELETE CONFIRMS */}
        <DeleteConfirmDialog
          open={!!speakerDelete}
          title="Delete Speaker"
          message={`Delete "${speakerDelete?.name ?? ''}"?`}
          onConfirm={() => dispatch(deleteSpeaker(speakerDelete!._id))}
          onCancel={() => dispatch(setSpeakerDeleteTarget(null))}
        />
        <DeleteConfirmDialog
          open={!!sponsorDelete}
          title="Delete Sponsor"
          message={`Delete "${sponsorDelete?.name ?? ''}"?`}
          onConfirm={() => dispatch(deleteSponsor(sponsorDelete!._id))}
          onCancel={() => dispatch(setSponsorDeleteTarget(null))}
        />
        <DeleteConfirmDialog
          open={!!agendaDelete}
          title="Delete Agenda"
          message={`Delete "${agendaDelete?.title ?? ''}"?`}
          onConfirm={() => dispatch(deleteAgenda(agendaDelete!._id))}
          onCancel={() => dispatch(setAgendaDeleteTarget(null))}
        />
      </div>
    </>
  );
}

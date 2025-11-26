'use client';

import { Calendar, Plus } from 'lucide-react';
import { useEffect } from 'react';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';

/* SPEAKERS */
import { SpeakersTable } from './speakers/components/SpeakersTable';
import {
  fetchSpeakers,
  openForm as openSpeakerDialog,
  setDeleteTarget as setSpeakerDeleteTarget,
  deleteSpeaker,
  setEventId as setSpeakerEventId,
} from '@/redux/slices/speaker-slice';

/* SPONSORS */
import { SponsorFormDialog } from './sponsors/components/SponsorFormDialog';
import { SponsorsTable } from './sponsors/components/SponsorsTable';
import {
  fetchSponsors,
  openForm as openSponsorDialog,
  setDeleteTarget as setSponsorDeleteTarget,
  deleteSponsor,
  setSponsorEventId,
} from '@/redux/slices/sponsor-slice';

/* AGENDA */
import { AgendaFormDialog } from './agenda/components/AgendaFormDialog';
import { AgendaTable } from './agenda/components/AgendaTable';
import { mapAgendaToRow } from '@/utils/agenda.mapper';
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';

import { fetchAgendas, removeAgenda as deleteAgenda } from '@/redux/slices/agenda-thunks';
import {
  openAgendaForm as openAgendaDialog,
  setAgendaDeleteTarget,
  setAgendaEventId,
} from '@/redux/slices/agenda-slice';

import { SpeakerFormDialog } from './speakers/components/SpeakerFormDialog';

export default function EventOverviewPage() {
  const event = useEventContext();
  const eventId = event?._id ?? '';
  const dispatch = useAppDispatch();

  /* ------------------ SELECTORS ------------------ */
  const { items: speakers, deleteTarget: speakerDelete } = useAppSelector((s) => s.speakers);
  const { items: sponsors, deleteTarget: sponsorDelete } = useAppSelector((s) => s.sponsors);
  const { items: agendas, deleteTarget: agendaDelete } = useAppSelector((s) => s.agendas);

  /* ------------------ INITIAL LOAD ------------------ */
  useEffect(() => {
    if (!eventId) return;

    // SET eventIds for all slices
    dispatch(setSpeakerEventId(eventId));
    dispatch(setSponsorEventId(eventId));
    dispatch(setAgendaEventId(eventId));

    // FETCH all event-based data
    dispatch(fetchSpeakers());
    dispatch(fetchAgendas());
    dispatch(fetchSponsors());

    dispatch(setExportLabel('Add Speaker'));
  }, [eventId, dispatch]);

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* AGENDAS */}
          <Card className="rounded-xl shadow-sm md:col-span-2">
            <CardHeader className="flex items-center justify-between border-b bg-gray-50/60 px-6 py-4">
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
                onEdit={(row) => dispatch(openAgendaDialog(row))}
                onDelete={(row) => dispatch(setAgendaDeleteTarget(row))}
              />
            </CardContent>
          </Card>

          {/* SPEAKERS */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="flex items-center justify-between border-b bg-gray-50/60 px-6 py-4">
              <CardTitle>Speakers</CardTitle>
              <Button
                size="sm"
                className="bg-blue-600 text-white"
                onClick={() => dispatch(openSpeakerDialog(null))}
              >
                <Plus size={16} /> Add New
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <SpeakersTable
                speakers={speakers}
                onEdit={(row) => dispatch(openSpeakerDialog(row))}
                onDelete={(row) => dispatch(setSpeakerDeleteTarget(row))}
              />
            </CardContent>
          </Card>
        </div>

        {/* SPONSORS */}
        <section className="rounded-lg border bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between px-4 pb-2">
            <h3 className="text-lg font-semibold">Sponsors</h3>

            <Button
              size="sm"
              className="bg-blue-600 text-white"
              onClick={() => dispatch(openSponsorDialog(true))}
            >
              <Plus size={14} /> Add Sponsor
            </Button>
          </div>

          <SponsorsTable
            sponsors={sponsors}
            onEdit={(row) => dispatch(openSponsorDialog(row))}
            onDelete={(row) => dispatch(setSponsorDeleteTarget(row))}
          />
        </section>

        {/* DIALOGS */}
        <SpeakerFormDialog />
        <SponsorFormDialog />
        <AgendaFormDialog />

        {/* DELETE CONFIRMS */}
        <DeleteConfirmDialog
          open={!!speakerDelete}
          title="Delete Speaker"
          message={`Delete "${speakerDelete?.name?.firstName ?? ''} ${speakerDelete?.name?.lastName ?? ''}"?`}
          onConfirm={() => dispatch(deleteSpeaker({ id: speakerDelete!._id }))}
          onCancel={() => dispatch(setSpeakerDeleteTarget(null))}
        />

        <DeleteConfirmDialog
          open={!!sponsorDelete}
          title="Delete Sponsor"
          message={`Delete "${sponsorDelete?.name}"?`}
          onConfirm={() => dispatch(deleteSponsor({ eventId, sponsorId: sponsorDelete!._id }))}
          onCancel={() => dispatch(setSponsorDeleteTarget(null))}
        />

        <DeleteConfirmDialog
          open={!!agendaDelete}
          title="Delete Agenda"
          message={`Delete "${agendaDelete?.title}"?`}
          onConfirm={() => dispatch(deleteAgenda(agendaDelete!._id))}
          onCancel={() => dispatch(setAgendaDeleteTarget(null))}
        />
      </div>
    </>
  );
}

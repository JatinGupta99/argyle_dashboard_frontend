'use client';

import { Calendar, List, Plus, Users } from 'lucide-react';
import { useEffect } from 'react';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';

import { Speaker } from '@/lib/types/speaker';
import { SpeakerService } from '@/services/speaker.service';
import { SpeakerFormDialog } from './speakers/components/SpeakerFormDialog';
import { SpeakersTable } from './speakers/components/SpeakersTable';

import { Sponsor } from '@/lib/types/sponsor';
import { SponsorService } from '@/services/sponsors.service';
import { SponsorFormDialog } from './sponsors/components/SponsorFormDialog';
import { SponsorsTable } from './sponsors/components/SponsorsTable';

import { Agenda } from '@/lib/types/agenda';
import { AgendaService } from '@/services/agenda.service';
import { mapAgendaToRow } from '@/utils/agenda.mapper';
import { AgendaFormDialog } from './agenda/components/AgendaFormDialog';
import { AgendaTable } from './agenda/components/AgendaTable';

import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';
import { useCrud } from './sponsors/hooks/useCrud';

export default function EventOverviewPage() {
  const event = useEventContext();
  const eventId = event?._id || '';
  const dispatch = useAppDispatch();

  const speakers = useCrud<Speaker>(eventId, SpeakerService);
  const sponsors = useCrud<Sponsor>(eventId, SponsorService);
  const agendas = useCrud<Agenda>(eventId, AgendaService);

  useEffect(() => {
    if (!eventId) return;
    speakers.loadItems();
    sponsors.loadItems();
    agendas.loadItems();
    dispatch(setExportLabel('Add Speaker'));
  }, [eventId]);

  return (
    <>
      <Header />

      <div className="flex w-full flex-col gap-6 bg-gray-50 px-6 py-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-black">Event</span>
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <h1 className="font-semibold text-blue-500">{event?._id}</h1>
            </div>

            <h1 className="text-2xl font-semibold">{event?.title}</h1>

            <p className="text-gray-600">
              {event?.eventDetails ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel sapien vitae velit placerat viverra quis sed era.'}
            </p>

            <div className="flex items-center gap-8 text-gray-600">
              <div className="flex flex-col">
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
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="rounded-xl shadow-sm md:col-span-2">
            <CardHeader className="flex items-center justify-between border-b bg-gray-50/60 px-6 py-4">
              <CardTitle className="flex items-center gap-2">Agenda</CardTitle>

              <Button
                size="sm"
                onClick={agendas.addItem}
                className="gap-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus size={16} /> Add New
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <AgendaTable
                data={agendas.items.map(mapAgendaToRow)}
                onEdit={agendas.editExisting}
                onDelete={agendas.deleteItem}
              />
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="flex items-center justify-between border-b bg-gray-50/60 px-6 py-4">
              <CardTitle className="flex items-center gap-2">Speakers</CardTitle>

              <Button size="sm" onClick={speakers.addItem} className="bg-blue-600 text-white">
                <Plus size={16} /> Add New
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <SpeakersTable
                speakers={speakers.items}
                onEdit={speakers.editExisting}
                onDelete={speakers.deleteItem}
              />
            </CardContent>
          </Card>
        </div>

        <section className="rounded-lg border bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between px-4 pb-2">
            <h3 className="text-lg font-semibold">Sponsors</h3>

            <Button size="sm" onClick={sponsors.addItem} className="bg-blue-600 text-white">
              <Plus size={14} /> Add Sponsor
            </Button>
          </div>

          <SponsorsTable
            sponsors={sponsors.items}
            onEdit={sponsors.editExisting}
            onDelete={sponsors.deleteItem}
          />
        </section>

        <SpeakerFormDialog
          open={speakers.openDialog}
          onOpenChange={speakers.setOpenDialog}
          editData={speakers.editItem}
          eventId={eventId}
          onSuccess={speakers.loadItems}
        />

        <SponsorFormDialog
          open={sponsors.openDialog}
          onOpenChange={sponsors.setOpenDialog}
          editData={sponsors.editItem}
          eventId={eventId}
          onSuccess={sponsors.loadItems}
        />

        <AgendaFormDialog
          open={agendas.openDialog}
          onOpenChange={agendas.setOpenDialog}
          editData={agendas.editItem}
          eventId={eventId}
          onSuccess={agendas.loadItems}
        />

        <DeleteConfirmDialog
          open={!!speakers.deleteTarget}
          title="Delete Speaker"
          message={`Delete "${speakers.deleteTarget?.name.firstName ?? ''} ${
            speakers.deleteTarget?.name.lastName ?? ''
          }"?`}
          onConfirm={speakers.confirmDelete}
          onCancel={() => speakers.deleteItem(null as any)}
        />

        <DeleteConfirmDialog
          open={!!sponsors.deleteTarget}
          title="Delete Sponsor"
          message={`Delete "${sponsors.deleteTarget?.name}"?`}
          onConfirm={sponsors.confirmDelete}
          onCancel={() => sponsors.deleteItem(null as any)}
        />

        <DeleteConfirmDialog
          open={!!agendas.deleteTarget}
          title="Delete Agenda"
          message={`Delete "${agendas.deleteTarget?.title}"?`}
          onConfirm={agendas.confirmDelete}
          onCancel={() => agendas.deleteItem(null as any)}
        />
      </div>
    </>
  );
}

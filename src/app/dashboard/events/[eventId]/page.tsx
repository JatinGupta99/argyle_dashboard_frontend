"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Users, Mic, List, Plus } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEventContext } from "@/components/providers/EventContextProvider";
import { useAppDispatch } from "@/redux/hooks";
import { setExportLabel } from "@/redux/slices/toolbar-slice";

import { SpeakerService } from "@/services/speaker.service";
import { Speaker } from "@/lib/types/speaker";
import { SpeakersTable } from "./speakers/components/SpeakersTable";

interface Sponsor {
  id: string;
  name: string;
  tier: string;
}

// Mock sponsor service (replace with real API)
const SponsorService = {
  getAll: async (eventId: string): Promise<{ data: Sponsor[] }> => {
    console.log(`Mock: Fetching sponsors for event: ${eventId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: "s1", name: "MegaCorp", tier: "Diamond" },
            { id: "s2", name: "TechStart", tier: "Gold" },
            { id: "s3", name: "LocalShop", tier: "Silver" },
            { id: "s4", name: "GlobalInc", tier: "Bronze" },
          ],
        });
      }, 500);
    });
  },
};

// Simple Sponsor Dialog Placeholder
const SponsorFormDialog = ({ open, onOpenChange, editData }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold">
          {editData ? "Edit Sponsor" : "Add New Sponsor"}
        </h2>
        <button
          onClick={() => onOpenChange(false)}
          className="mt-4 text-sm text-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SponsorsTable = ({
  sponsors,
  onEdit,
}: {
  sponsors: Sponsor[];
  onEdit: (s: Sponsor) => void;
}) => (
  <div className="space-y-3 p-4">
    <h3 className="text-lg font-semibold border-b pb-2">All Sponsors</h3>

    {sponsors.length > 0 ? (
      sponsors.map((s, index) => (
        <div
          key={s.id}
          className="flex items-center justify-between border-b pb-2 last:border-b-0"
        >
          <span className="font-medium">
            {index + 1}. {s.name}
          </span>
          <span className="text-sm text-gray-600">{s.tier}</span>
          <Button variant="link" size="sm" onClick={() => onEdit(s)}>
            Edit
          </Button>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm">No sponsors added.</p>
    )}
  </div>
);

// Speaker Dialog Placeholder
const SpeakerFormDialog = ({ open }: any) => {
  if (!open) return null;
  return <></>;
};

// ========================================
// MAIN COMPONENT
// ========================================
export default function EventOverviewPage() {
  const event = useEventContext();
  const eventId = event?._id;
  const dispatch = useAppDispatch();

  // ------------ Speakers ------------
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [openSpeakerDialog, setOpenSpeakerDialog] = useState(false);
  const [editSpeakerData, setEditSpeakerData] = useState<Speaker | null>(null);

  const loadSpeakers = async () => {
    if (!eventId) return;
    try {
      const res = await SpeakerService.getAll(String(eventId));
      setSpeakers(res.data);
    } catch (err) {
      console.error("Failed to load speakers", err);
    }
  };

  const handleAddSpeaker = () => {
    setEditSpeakerData(null);
    setOpenSpeakerDialog(true);
  };

  const handleEditSpeaker = (speaker: Speaker) => {
    setEditSpeakerData(speaker);
    setOpenSpeakerDialog(true);
  };

  // ------------ Sponsors ------------
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [openSponsorDialog, setOpenSponsorDialog] = useState(false);
  const [editSponsorData, setEditSponsorData] = useState<Sponsor | null>(null);

  const loadSponsors = async () => {
    if (!eventId) return;
    try {
      const res = await SponsorService.getAll(String(eventId));
      setSponsors(res.data);
    } catch (err) {
      console.error("Failed to load sponsors", err);
    }
  };

  const handleEditSponsor = (s: Sponsor) => {
    setEditSponsorData(s);
    setOpenSponsorDialog(true);
  };

  // ------------ Initial Load ------------
  useEffect(() => {
    if (eventId) {
      loadSpeakers();
      loadSponsors();
    }
    dispatch(setExportLabel("Add Speaker"));
  }, [eventId, dispatch]);

  // ========================================
  // RENDER
  // ========================================
  return (
    <>
      <Header />

      <div className="flex flex-col w-full px-6 py-6 bg-gray-50 gap-6">
        {/* EVENT SUMMARY */}
        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{event?.title}</h1>
            <p className="text-gray-600">{event?.eventDetails}</p>

            <div className="flex items-center gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={18} /> {event?.EventDate}
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} /> {event?.attendees ?? 0} attendees
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3-COLUMN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agenda */}
          <Card className="shadow-sm rounded-xl md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List size={20} /> Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-gray-600 text-sm">
                Manage all agenda items for this event.
              </p>
              <Link
                href={`/events/${eventId}/agenda`}
                className="text-blue-600 text-sm underline font-medium"
              >
                Go to Agenda →
              </Link>
            </CardContent>
          </Card>

          {/* Speakers */}
<Card className="shadow-sm rounded-xl border border-gray-200">
  <CardHeader className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/60 rounded-t-xl">
    <CardTitle className="text-lg font-semibold flex items-center gap-2">
      Speakers
    </CardTitle>

    <Button
      size="sm"
      onClick={handleAddSpeaker}
      // Used 'gap-1' for spacing between icon and text, and used blue for consistency
      className="gap-1 text-white bg-blue-600 hover:bg-blue-700" 
    >
      <Plus size={16} /> Add New
    </Button>
  </CardHeader>

  {/* FIX: Changed p-1 to p-0 to remove external gaps/padding */}
  <CardContent className="p-0"> 
    {/* Added classes to hide table overflow and ensure smooth bottom corners */}
    <section className="rounded-b-xl overflow-hidden "> 
      <SpeakersTable speakers={speakers} onEdit={handleEditSpeaker} />
    </section>
  </CardContent>
</Card>
        </div>

        {/* FULL-WIDTH SPONSORS */}
        <section className="rounded-lg border bg-white shadow-sm p-2">
          <SponsorsTable sponsors={sponsors} onEdit={handleEditSponsor} />
        </section>

        {/* Dialogs */}
        <SpeakerFormDialog
          open={openSpeakerDialog}
          onOpenChange={setOpenSpeakerDialog}
          editData={editSpeakerData}
          onSuccess={loadSpeakers}
          eventId={String(eventId)}
        />

        <SponsorFormDialog
          open={openSponsorDialog}
          onOpenChange={setOpenSponsorDialog}
          editData={editSponsorData}
          onSuccess={loadSponsors}
          eventId={String(eventId)}
        />
      </div>
    </>
  );
}

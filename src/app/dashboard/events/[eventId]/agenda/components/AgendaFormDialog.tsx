"use client";

import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

import { Agenda, CreateAgendaDto } from "@/lib/types/agenda";
import { addAgenda, updateAgenda } from "@/redux/slices/agenda-thunks";

interface SpeakerItem {
  id: string;
  name: string;
}

interface AgendaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Agenda;
  eventId: string;
  onSubmit: () => void;
}

const DEFAULT_FORM = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  speakers: [] as string[],
  hasPoll: false,
};

export function AgendaFormDialog({
  open,
  onOpenChange,
  editData,
  eventId,
  onSubmit,
}: AgendaFormDialogProps) {
  const dispatch = useAppDispatch();

  const availableSpeakers: SpeakerItem[] = [
    { id: "67b0c7a35d12a92c9b077777", name: "Speaker A" },
    { id: "67b0c7a35d12a92c9b078888", name: "Speaker B" },
  ];

  const [formData, setFormData] = useState(DEFAULT_FORM);

useEffect(() => {
  if (!editData) {
    setFormData(DEFAULT_FORM);
    return;
  }

  const start = editData.startDateTime ? new Date(editData.startDateTime) : null;
  const end = editData.endDateTime ? new Date(editData.endDateTime) : null;

  setFormData({
    title: editData.title ?? "",
    date: start ? start.toISOString().split("T")[0] : "",
    startTime: start ? start.toISOString().slice(11, 16) : "",
    endTime: end ? end.toISOString().slice(11, 16) : "",
    description: editData.description ?? "",
    speakers: Array.from(new Set(editData.speakers ?? [])),
    hasPoll: Boolean(editData.hasPoll),
  });
}, [editData]);

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addSpeaker = (id: string) => {
    updateField("speakers", Array.from(new Set([...formData.speakers, id])));
  };

  const removeSpeaker = (id: string) => {
    updateField(
      "speakers",
      formData.speakers.filter((s) => s !== id)
    );
  };

  const handleSave = async () => {
    const payload: CreateAgendaDto = {
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      speakers: formData.speakers,
      hasPoll: formData.hasPoll,
    };

    try {
      if (editData) {
        await dispatch(
          updateAgenda({
            eventId,
            agendaId: editData._id,
            payload,
          })
        ).unwrap();

        toast.success("Agenda updated successfully");
      } else {
        await dispatch(addAgenda({ eventId, payload })).unwrap();
        toast.success("Agenda added successfully");
      }

      onSubmit();
      onOpenChange(false);
    } catch (err: any) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Something went wrong";

      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex justify-between">
          <DialogTitle className="text-lg font-semibold">
            {editData ? "Edit Agenda" : "Add Agenda"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
              />
            </div>

            <div className="flex-1">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div>
            <Label>Speakers</Label>

            <Select value="" onValueChange={addSpeaker}>
              <SelectTrigger>
                <SelectValue placeholder="Add a speaker" />
              </SelectTrigger>
              <SelectContent>
                {availableSpeakers.map((sp) => (
                  <SelectItem key={sp.id} value={sp.id}>
                    {sp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-3 space-y-2">
              {formData.speakers.map((id) => {
                const speaker = availableSpeakers.find((s) => s.id === id);

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
                  >
                    <span>{speaker?.name ?? id}</span>
                    <Button variant="ghost" onClick={() => removeSpeaker(id)}>
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.hasPoll}
              onChange={(e) => updateField("hasPoll", e.target.checked)}
            />
            <Label>Enable Poll</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              onClick={handleSave}
            >
              {editData ? "Save Changes" : "Add Agenda +"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

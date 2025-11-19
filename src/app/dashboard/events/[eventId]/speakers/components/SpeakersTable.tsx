"use client";

import { Linkedin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { Speaker } from "@/lib/types/speaker";

interface SpeakersTableProps {
  speakers: Speaker[];
  onEdit?: (speaker: Speaker) => void;
  onDelete?: (speaker: Speaker) => void;
}

export function SpeakersTable({ speakers, onEdit, onDelete }: SpeakersTableProps) {
  if (!Array.isArray(speakers) || speakers.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No speakers found.
      </div>
    );
  }

  return (
    <div className="h-[40vh] rounded-lg border border-gray-200 shadow-sm overflow-y-auto">
      <Table className="w-full text-sm">

        <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">LinkedIn</TableHead>
            <TableHead className="text-center w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {speakers.map((speaker) => {
            const first = speaker.name?.firstName || "";
            const last = speaker.name?.lastName || "";
            const initials = `${first[0] ?? ""}${last[0] ?? ""}` || "?";

            return (
              <TableRow key={speaker._id} className="hover:bg-gray-50">

                {/* NAME */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={speaker.pictureUrl || ""} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <span className="font-medium text-gray-900">
                      {first} {last}
                    </span>
                  </div>
                </TableCell>

                {/* LINKEDIN */}
                <TableCell className="text-center">
                  {speaker.linkedInUrl ? (
                    <a
                      href={speaker.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>

                {/* ACTIONS DROPDOWN */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-md">
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => onEdit?.(speaker)}>
                        <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                        Modify
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDelete?.(speaker)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>

      </Table>
    </div>
  );
}

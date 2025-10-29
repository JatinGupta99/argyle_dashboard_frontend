import { Linkedin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Speaker {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  title: string;
  email: string;
  companyName: string;
  bio: string;
  pictureUrl: string;
  linkedInUrl: string;
}

interface SpeakersTableProps {
  speakers: Speaker[];
}

export function SpeakersTable({ speakers }: SpeakersTableProps) {
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-gray-700 font-semibold">Name</TableHead>
          <TableHead className="text-gray-700 font-semibold">Email</TableHead>
          <TableHead className="text-gray-700 font-semibold">Title</TableHead>
          <TableHead className="text-gray-700 font-semibold">Company</TableHead>
          <TableHead className="text-gray-700 font-semibold">LinkedIn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {speakers.map((speaker) => (
          <TableRow key={speaker._id} className="border-b border-gray-200 hover:bg-gray-50">
            <TableCell className="py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={speaker.pictureUrl} alt={`${speaker.name.firstName} ${speaker.name.lastName}`} />
                  <AvatarFallback>
                    {speaker.name.firstName[0]}
                    {speaker.name.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-900">
                  {speaker.name.firstName} {speaker.name.lastName}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-blue-600 hover:text-blue-800">
              <a href={`mailto:${speaker.email}`}>{speaker.email}</a>
            </TableCell>
            <TableCell className="text-gray-700">{speaker.title}</TableCell>
            <TableCell className="text-gray-700">{speaker.companyName}</TableCell>
            <TableCell>
              <a
                href={speaker.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

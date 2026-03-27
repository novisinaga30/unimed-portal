import type { InfoNote } from "@/types";

type InfoNoteCardProps = {
  note: InfoNote;
};

export default function InfoNoteCard({ note }: InfoNoteCardProps) {
  return (
    <div
      className={`border-l-4 ${note.borderColor} ${note.bgColor} rounded-xl p-4`}
    >
      <p className="font-semibold text-blue-900">{note.title}</p>
      <p className="text-sm text-gray-600 mt-1">{note.description}</p>
    </div>
  );
}
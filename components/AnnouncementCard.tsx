import type { Announcement } from "@/types";

type AnnouncementCardProps = {
  item: Announcement;
};

export default function AnnouncementCard({
  item,
}: AnnouncementCardProps) {
  return (
    <div className="border rounded-xl p-4 bg-white hover:shadow-md transition">
      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
        {item.category}
      </span>
      <h3 className="font-semibold text-blue-900">{item.title}</h3>
      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
      <p className="text-xs text-gray-400 mt-3">
        Dipublikasikan: {item.date}
      </p>
    </div>
  );
}
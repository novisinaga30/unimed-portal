import type { DashboardStat } from "@/types";

type StatCardProps = {
  stat: DashboardStat;
};

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
      <h3 className={`text-2xl font-bold ${stat.valueColor || "text-blue-950"}`}>
        {stat.value}
      </h3>
    </div>
  );
}
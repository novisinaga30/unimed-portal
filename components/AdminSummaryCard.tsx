type AdminSummaryCardProps = {
  label: string;
  value: string | number;
};

export default function AdminSummaryCard({
  label,
  value,
}: AdminSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <h3 className="text-2xl font-bold text-blue-950">{value}</h3>
    </div>
  );
}
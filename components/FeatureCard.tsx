type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition duration-300">
      <div className="w-12 h-12 rounded-xl bg-blue-100 mb-4"></div>
      <h3 className="text-xl font-semibold text-blue-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
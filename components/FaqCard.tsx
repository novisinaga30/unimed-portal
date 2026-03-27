import type { HelpFaq } from "@/types";

type FaqCardProps = {
  faq: HelpFaq;
};

export default function FaqCard({ faq }: FaqCardProps) {
  return (
    <div className="border rounded-xl p-4 bg-white hover:shadow-md transition">
      <h3 className="font-semibold text-blue-900">{faq.question}</h3>
      <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
    </div>
  );
}
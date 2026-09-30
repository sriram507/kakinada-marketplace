import { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-5 border-l-4 border-emerald-600 pl-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}
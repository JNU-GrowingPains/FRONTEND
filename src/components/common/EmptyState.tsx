import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-gray-400">
        {icon || <PackageOpen size={48} />}
      </div>
      <h3 className="mb-2 text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
}

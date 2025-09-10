import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'safe' | 'caution' | 'danger';
  label: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ status, label, value, size = 'md' }: StatusIndicatorProps) {
  const statusColors = {
    safe: 'bg-status-safe',
    caution: 'bg-status-caution',
    danger: 'bg-status-danger'
  };

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "rounded-full animate-pulse",
        statusColors[status],
        sizeClasses[size]
      )} />
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {value && (
          <div className="text-xs text-muted-foreground">{value}</div>
        )}
      </div>
    </div>
  );
}
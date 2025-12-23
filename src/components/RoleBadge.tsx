import { Badge } from '@/components/ui/badge';
import { Shield, Briefcase } from 'lucide-react';
import { AppRole } from '@/hooks/useUserRole';

interface RoleBadgeProps {
  role: AppRole | null;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (!role) return null;

  const config = {
    analyst: {
      label: 'Analyst',
      icon: Shield,
      className: 'bg-intel-cyan/20 text-intel-cyan border-intel-cyan/30',
    },
    client: {
      label: 'Executive',
      icon: Briefcase,
      className: 'bg-intel-amber/20 text-intel-amber border-intel-amber/30',
    },
  };

  const { label, icon: Icon, className } = config[role];

  return (
    <Badge variant="outline" className={`text-[10px] font-mono uppercase ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}

import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon = FolderOpen, message, action }: EmptyStateProps) => (
  <div className="empty-state">
    <Icon size={40} className="empty-state-icon" />
    <p className="empty-state-text">{message}</p>
    {action && <div className="empty-state-action">{action}</div>}
  </div>
);

export default EmptyState;

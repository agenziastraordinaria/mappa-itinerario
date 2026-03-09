import { Stop } from "@/data/mockTrip";
import { MapPin, Check, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StopCardProps {
  stop: Stop;
  isActive: boolean;
  onClick: () => void;
}

const statusConfig = {
  visited: { icon: Check, className: "bg-travel-green text-accent-foreground" },
  current: { icon: Navigation, className: "bg-accent text-accent-foreground" },
  upcoming: { icon: MapPin, className: "bg-muted text-muted-foreground" },
};

const StopCard = ({ stop, isActive, onClick }: StopCardProps) => {
  const status = statusConfig[stop.status];
  const StatusIcon = status.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
        isActive
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-secondary border border-transparent"
      )}
    >
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold", status.className)}>
        {stop.order}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-semibold text-sm truncate", isActive ? "text-primary" : "text-foreground")}>
          {stop.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{stop.date}</p>
      </div>

      <StatusIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
    </motion.button>
  );
};

export default StopCard;

import { Stop } from "@/data/mockTrip";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StopCardProps {
  stop: Stop;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenDetail: (stop: Stop) => void;
}

const StopCard = ({ stop, isExpanded, onToggle, onOpenDetail }: StopCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        isExpanded
          ? "bg-primary/8 border-primary/25 shadow-sm"
          : "bg-card border-border/50 hover:bg-secondary/60 hover:border-border"
      )}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 text-left"
      >
        <div
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
            isExpanded
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {stop.order}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold text-sm truncate transition-colors",
            isExpanded ? "text-primary" : "text-foreground"
          )}>
            {stop.title}
          </p>
          {stop.date && (
            <p className="text-[11px] text-muted-foreground mt-0.5 tracking-wide">
              {stop.date}
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pl-[3.25rem] space-y-2.5">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {stop.description}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenDetail(stop); }}
                className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors underline underline-offset-2"
              >
                Scopri di più
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StopCard;

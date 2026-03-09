import { Stop } from "@/data/mockTrip";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StopCardProps {
  stop: Stop;
  isActive: boolean;
  onClick: () => void;
  onOpenDetail: (stop: Stop) => void;
}

const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max).trimEnd() + "…" : text;

const StopCard = ({ stop, isActive, onClick, onOpenDetail }: StopCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        isActive
          ? "bg-primary/8 border-primary/25 shadow-sm"
          : "bg-card border-border/50 hover:bg-secondary/60 hover:border-border"
      )}
    >
      <button
        onClick={onClick}
        className="w-full flex items-start gap-3 p-3.5 text-left"
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {stop.order}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold text-sm truncate transition-colors",
            isActive ? "text-primary" : "text-foreground"
          )}>
            {stop.title}
          </p>
          {stop.date && (
            <p className="text-[11px] text-muted-foreground mt-0.5 tracking-wide uppercase">
              {stop.date}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {truncate(stop.description, 120)}
          </p>
        </div>
      </button>

      <div className="px-3.5 pb-2.5">
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
          className="flex items-center gap-1 text-xs font-medium text-primary/70 hover:text-primary transition-colors"
        >
          <span>{expanded ? "Comprimi" : "Espandi"}</span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-border/30 mx-3.5 mb-1">
              <p className="text-sm text-foreground/90 leading-relaxed pt-2.5">{stop.description}</p>
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

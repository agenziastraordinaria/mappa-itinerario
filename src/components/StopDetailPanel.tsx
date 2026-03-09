import { Stop } from "@/data/mockTrip";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StopDetailPanelProps {
  stop: Stop | null;
  onClose: () => void;
}

const StopDetailPanel = ({ stop, onClose }: StopDetailPanelProps) => {
  return (
    <AnimatePresence>
      {stop && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/30"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[2001] w-[40%] min-w-[340px] bg-card shadow-2xl overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full p-2 bg-background/80 backdrop-blur hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Image */}
            {stop.image && (
              <div className="relative h-[280px]">
                <img
                  src={stop.image}
                  alt={stop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="text-white/70 text-sm font-medium">
                    Tappa {stop.order}
                  </span>
                  <h2 className="text-3xl font-bold text-white leading-tight mt-1">
                    {stop.title}
                  </h2>
                  {stop.date && (
                    <p className="text-white/80 text-sm mt-1">{stop.date}</p>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-5">
              {!stop.image && (
                <>
                  <span className="text-muted-foreground text-sm font-medium">
                    Tappa {stop.order}
                  </span>
                  <h2 className="text-3xl font-bold text-foreground leading-tight">
                    {stop.title}
                  </h2>
                  {stop.date && (
                    <p className="text-muted-foreground text-sm">{stop.date}</p>
                  )}
                </>
              )}

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Descrizione
                </h3>
                <p className="text-foreground leading-relaxed">{stop.description}</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default StopDetailPanel;

import { Stop } from "@/data/mockTrip";

interface StopPopupProps {
  stop: Stop;
}

const StopPopup = ({ stop }: StopPopupProps) => {
  return (
    <div className="w-[280px] overflow-hidden">
      <div className="relative h-[140px]">
        <img
          src={stop.image}
          alt={stop.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-bold text-lg leading-tight">{stop.title}</h3>
          <p className="text-white/80 text-xs">{stop.date}</p>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm text-foreground leading-relaxed">{stop.description}</p>
      </div>
    </div>
  );
};

export default StopPopup;

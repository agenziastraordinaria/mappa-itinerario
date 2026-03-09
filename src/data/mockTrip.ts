export type StopStatus = "visited" | "current" | "upcoming";

export interface Stop {
  id: string;
  title: string;
  order: number;
  latitude: number;
  longitude: number;
  description: string;
  date: string;
  image: string;
}

export interface Trip {
  title: string;
  slug: string;
  mapCenter: [number, number];
  zoom: number;
  stops: Stop[];
}

export const mockTrip: Trip = {
  title: "Estate Mediterranea",
  slug: "mediterranean-summer",
  mapCenter: [41.0, 15.0],
  zoom: 5,
  stops: [
    {
      id: "1",
      title: "Barcelona",
      order: 1,
      latitude: 41.3851,
      longitude: 2.1734,
      description: "Esplora i capolavori di Gaudí, passeggia lungo La Rambla e gusta tapas in riva al mare.",
      date: "12 Giu 2025",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=250&fit=crop",
    },
    {
      id: "2",
      title: "Nice",
      order: 2,
      latitude: 43.7102,
      longitude: 7.262,
      description: "Passeggia sulla Promenade des Anglais e scopri i vivaci mercati della Città Vecchia.",
      date: "16 Giu 2025",
      image: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=400&h=250&fit=crop",
    },
    {
      id: "3",
      title: "Rome",
      order: 3,
      latitude: 41.9028,
      longitude: 12.4964,
      description: "Visita il Colosseo, lancia una moneta nella Fontana di Trevi e assapora una pasta autentica.",
      date: "20 Giu 2025",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop",
    },
    {
      id: "4",
      title: "Santorini",
      order: 4,
      latitude: 36.3932,
      longitude: 25.4615,
      description: "Ammira il tramonto sulla caldera dalle scogliere bianche di Oia.",
      date: "25 Giu 2025",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=250&fit=crop",
    },
    {
      id: "5",
      title: "Dubrovnik",
      order: 5,
      latitude: 42.6507,
      longitude: 18.0944,
      description: "Walk the ancient city walls and kayak along the stunning Adriatic coast.",
      date: "Jun 30, 2025",
      image: "https://images.unsplash.com/photo-1555990538-1e15c2dd09be?w=400&h=250&fit=crop",
    },
  ],
};

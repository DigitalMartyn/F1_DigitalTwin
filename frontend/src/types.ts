export interface DriverPosition {
  x: number | null;
  y: number | null;
  position: number | null;
  status: string;
  compound: string;
  speed: number | null;
  gear: number | null;
  drs: number | null;
}

export interface Frame {
  time: number;
  lap: number;
  positions: Record<string, DriverPosition>;
}

export interface TrackData {
  x: number[];
  y: number[];
}

export interface DriverInfo {
  abbreviation: string;
  full_name: string;
  team: string;
  number: string;
}

export interface RaceData {
  event: {
    name: string;
    round: number;
    year: number;
    session_type: string;
  };
  track: TrackData;
  frames: Frame[];
  track_statuses: Record<string, string>;
  driver_colors: Record<string, string>;
  drivers: Record<string, DriverInfo>;
  circuit_rotation: number;
  total_laps: number | null;
}

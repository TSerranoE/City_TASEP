export interface SimulationControlsProps {
  isStart: boolean;
  onStartToggle: () => void;
  onModeChange: (mode: string) => void;
}

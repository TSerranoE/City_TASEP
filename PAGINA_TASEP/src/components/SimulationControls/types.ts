export interface SimulationControlsProps {
  isStart: boolean;
  onStartToggle: () => void;
  onModeChange: (mode: string) => void;
  size: number;
  onSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

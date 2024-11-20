import { StartButton } from "../buttons";
import { TripleSwitch } from "../switch";
import { Slider } from "../slider";
import type { SimulationControlsProps } from "./types";
import styles from "./styles.module.css";

export default function SimulationControls({
  isStart,
  onStartToggle,
  onModeChange,
  size,
  onSizeChange,
}: SimulationControlsProps) {
  return (
    <div className={styles.controls}>
      <StartButton onClick={onStartToggle} isStart={isStart} />
      <TripleSwitch onChange={onModeChange} />
      <Slider
        title="Grid Size"
        value={size}
        onChange={onSizeChange}
        min={1}
        max={100}
        step={1}
      />
    </div>
  );
}

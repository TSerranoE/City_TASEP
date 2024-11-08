import { StartButton } from "../buttons";
import { TripleSwitch } from "../switch";
import type { SimulationControlsProps } from "./types";
import styles from "./styles.module.css";

export default function SimulationControls({
  isStart,
  onStartToggle,
  onModeChange,
}: SimulationControlsProps) {
  return (
    <div className={styles.controls}>
      <StartButton onClick={onStartToggle} isStart={isStart} />
      <TripleSwitch onChange={onModeChange} />
    </div>
  );
}

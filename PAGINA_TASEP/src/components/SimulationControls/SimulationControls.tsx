import { StartButton, ViewToggleButton } from "../buttons";
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
  hasStarted,
  showHeightFunction,
  onToggleView,
  step,
  onStepChange,
  velocity,
  onVelocityChange,
  particles,
  onParticlesChange,
}: SimulationControlsProps) {
  return (
    <div className={styles.controls}>
      <StartButton onClick={onStartToggle} isStart={isStart} />

      <div className={styles.slidersContainer}>
        {!hasStarted && (
          <>
            <Slider
              title="Step"
              value={step}
              onChange={onStepChange}
              min={1}
              max={100}
              step={1}
            />
            <Slider
              title="Particles"
              value={particles}
              onChange={onParticlesChange}
              min={0}
              max={10000}
              step={10}
            />
          </>
        )}
        <Slider
          title="Velocity"
          value={velocity}
          onChange={onVelocityChange}
          min={0.1}
          max={1}
          step={0.01}
        />
      </div>

      <div className={styles.controlsRow}>
        <ViewToggleButton
          onClick={onToggleView}
          showHeightFunction={showHeightFunction}
        />
        <TripleSwitch onChange={onModeChange} />
      </div>

      {!hasStarted && (
        <Slider
          title="Grid Size"
          value={size}
          onChange={onSizeChange}
          min={1}
          max={100}
          step={1}
        />
      )}
    </div>
  );
}

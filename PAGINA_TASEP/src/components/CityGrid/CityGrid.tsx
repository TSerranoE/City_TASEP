import { useState } from "react";
import { Grid } from "../grid";
import { CreateCar } from "../car";
import { useSendSimulationData } from "../../hooks/useSendSimulationData";
import { useReceiveSimulationData } from "../../hooks/useReceiveSimulationData";
import type { CityGridProps } from "./types";
import styles from "./styles.module.css";

const GRID_SIZE = 25;

export default function CityGrid({
  clickedLines,
  onClickedLinesUpdate,
  isStart,
  isClear,
  setIsClear,
  simulationMode,
}: CityGridProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const { cars } = useReceiveSimulationData(isStart);

  useSendSimulationData({
    clickedLines,
    size: GRID_SIZE,
    isStart,
    isClear,
    setIsClear,
    mode: simulationMode,
  });

  // Update hasStarted when simulation starts for the first time
  if (isStart && !hasStarted) {
    setHasStarted(true);
  }

  return (
    <div className={styles.carContainer}>
      <Grid
        size={GRID_SIZE}
        clickedLines={clickedLines}
        onClickedLinesUpdate={onClickedLinesUpdate}
        hasStarted={hasStarted}
      />
      {cars.map((car) => (
        <CreateCar
          key={car.id}
          position={{ col: car.col, row: car.row }}
          color={car.color}
          id={car.id}
          gridSize={GRID_SIZE}
        />
      ))}
    </div>
  );
}

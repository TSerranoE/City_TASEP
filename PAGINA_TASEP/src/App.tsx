import { useState, useCallback } from "react";
import Grid from "./components/Grid";
import ControlPanel from "./components/ControlPanel";
import DataDisplay from "./components/DataDisplay";
import CarForm from "./components/CarForm";
import CreateCar from "./components/CreateCar";
import MoveCarForm from "./components/MoveCarForm";
import {
  calculateIntersections,
  calculateExtremePoints,
} from "./utils/gridCalculations";
import styles from "./App.module.css";

function App() {
  const size = 50;
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  const [showIntersections, setShowIntersections] = useState(false);
  const [showExtremePoints, setShowExtremePoints] = useState(false);
  const [cars, setCars] = useState<
    Array<{ row: number; col: number; color: string; id: string }>
  >([]);
  const [nextCarId, setNextCarId] = useState(1);

  const intersections = calculateIntersections(clickedLines);
  const extremePoints = calculateExtremePoints(clickedLines, size);

  const toggleIntersections = () => {
    setShowIntersections(!showIntersections);
    setShowExtremePoints(false);
  };

  const toggleExtremePoints = () => {
    setShowExtremePoints(!showExtremePoints);
    setShowIntersections(false);
  };

  const getNextCarId = useCallback(() => {
    const id = `car-${nextCarId}`;
    setNextCarId((prevId) => prevId + 1);
    return id;
  }, [nextCarId]);

  const handleAddCar = (
    row: number,
    col: number,
    color: string,
    id: string
  ) => {
    setCars((prevCars) => [...prevCars, { row, col, color, id }]);
  };

  const handleMoveCar = (id: string, newRow: number, newCol: number) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === id ? { ...car, row: newRow, col: newCol } : car
      )
    );
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <div className={styles.gridContainer}>
        <Grid
          size={size}
          clickedLines={clickedLines}
          onClickedLinesUpdate={setClickedLines}
        />
        {cars.map((car) => (
          <CreateCar
            key={car.id}
            position={{ col: car.col, row: car.row }}
            color={car.color}
            id={car.id}
            gridSize={size}
          />
        ))}
      </div>
      <p className={styles.instructions}>Scroll or press 'r' to rotate</p>
      <ControlPanel
        showIntersections={showIntersections}
        showExtremePoints={showExtremePoints}
        onToggleIntersections={toggleIntersections}
        onToggleExtremePoints={toggleExtremePoints}
      />

      <DataDisplay
        showIntersections={showIntersections}
        showExtremePoints={showExtremePoints}
        intersections={intersections}
        extremePoints={extremePoints}
      />
      <div className={styles.formContainer}>
        <CarForm
          onAddCar={handleAddCar}
          gridSize={size}
          getNextCarId={getNextCarId}
        />
        <MoveCarForm onMoveCar={handleMoveCar} gridSize={size} cars={cars} />
      </div>
    </div>
  );
}

export default App;

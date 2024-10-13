import { useState, useCallback, useEffect } from "react";
import Grid from "./components/Grid";
import ControlPanel from "./components/ControlPanel";
import DataDisplay from "./components/DataDisplay";
import CarForm from "./components/CarForm";
import CreateCar from "./components/CreateCar";
import MoveCarForm from "./components/MoveCarForm";
import { carImages } from "./components/CreateCar";
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

  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/update_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intersections: Array.from(intersections),
            extremePoints: Array.from(extremePoints),
            size,
          }),
        });
        const data = await response.json();
        console.log("Data sent to backend:", data);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    };

    sendDataToBackend();
  }, [intersections, extremePoints, size]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch("http://localhost:5000/state");
        const data = await response.json();
        console.log("Received state from backend:", data);
      } catch (error) {
        console.error("Error fetching simulation state:", error);
      }
    };

    const intervalId = setInterval(fetchState, 500); // Fetch state every 0.5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);
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
    color: keyof typeof carImages,
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

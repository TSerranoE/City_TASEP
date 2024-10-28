import { useState, /* useCallback, */ useEffect } from "react";
import Grid from "./components/Grid";
// import ControlPanel from "./components/ControlPanel";
// import DataDisplay from "./components/DataDisplay";
// import CarForm from "./components/CarForm";
// import MoveCarForm from "./components/MoveCarForm";
import CreateCar from "./components/CreateCar";
import TripleSwitch from "./components/TrippleSwitch";
import {
  calculateIntersections,
  calculateRowAndCols,
} from "./utils/gridCalculations";
import styles from "./App.module.css";
import StartButton from "./components/StartButton";

function App() {
  const size = 50;
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  // const [showIntersections, setShowIntersections] = useState(false);
  // const [showRowAndCols, setShowRowAndCols] = useState(false);
  const [cars, setCars] = useState<
    Array<{
      row: number;
      col: number;
      color: string;
      id: string;
    }>
  >([]);
  //const [nextCarId, setNextCarId] = useState(1);
  const [isActive, setIsActive] = useState(false);

  const intersections = calculateIntersections(clickedLines);
  const { /* rowAndCols, */ calles } = calculateRowAndCols(clickedLines);

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
            calles: Array.from(calles),
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
  }, [isActive]);

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

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch("http://localhost:5000/state");
        const data = await response.json();

        type Particula = {
          col: number;
          color: string;
          id: string;
          row: number;
        };

        type ParticulaActualizada = {
          id: string;
          new_col: number;
          new_row: number;
        };

        const particulas: Record<string, ParticulaActualizada> =
          data["particulas"];
        const particulas_agregadas: Record<string, Particula> =
          data["particulas_agregadas"];

        // Convert particulas_agregadas object to an array and iterate
        Object.values(particulas_agregadas).forEach((particula) => {
          const { col, color, id, row } = particula;
          console.log("Adding car:", particula);
          handleAddCar(col, row, color, id);
        });

        // Convert particulas object to an array and iterate
        Object.values(particulas).forEach((particula) => {
          const { id, new_col, new_row } = particula;
          console.log("Updating car:", particula);
          handleMoveCar(id, new_col, new_row);
        });

        //console.log("Received state from backend:", data);
      } catch (error) {
        console.error("Error fetching simulation state:", error);
      }
    };

    const intervalId = setInterval(fetchState, 1000); // Fetch state every 0.5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // const toggleIntersections = () => {
  //   setShowIntersections(!showIntersections);
  //   setShowRowAndCols(false);
  // };

  // const toggleRowAndCols = () => {
  //   setShowRowAndCols(!showRowAndCols);
  //   setShowIntersections(false);
  // };

  // const getNextCarId = useCallback(() => {
  //   const id = `car-${nextCarId}`;
  //   setNextCarId((prevId) => prevId + 1);
  //   return id;
  // }, [nextCarId]);

  const toggleStart = () => setIsActive((prev) => !prev);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <div className={styles.gridContainer}>
        <StartButton onClick={toggleStart} isActive={isActive} />
        <div className={styles.carContainer}>
          <Grid
            size={size}
            clickedLines={clickedLines}
            onClickedLinesUpdate={setClickedLines}
            isActive={isActive}
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
        <TripleSwitch
          onChange={(value) => console.log("Switch value:", value)}
        />
      </div>
      <p className={styles.instructions}>Scroll or press 'r' to rotate.</p>
    </div>
  );
}

export default App;

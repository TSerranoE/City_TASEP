import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import CreateCar from "./components/CreateCar";
import TripleSwitch from "./components/TrippleSwitch";
import styles from "./App.module.css";
import StartButton from "./components/StartButton";
import calculateRowAndCols from "./utils/calculateRowAndCols";

function App() {
  const size = 25;
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  const { calles } = calculateRowAndCols(clickedLines);
  const [isClear, setIsClear] = useState(true);
  const [isStart, setisStart] = useState(false);
  const toggleStart = () => setisStart((prev) => !prev);
  const [cars, setCars] = useState<
    Array<{
      row: number;
      col: number;
      color: string;
      id: string;
    }>
  >([]);

  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/update_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calles: Array.from(calles),
            size: size,
            isStart: isStart,
            isClear: isClear,
          }),
        });
        setIsClear(false);
        const data = await response.json();
        console.log("Data sent to backend:", data);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    };

    sendDataToBackend();
  }, [isStart]);

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

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <div className={styles.gridContainer}>
        <StartButton onClick={toggleStart} isStart={isStart} />
        <div className={styles.carContainer}>
          <Grid
            size={size}
            clickedLines={clickedLines}
            onClickedLinesUpdate={setClickedLines}
            isStart={isStart}
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

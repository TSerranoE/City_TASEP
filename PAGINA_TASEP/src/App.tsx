import { useState } from "react";
import { CityGrid } from "./components/CityGrid";
import { SimulationControls } from "./components/SimulationControls";
import styles from "./App.module.css";

function App() {
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  const [isStart, setIsStart] = useState(false);
  const [isClear, setIsClear] = useState(true);
  const [simulationMode, setSimulationMode] = useState("Paralelo");

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <div className={styles.gridContainer}>
        <CityGrid
          clickedLines={clickedLines}
          onClickedLinesUpdate={setClickedLines}
          isStart={isStart}
          isClear={isClear}
          setIsClear={setIsClear}
          simulationMode={simulationMode}
        />
        <SimulationControls
          isStart={isStart}
          onStartToggle={() => setIsStart((prev) => !prev)}
          onModeChange={setSimulationMode}
        />
      </div>
    </div>
  );
}
export default App;

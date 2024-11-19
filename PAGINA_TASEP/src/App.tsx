import { useState, useCallback } from "react";
import { CityGrid } from "./components/CityGrid";
import { HeightFunction } from "./components/HeightFunction";
import { SimulationControls } from "./components/SimulationControls";
import { useReceiveSimulationData } from "./hooks/useReceiveSimulationData";
import styles from "./App.module.css";

function App() {
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  const [isStart, setIsStart] = useState(false);
  const [isClear, setIsClear] = useState(true);
  const [simulationMode, setSimulationMode] = useState("Paralelo");
  const { DiccionarioFuncionAltura } = useReceiveSimulationData(isStart);

  const size = 100;

  const generateDataPlot3D = useCallback(() => {
    if (!DiccionarioFuncionAltura) return Array(size).fill(Array(size).fill(0));

    const data = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));

    Object.entries(DiccionarioFuncionAltura).forEach(([key, value]) => {
      const [x, y] = key.split(",").map(Number);
      if (x < size && y < size) {
        data[y][x] = value || 0;
      }
    });

    return data;
  }, [DiccionarioFuncionAltura]);

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
          size={size}
        />
        <SimulationControls
          isStart={isStart}
          onStartToggle={() => setIsStart((prev) => !prev)}
          onModeChange={setSimulationMode}
        />
      </div>
      <h1 className={styles.title}>City Tasep 3D</h1>
      <div className={styles.heightFunctionContainer}>
        <HeightFunction
          data={generateDataPlot3D()}
          size={size}
          clickedLines={clickedLines}
          isStart={isStart}
          isClear={isClear}
          simulationMode={simulationMode}
          onClickedLinesUpdate={setClickedLines}
          setIsClear={setIsClear}
          isVerticalHover={false}
        />
      </div>
    </div>
  );
}

export default App;

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
  const [size, setSize] = useState(25);

  const { DiccionarioFuncionAltura } = useReceiveSimulationData(isStart);

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
  }, [DiccionarioFuncionAltura, size]);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <div className={styles.gridContainer}>
        <CityGrid
          size={size}
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
          size={size}
          onSizeChange={(e) => setSize(Number(e.target.value))}
        />
      </div>
      <h1 className={styles.title}>Height Function</h1>
      <div className={styles.heightFunctionContainer}>
        <HeightFunction
          data={generateDataPlot3D()}
          size={size}
          clickedLines={clickedLines}
          onClickedLinesUpdate={setClickedLines}
          isStart={isStart}
          isClear={isClear}
          setIsClear={setIsClear}
          simulationMode={simulationMode}
        />
      </div>
    </div>
  );
}

export default App;

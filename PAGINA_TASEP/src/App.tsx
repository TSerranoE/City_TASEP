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

  const generateDataPlot3D = useCallback(() => {
    if (!DiccionarioFuncionAltura) return Array(25).fill(Array(25).fill(0));

    const data = Array(25)
      .fill(null)
      .map(() => Array(25).fill(0));

    Object.entries(DiccionarioFuncionAltura).forEach(([key, value]) => {
      const [x, y] = key.split(",").map(Number);
      if (x < 25 && y < 25) {
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
          size={25}
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

import { useState, useCallback } from "react";
import { HeightFunction } from "./components/HeightFunction";
import { CityGrid } from "./components/CityGrid";
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
    console.log(DiccionarioFuncionAltura);
    const data = [];
    for (let y = 0; y < 25; y++) {
      const row = [];
      for (let x = 0; x < 25; x++) {
        row.push(DiccionarioFuncionAltura[`${x},${y}`]);
      }
      data.push(row);
    }
    console.log(data);
    return data;
  }, []);

  // const generateSampleData = useCallback(() => {
  //   const data = [];
  //   for (let y = 0; y < 25; y++) {
  //     const row = [];
  //     for (let x = 0; x < 25; x++) {
  //       // Using Math.abs to ensure the values are always positive
  //       row.push(Math.abs(Math.sin(x / 5) * Math.cos(y / 5)) * 0.5);
  //     }
  //     data.push(row);
  //   }
  //   return data;
  // }, []);

  const [heightData] = useState<number[][]>(generateDataPlot3D());

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
          data={heightData}
          size={25}
          clickedLines={clickedLines}
          isStart={isStart}
          isClear={isClear}
          simulationMode={simulationMode}
          onClickedLinesUpdate={setClickedLines}
          setIsClear={setIsClear}
          isVerticalHover={false} // or true, depending on your requirement
        />
      </div>
    </div>
  );
}

export default App;

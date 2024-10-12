import { useState } from "react";
import Grid from "./components/Grid";
import ControlPanel from "./components/ControlPanel";
import DataDisplay from "./components/DataDisplay";
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

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <Grid
        size={size}
        clickedLines={clickedLines}
        onClickedLinesUpdate={setClickedLines}
      />
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
    </div>
  );
}

export default App;

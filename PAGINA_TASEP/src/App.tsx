import { useState, useMemo } from "react";
import Grid from "./components/Grid";
import Button from "./components/Button";
import styles from "./App.module.css";

function App() {
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  const [intersections, setIntersections] = useState<string[]>([]);
  const [showIntersections, setShowIntersections] = useState(false);
  const [showExtremePoints, setShowExtremePoints] = useState(false);

  const handleIntersectionUpdate = (newIntersections: string[]) => {
    setIntersections(newIntersections);
  };

  const toggleIntersections = () => {
    setShowIntersections(!showIntersections);
    setShowExtremePoints(false);
  };

  const toggleExtremePoints = () => {
    setShowExtremePoints(!showExtremePoints);
    setShowIntersections(false);
  };

  const extremePoints = useMemo(() => {
    const points: string[] = [];
    clickedLines.forEach((line) => {
      const [type, index] = line.split("-");
      if (type === "row") {
        points.push(`(${index},0)`, `(${index},49)`);
      } else {
        points.push(`(0,${index})`, `(49,${index})`);
      }
    });
    return points;
  }, [clickedLines]);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>City Tasep</h1>
      <Grid
        size={50}
        onIntersectionUpdate={handleIntersectionUpdate}
        onClickedLinesUpdate={setClickedLines}
      />
      <p className={styles.instructions}>
        Scroll or press 'r' to rotate the hover effect
      </p>
      <div className={styles.buttonContainer}>
        <Button onClick={toggleIntersections}>
          {showIntersections ? "Hide Intersections" : "Show Intersections"}
        </Button>
        <Button onClick={toggleExtremePoints}>
          {showExtremePoints ? "Hide Extreme Points" : "Show Extreme Points"}
        </Button>
      </div>
      {showIntersections && intersections.length > 0 && (
        <div className={styles.dataDisplay}>
          <h2>Intersections:</h2>
          <p>{intersections.join(", ")}</p>
        </div>
      )}
      {showExtremePoints && extremePoints.length > 0 && (
        <div className={styles.dataDisplay}>
          <h2>Extreme Points:</h2>
          <p>{extremePoints.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;

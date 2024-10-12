import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./Grid.module.css";

interface GridProps {
  size: number;
  onIntersectionUpdate: (intersections: string[]) => void;
  onClickedLinesUpdate: (clickedLines: Set<string>) => void;
}

const Grid: React.FC<GridProps> = ({
  size,
  onIntersectionUpdate,
  onClickedLinesUpdate,
}) => {
  const [clickedLines, setClickedLines] = useState<Set<string>>(new Set());
  const [hoverCell, setHoverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isVerticalHover, setIsVerticalHover] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    if (hoverCell) {
      setClickedLines((prev) => {
        const newSet = new Set(prev);
        const lineKey = isVerticalHover ? `col-${col}` : `row-${row}`;
        if (newSet.has(lineKey)) {
          newSet.delete(lineKey);
        } else {
          newSet.add(lineKey);
        }
        return newSet;
      });
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    setHoverCell({ row, col });
  };

  const handleMouseLeave = () => {
    setHoverCell(null);
  };

  const toggleHoverOrientation = useCallback(() => {
    setIsVerticalHover((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "r") {
        toggleHoverOrientation();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("wheel", toggleHoverOrientation);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", toggleHoverOrientation);
    };
  }, [toggleHoverOrientation]);

  const intersections = useMemo(() => {
    const result: string[] = [];
    const rows = new Set();
    const cols = new Set();

    clickedLines.forEach((line) => {
      const [type, index] = line.split("-");
      if (type === "row") {
        rows.add(index);
      } else {
        cols.add(index);
      }
    });

    rows.forEach((row) => {
      cols.forEach((col) => {
        result.push(`(${row},${col})`);
      });
    });

    return result;
  }, [clickedLines]);

  useEffect(() => {
    onIntersectionUpdate(intersections);
  }, [intersections, onIntersectionUpdate]);

  useEffect(() => {
    onClickedLinesUpdate(clickedLines);
  }, [clickedLines, onClickedLinesUpdate]);

  return (
    <div className={styles.grid}>
      {Array.from({ length: size }, (_, row) => (
        <div key={row} className={styles.row}>
          {Array.from({ length: size }, (_, col) => (
            <div
              key={`${row}-${col}`}
              className={`${styles.cell} 
                ${
                  clickedLines.has(`row-${row}`) ||
                  clickedLines.has(`col-${col}`)
                    ? styles.clicked
                    : ""
                }
                ${
                  isVerticalHover && col === hoverCell?.col
                    ? styles.hoverVertical
                    : ""
                }
                ${
                  !isVerticalHover && row === hoverCell?.row
                    ? styles.hoverHorizontal
                    : ""
                }`}
              onClick={() => handleCellClick(row, col)}
              onMouseEnter={() => handleMouseEnter(row, col)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;

import React, { useState, useCallback } from "react";
import GridCell from "./GridCell";
import GridControls from "./GridControls";
import styles from "./Grid.module.css";

interface GridProps {
  size: number;
  clickedLines: Set<string>;
  onClickedLinesUpdate: (clickedLines: Set<string>) => void;
}

const Grid: React.FC<GridProps> = ({
  size,
  clickedLines,
  onClickedLinesUpdate,
}) => {
  const [hoverCell, setHoverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isVerticalHover, setIsVerticalHover] = useState(false);
  const [isGridSelected, setIsGridSelected] = useState(false);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (hoverCell) {
        onClickedLinesUpdate((prev) => {
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
    },
    [hoverCell, isVerticalHover, onClickedLinesUpdate]
  );

  const toggleHoverOrientation = useCallback(() => {
    setIsVerticalHover((prev) => !prev);
  }, []);

  const handleGridMouseEnter = () => setIsGridSelected(true);
  const handleGridMouseLeave = () => setIsGridSelected(false);

  return (
    <div
      onMouseEnter={handleGridMouseEnter}
      onMouseLeave={handleGridMouseLeave}
      className={styles.gridContainer}
    >
      <GridControls
        onToggleHoverOrientation={toggleHoverOrientation}
        isGridSelected={isGridSelected}
      />
      <div className={styles.grid}>
        {Array.from({ length: size }, (_, index) => {
          const row = size - 1 - index;
          return (
            <div key={row} className={styles.row}>
              {Array.from({ length: size }, (_, col) => (
                <GridCell
                  key={`${row}-${col}`}
                  row={row}
                  col={col}
                  isClicked={
                    clickedLines.has(`row-${row}`) ||
                    clickedLines.has(`col-${col}`)
                  }
                  isHovered={
                    isVerticalHover
                      ? col === hoverCell?.col
                      : row === hoverCell?.row
                  }
                  isVerticalHover={isVerticalHover}
                  onClick={handleCellClick}
                  onMouseEnter={(cell) => setHoverCell({ ...cell, row: row })}
                  onMouseLeave={() => setHoverCell(null)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;

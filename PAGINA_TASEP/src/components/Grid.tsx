import React, { useState, useCallback } from "react";
import GridCell from "./GridCell";
import GridControls from "./GridControls";
import StartButton from "./StartButton.tsx";
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
  const [isActive, setIsActive] = useState(false);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (hoverCell && !isActive) {
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
    [hoverCell, isVerticalHover, onClickedLinesUpdate, isActive]
  );

  const toggleHoverOrientation = useCallback(() => {
    if (!isActive) {
      setIsVerticalHover((prev) => !prev);
    }
  }, [isActive]);

  const handleGridMouseEnter = () => setIsGridSelected(true);
  const handleGridMouseLeave = () => setIsGridSelected(false);

  const toggleActive = () => setIsActive((prev) => !prev);

  return (
    <div className={styles.gridContainer}>
      <StartButton onClick={toggleActive} isActive={isActive} />
      <div
        onMouseEnter={handleGridMouseEnter}
        onMouseLeave={handleGridMouseLeave}
        className={styles.gridWrapper}
      >
        <GridControls
          onToggleHoverOrientation={toggleHoverOrientation}
          isGridSelected={isGridSelected && !isActive}
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
                      !isActive &&
                      (isVerticalHover
                        ? col === hoverCell?.col
                        : row === hoverCell?.row)
                    }
                    isVerticalHover={isVerticalHover}
                    onClick={handleCellClick}
                    onMouseEnter={(cell) =>
                      !isActive && setHoverCell({ ...cell, row: row })
                    }
                    onMouseLeave={() => !isActive && setHoverCell(null)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Grid;

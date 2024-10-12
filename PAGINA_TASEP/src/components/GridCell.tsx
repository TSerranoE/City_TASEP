import React from "react";
import styles from "./Grid.module.css";

interface GridCellProps {
  row: number;
  col: number;
  isClicked: boolean;
  isHovered: boolean;
  isVerticalHover: boolean;
  onClick: (row: number, col: number) => void;
  onMouseEnter: (cell: { row: number; col: number }) => void;
  onMouseLeave: () => void;
}

const GridCell: React.FC<GridCellProps> = ({
  row,
  col,
  isClicked,
  isHovered,
  isVerticalHover,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`${styles.cell} 
        ${isClicked ? styles.clicked : ""}
        ${
          isHovered
            ? isVerticalHover
              ? styles.hoverVertical
              : styles.hoverHorizontal
            : ""
        }`}
      onClick={() => onClick(row, col)}
      onMouseEnter={() => onMouseEnter({ row, col })}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default React.memo(GridCell);

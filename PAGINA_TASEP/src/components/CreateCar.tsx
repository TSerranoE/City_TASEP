import React from "react";
import styles from "./CreateCar.module.css";

interface CreateCarProps {
  row: number;
  col: number;
  cellSize: number;
}

const CreateCar: React.FC<CreateCarProps> = ({ row, col, cellSize }) => {
  const style = {
    top: `${row * cellSize}px`,
    left: `${col * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
  };

  return (
    <div className={styles.carContainer} style={style}>
      <img
        src="../public/auto_azul.svg"
        alt="Car"
        className={styles.carImage}
      />
    </div>
  );
};

export default CreateCar;

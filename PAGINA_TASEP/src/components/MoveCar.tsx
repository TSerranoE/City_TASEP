import React, { useEffect } from "react";

interface MoveCarProps {
  id: string;
  newPosition: { col: number; row: number };
  gridSize: number;
}

const MoveCar: React.FC<MoveCarProps> = ({ id, newPosition, gridSize }) => {
  useEffect(() => {
    const carElement = document.getElementById(id);
    if (carElement) {
      carElement.style.left = `${newPosition.col * 15}px`;
      carElement.style.bottom = `${newPosition.row * 15}px`;
    }
  }, [id, newPosition, gridSize]);

  return null; // This component doesn't render anything, it just updates the position
};

export default MoveCar;

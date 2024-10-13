import React, { useEffect, useRef, useState } from "react";
import styles from "./CreateCar.module.css";

export const carImages = {
  blue: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto_azul-6KiJrNfUPFRBXSmVCIfljIlCGgOBCl.svg",
  green:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto_verde-AONDxkKbWMbXgDVZouwSWV7ZwijT4S.svg",
  red: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto_rojo-bEJfX0tF6DEXWw6B4iFs3CFahCByuy.svg",
  black:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto_negro-UTgfP2kBjRLTomLPirYnkPLRqBvmnv.svg",
  yellow:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auto_amarillo-oKMZbZLwU5zQTS9ycZWjQsV2zVCZnf.svg",
};

interface CreateCarProps {
  position: { col: number; row: number };
  color: string;
  id: string;
  gridSize: number;
}

const CreateCar: React.FC<CreateCarProps> = ({
  position,
  color,
  id,
  gridSize,
}) => {
  const carRef = useRef<HTMLDivElement>(null);
  const [prevPosition, setPrevPosition] = useState(position);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (carRef.current) {
      carRef.current.style.transition =
        "left 0.5s ease-in-out, bottom 0.5s ease-in-out, transform 0.5s ease-in-out";
      carRef.current.style.left = `${position.col * 15}px`;
      carRef.current.style.bottom = `${(gridSize - 1 - position.row) * 15}px`;

      const dx = position.col - prevPosition.col;
      const dy = position.row - prevPosition.row;
      console.log(dx, dy);
      let newRotation = rotation;

      if (dx === 1 && dy === 0) newRotation = 0;
      else if (dx === -1 && dy === 0) newRotation = -180;
      else if (dx === 0 && dy === 1) newRotation = -270;
      else if (dx === 0 && dy === -1) newRotation = -90;

      // Calculate the shortest rotation
      let rotationDiff = newRotation - rotation;
      if (rotationDiff > 180) rotationDiff -= 360;
      if (rotationDiff < -180) rotationDiff += 360;

      setRotation(rotation + rotationDiff);
      carRef.current.style.transform = `rotate(${rotation + rotationDiff}deg)`;

      setPrevPosition(position);
    }
  }, [position]);

  return (
    <div ref={carRef} className={styles.car} id={id}>
      <img
        src={carImages[color as keyof typeof carImages]}
        alt={`${color} Car`}
        className={styles.carImage}
      />
    </div>
  );
};

export default CreateCar;

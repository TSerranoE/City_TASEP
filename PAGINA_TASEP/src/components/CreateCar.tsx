import React, { useEffect } from "react";
import styles from "./CreateCar.module.css";

const carImages = {
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
  color: keyof typeof carImages;
  id: string;
  gridSize: number;
}

const CreateCar: React.FC<CreateCarProps> = ({ position, color, id }) => {
  useEffect(() => {
    console.log(
      `Car rendered - ID: ${id}, Row: ${position.row}, Column: ${position.col}, Color: ${color}`
    );
  }, [id, position, color]);

  return (
    <div
      className={styles.car}
      style={{
        left: `${position.col * 15}px`,
        bottom: `${position.row * 15}px`,
      }}
    >
      <img
        src={carImages[color]}
        alt={`${color} Car`}
        className={styles.carImage}
      />
    </div>
  );
};

export default CreateCar;

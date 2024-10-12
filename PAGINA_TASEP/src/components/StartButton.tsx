import React from "react";
import styles from "./StartButton.module.css";

interface StartButtonProps {
  onClick: () => void;
  isActive: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, isActive }) => {
  return (
    <button
      className={`${styles.startButton} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {isActive ? "Stop" : "Start"}
    </button>
  );
};

export default StartButton;

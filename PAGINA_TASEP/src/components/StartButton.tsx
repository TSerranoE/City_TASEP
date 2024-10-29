import React from "react";
import styles from "./StartButton.module.css";

interface StartButtonProps {
  onClick: () => void;
  isStart: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, isStart }) => {
  return (
    <button
      className={`${styles.startButton} ${isStart ? styles.active : ""}`}
      onClick={onClick}
    >
      {isStart ? "Stop" : "Start"}
    </button>
  );
};

export default StartButton;

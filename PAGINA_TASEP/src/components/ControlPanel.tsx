import React from "react";
import Button from "./Button";

interface ControlPanelProps {
  showIntersections: boolean;
  showExtremePoints: boolean;
  onToggleIntersections: () => void;
  onToggleExtremePoints: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  showIntersections,
  showExtremePoints,
  onToggleIntersections,
  onToggleExtremePoints,
}) => {
  return (
    <div>
      <Button onClick={onToggleIntersections}>
        {showIntersections ? "Hide Intersections" : "Show Intersections"}
      </Button>
      <Button onClick={onToggleExtremePoints}>
        {showExtremePoints ? "Hide Extreme Points" : "Show Extreme Points"}
      </Button>
    </div>
  );
};

export default ControlPanel;

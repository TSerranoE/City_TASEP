import React from "react";
import { Html } from "@react-three/drei";
import { CityGrid } from "../../CityGrid";
import { GridOverlayProps } from "../types";

export const GridOverlay: React.FC<GridOverlayProps> = ({
  position,
  rotation,
  scale,
  size,
  clickedLines,
  onClickedLinesUpdate,
  isStart,
  isClear,
  setIsClear,
  simulationMode,
}) => {
  return (
    <Html
      transform
      position={position}
      rotation={rotation}
      scale={scale}
      occlude="blending"
    >
      <div style={{ width: "2048px", height: "2048px" }}>
        <CityGrid
          size={size}
          clickedLines={clickedLines}
          onClickedLinesUpdate={onClickedLinesUpdate}
          isStart={isStart}
          isClear={isClear}
          setIsClear={setIsClear}
          simulationMode={simulationMode}
        />
      </div>
    </Html>
  );
};

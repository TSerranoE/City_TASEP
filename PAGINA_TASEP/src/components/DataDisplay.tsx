import React from "react";

interface DataDisplayProps {
  showIntersections: boolean;
  showExtremePoints: boolean;
  intersections: string[];
  extremePoints: string[];
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  showIntersections,
  showExtremePoints,
  intersections,
  extremePoints,
}) => {
  return (
    <>
      {showIntersections && intersections.length > 0 && (
        <div>
          <h2>Intersections:</h2>
          <p>{intersections.join(", ")}</p>
        </div>
      )}
      {showExtremePoints && extremePoints.length > 0 && (
        <div>
          <h2>Extreme Points:</h2>
          <p>{extremePoints.join(", ")}</p>
        </div>
      )}
    </>
  );
};

export default DataDisplay;

import { useEffect, useCallback } from "react";

interface GridControlsProps {
  onToggleHoverOrientation: () => void;
  isGridSelected: boolean;
}

export default function GridControls({
  onToggleHoverOrientation,
  isGridSelected,
}: GridControlsProps) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "r") {
        onToggleHoverOrientation();
      }
    },
    [onToggleHoverOrientation]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      onToggleHoverOrientation();
    },
    [onToggleHoverOrientation]
  );

  useEffect(() => {
    if (isGridSelected) {
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isGridSelected, handleKeyPress, handleWheel]);

  return null; // This component doesn't render anything visible
}

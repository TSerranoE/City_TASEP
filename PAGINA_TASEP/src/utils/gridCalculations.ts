export const calculateIntersections = (clickedLines: Set<string>): string[] => {
  const result: string[] = [];
  const rows = new Set();
  const cols = new Set();

  clickedLines.forEach((line) => {
    const [type, index] = line.split("-");
    if (type === "row") {
      rows.add(index);
    } else {
      cols.add(index);
    }
  });

  rows.forEach((row) => {
    cols.forEach((col) => {
      result.push(`(${row},${col})`);
    });
  });

  return result;
};

export const calculateExtremePoints = (
  clickedLines: Set<string>,
  size: number
): string[] => {
  const points: string[] = [];
  const maxIndex = size - 1;

  clickedLines.forEach((line) => {
    const [type, index] = line.split("-");
    if (type === "row") {
      points.push(`(fila,(0,${index}),(${maxIndex},${index}))`);
    } else {
      points.push(`(columna,(${index},0),(${index},${maxIndex}))`);
    }
  });
  return points;
};

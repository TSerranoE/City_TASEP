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
      result.push(`(${col}, ${row})`);
    });
  });

  return result;
};

export const calculateRowAndCols = (
  clickedLines: Set<string>
): { rowAndCols: string[]; calles: string[] } => {
  const calles: string[] = [];
  const rowAndCols: string[] = [];

  clickedLines.forEach((line) => {
    const [type, index] = line.split("-");
    if (type === "row") {
      calles.push(`0;${index}`);
      rowAndCols.push(`row ${index}`);
    } else {
      calles.push(`1:${index}`);
      rowAndCols.push(`col ${index}`);
    }
  });

  return { rowAndCols, calles };
};

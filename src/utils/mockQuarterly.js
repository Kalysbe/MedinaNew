const createMockRow = (index, columnCount = 28) => {
  const row = {};
  row.id = `row_${index + 1}`;
  row.shareholder = `Акционер ${index + 1}`;
  row.account = `ACC-${String(1000 + index)}`;
  row.region = index % 2 === 0 ? "Алматы" : "Нур-Султан";
  row.total = Math.floor(Math.random() * 100000) + 1000;

  for (let i = 1; i <= columnCount; i += 1) {
    row[`column_${String(i).padStart(2, "0")}`] = Math.floor(
      Math.random() * 5000
    );
  }

  return row;
};

export const generateMockQuarterlyData = (count = 100, columnCount = 28) => {
  return Array.from({ length: count }, (_, index) =>
    createMockRow(index, columnCount)
  );
};







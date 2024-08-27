window.formatNumber = function (number) {
  if (number === null || number < 0 || isNaN(number)) {
    return "0";
  }
  return Number(number).toLocaleString();
};

window.formatDate = function (dateString) {
  // Проверка, может ли строка быть преобразована в дату
  if (isNaN(Date.parse(dateString))) {
    return dateString // Возвращаем строку, если это не дата
  }

  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

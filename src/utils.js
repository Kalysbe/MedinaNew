window.formatNumber = function (number) {
  console.log(number)
  if (number === null || number < 0 || isNaN(number)) {
    return "0";
  }
  return Number(number).toLocaleString();
};

window.formatDate = function (dateString) {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
}

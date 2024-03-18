export default function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Month is zero-based
  return `${year}-${month}`;
}

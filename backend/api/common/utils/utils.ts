// // 日付フォーマットの関数  yyyy/mm/dd形式
// export function formatDate(dateString: string): string {
//   return new Date(dateString).toLocaleDateString("ja-JP", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   });
// }

// yyyy-mm-dd形式
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

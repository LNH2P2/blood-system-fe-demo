/**
 * Trả ra mảng trang để hiển thị, VD:
 * total = 9, current = 5  →  [1, '...', 4, 5, 6, '...', 9]
 */
const getPageList = (total: number, current: number) => {
  const delta = 1 // số trang cận kề bên trái / phải
  const range: (number | string)[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  // Trang đầu
  range.push(1)

  // “…” bên trái
  if (left > 2) range.push('...')

  // Các trang ở giữa
  for (let i = left; i <= right; i++) range.push(i)

  // “…” bên phải
  if (right < total - 1) range.push('...')

  // Trang cuối
  if (total > 1) range.push(total)

  return range
}

export default getPageList

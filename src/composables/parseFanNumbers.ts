export default function (num: number) {
  if (num >= 1e8)
    return `${(num / 1e8).toFixed(2)}亿`

  if (num >= 10000)
    return `${(num / 10000).toFixed(1)}万`

  return `${num}`
}

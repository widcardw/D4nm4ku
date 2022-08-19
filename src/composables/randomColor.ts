function hslToRgb(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)].map(Math.round)
}

function randomColor() {
  const colorAngle = Math.floor(Math.random() * 360)

  const [r, g, b] = hslToRgb(colorAngle, 60, 50)

  return `rgb(${r}, ${g}, ${b})`
}

function rgbToHex(r: number, g: number, b: number) {
  let res = '#'
  res += (r < 16 ? '0' : '') + r.toString(16)
  res += (g < 16 ? '0' : '') + g.toString(16)
  res += (b < 16 ? '0' : '') + b.toString(16)
  return res
}

function randomColorPair() {
  const colorAngle = Math.floor(Math.random() * 280 + 80)

  const [r1, g1, b1] = hslToRgb(colorAngle, 60, 90)
  const topColor = rgbToHex(r1, g1, b1)
  const [r2, g2, b2] = hslToRgb(colorAngle, 70, 30)
  const bottomColor = rgbToHex(r2, g2, b2)
  return [topColor, bottomColor]
}

function rgbAppendAlpha(color: string) {
  return color.replace(/^(rgb)\((\d+, \d+, \d+)\)$/, (match, p1, p2) => `${p1}a(${p2}, 0.5)`)
}

function getLightnessFromHex(hex: string) {
  const [r, g, b] = hex.replace(/^#/, '').match(/../g)!.map(n => parseInt(n, 16))
  return (r * 299 + g * 587 + b * 114) / 1000
}

function getLightnessFromRgb(rgb: string) {
  const [r, g, b] = rgb.match(/\d+/g)!.map(n => parseInt(n, 10))
  return (r * 299 + g * 587 + b * 114) / 1000
}

const LIGHTNESS_LIMIT = 120

export default randomColor

export {
  rgbAppendAlpha,
  getLightnessFromHex,
  getLightnessFromRgb,
  randomColorPair,
  LIGHTNESS_LIMIT,
}

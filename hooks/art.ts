// The gold critter riding its cloud across a strip of night sky, as pixel-art
// SVG. The strip fills whatever width it is given and is 64px tall; one
// sprite pixel is 4 CSS pixels. Positions across the strip are percentages,
// and the flight uses `transform-box: view-box` so 100% is the strip's width.

type Rect = readonly [x: number, y: number, w: number, h: number]

const PX = 4
const HEIGHT = 64

const GOLD = '#E8AE2C'
const GOLD_LIGHT = '#FFE28A'
const GOLD_DARK = '#A8730F'
const EYE = '#2A1A08'
const CLOUD = '#F7F9FC'
const CLOUD_SHADE = '#D3DCE8'
const CLOUD_LINE = '#9AABC2'

// The rider sprite, 40 by 16 pixels.
const BODY: Rect[] = [[15, 2, 10, 6]]
const ARM_LEFT: Rect[] = [[13, 4, 2, 2]]
const ARM_RIGHT: Rect[] = [[25, 4, 2, 2]]
const EYES: Rect[] = [[17, 3, 1, 2], [22, 3, 1, 2]]
const LEGS: Rect[] = [[16, 8, 1, 1], [18, 8, 1, 1], [21, 8, 1, 1], [23, 8, 1, 1]]
const CLOUD_PARTS: Rect[] = [
  [13, 9, 6, 1],
  [21, 9, 6, 1],
  [11, 10, 18, 1],
  [9, 11, 22, 2],
  [12, 13, 16, 1],
]
const RIDER_W = 40 * PX

const rects = (list: readonly Rect[], fill?: string) =>
  list
    .map(
      ([x, y, w, h]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}"${fill ? ` fill="${fill}"` : ''}/>`,
    )
    .join('')

const grown = (list: readonly Rect[]): Rect[] =>
  list.map(([x, y, w, h]) => [x - 1, y - 1, w + 2, h + 2])

// A small seeded generator, so the sky is the same on every draw and the
// drawing only changes when the rider's mood does.
const seeded = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const STAR_SHAPES: Record<'dot' | 'plus' | 'big', Rect[]> = {
  dot: [[0, 0, 1, 1]],
  plus: [[1, 0, 1, 3], [0, 1, 3, 1]],
  big: [[2, 0, 1, 5], [0, 2, 5, 1], [1, 1, 3, 3]],
}

const stars = () => {
  const random = seeded(11)
  const count = 34
  const out: string[] = []

  for (let i = 0; i < count; i += 1) {
    const roll = random()
    const kind = roll < 0.62 ? 'dot' : roll < 0.92 ? 'plus' : 'big'
    const size = kind === 'dot' ? 1 : kind === 'plus' ? 3 : 5
    const x = ((i + 0.15 + random() * 0.7) / count) * 100
    const y = 2 + Math.floor(random() * (HEIGHT / PX - size - 3))
    const tone = `c${Math.floor(random() * 3)}`
    const timing = `t${Math.floor(random() * 6)}`

    out.push(
      `<svg x="${x.toFixed(2)}%" y="${y * PX}" width="${size * PX}" height="${size * PX}" ` +
        `viewBox="0 0 ${size} ${size}" overflow="visible">` +
        `<g class="a star ${tone} ${timing}">${rects(STAR_SHAPES[kind])}</g></svg>`,
    )
  }

  return out.join('')
}

// A crescent moon near the left end.
const MOON: Rect[] = [
  [2, 0, 3, 1],
  [1, 1, 2, 1],
  [0, 2, 2, 3],
  [1, 5, 2, 1],
  [2, 6, 3, 1],
]

const moon = () =>
  `<svg x="1%" y="${2 * PX}" width="${6 * PX}" height="${7 * PX}" viewBox="0 0 6 7">` +
  `<g class="moon">${rects(MOON)}</g></svg>`

// Now and then a shooting star crosses the sky.
const shootingStar = () =>
  `<g class="shoot"><svg x="28%" y="${PX}" width="${8 * PX}" height="${4 * PX}" viewBox="0 0 8 4" overflow="visible">` +
  rects([[7, 3, 1, 1]], '#FFF8DC') +
  `<g class="tail">${rects([[5, 2, 2, 1], [3, 1, 2, 1], [0, 0, 3, 1]])}</g>` +
  `</svg></g>`

// Gold dust the rider leaves behind it.
const TRAIL: readonly (readonly [x: number, y: number])[] = [
  [7, 7],
  [5, 10],
  [8, 12],
  [4, 8],
]

const rider = () =>
  `<svg width="${RIDER_W}" height="${HEIGHT}" viewBox="0 0 40 16" overflow="visible">` +
  `<defs><clipPath id="goldBody">${rects([...BODY, ...ARM_LEFT, ...ARM_RIGHT])}</clipPath></defs>` +
  `<g class="bob">` +
  TRAIL.map(
    ([x, y], i) => `<g class="dust d${i}">${rects([[x, y, 1, 1]], i % 2 ? GOLD_LIGHT : GOLD)}</g>`,
  ).join('') +
  `<g class="wind">${rects([[3, 10, 4, 1]])}</g>` +
  `<g class="wind w1">${rects([[1, 12, 3, 1]])}</g>` +
  rects(grown(CLOUD_PARTS), CLOUD_LINE) +
  rects(CLOUD_PARTS, CLOUD) +
  rects([[10, 12, 20, 1], [12, 13, 16, 1]], CLOUD_SHADE) +
  rects([[14, 10, 3, 1], [22, 10, 2, 1]], '#FFFFFF') +
  rects(LEGS, GOLD_DARK) +
  `<g class="armL">${rects(ARM_LEFT, GOLD)}</g>` +
  `<g class="armR">${rects(ARM_RIGHT, GOLD)}</g>` +
  rects(BODY, GOLD) +
  rects([[15, 2, 10, 1], [16, 3, 1, 1]], GOLD_LIGHT) +
  rects([[15, 7, 10, 1]], GOLD_DARK) +
  `<g class="a eyes">${rects(EYES, EYE)}</g>` +
  `<g clip-path="url(#goldBody)"><polygon class="shine" points="11,0 13,0 9,10 7,10" fill="#FFF8D6" opacity="0.8"/></g>` +
  `</g></svg>`

const timings = [
  [3.1, 0.4],
  [4.3, 1.9],
  [5.2, 3.3],
  [3.7, 2.6],
  [6.1, 0.9],
  [4.8, 4.1],
]
  .map(([d, delay], i) => `.t${i} { animation-duration: ${d}s; animation-delay: -${delay}s; }`)
  .join('\n')

const STYLE = `
.a { transform-box: fill-box; transform-origin: center; }
.c0 { fill: #F2C94C; } .c1 { fill: #FFF1C4; } .c2 { fill: #B9CCF5; }
.moon { fill: #FFF1C4; }
.wind { fill: #A9BED8; opacity: 0.5; animation: gust 2.2s linear infinite; }
.w1 { animation-delay: -1.1s; }
.tail { fill: #FFF1C4; opacity: 0.6; }
@media (prefers-color-scheme: light) {
  .c0 { fill: #C8901A; } .c1 { fill: #D9A930; } .c2 { fill: #7E9BD0; }
  .moon { fill: #D9A930; } .tail { fill: #D9A930; }
}
.star { animation: twinkle 4s ease-in-out infinite; }
${timings}
.fly {
  transform-box: view-box;
  transform: translateX(calc(100% - ${RIDER_W + 12}px));
  animation: cross 38s ease-in-out infinite alternate;
}
.face { transform-origin: ${RIDER_W / 2}px ${HEIGHT / 2}px; animation: face 76s linear infinite; }
.bob { animation: bob 2.4s infinite; }
.armL { animation: wave 1.6s infinite; }
.armR { animation: wave 1.6s infinite; animation-delay: -0.8s; }
.eyes { animation: blink 4.6s infinite; }
.shine { animation: shine 4s ease-in infinite; }
.dust { opacity: 0; animation: dust 1.6s linear infinite; }
.d1 { animation-delay: -0.4s; } .d2 { animation-delay: -0.8s; } .d3 { animation-delay: -1.2s; }
.shoot { transform-box: view-box; opacity: 0; animation: shoot 17s ease-out infinite; animation-delay: 5s; }
.working .fly { animation-duration: 14s; }
.working .face { animation-duration: 28s; }
.working .bob { animation-duration: 1.1s; }
.working .wind { opacity: 1; animation-duration: 0.9s; }
.working .dust { animation-duration: 0.8s; }
@keyframes cross {
  from { transform: translateX(28px); }
  to { transform: translateX(calc(100% - ${RIDER_W + 12}px)); }
}
@keyframes face { 0%, 49.99% { transform: scaleX(1); } 50%, 100% { transform: scaleX(-1); } }
@keyframes bob { 0%, 50% { transform: translateY(0); } 50.01%, 100% { transform: translateY(-1px); } }
@keyframes wave { 0%, 50% { transform: translateY(0); } 50.01%, 100% { transform: translateY(-1px); } }
@keyframes blink { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.2); } }
@keyframes shine { 0% { transform: translateX(0); } 30%, 100% { transform: translateX(22px); } }
@keyframes twinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
@keyframes gust { from { transform: translateX(0); opacity: 0.9; } to { transform: translateX(-6px); opacity: 0; } }
@keyframes dust { from { transform: translate(0, 0); opacity: 1; } to { transform: translate(-7px, 2px); opacity: 0; } }
@keyframes shoot {
  0% { transform: translate(0, 0); opacity: 0; }
  1% { opacity: 1; }
  7% { transform: translate(22%, 20px); opacity: 0; }
  100% { transform: translate(22%, 20px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .star, .fly, .face, .bob, .armL, .armR, .eyes, .shine, .wind, .dust, .shoot { animation: none; }
  .star { opacity: 0.8; } .wind { opacity: 0.6; }
}
`

/** The whole strip: sky, moon, stars and the rider, idle or flying faster while a turn runs. */
export const skySvg = (isWorking: boolean): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${HEIGHT}" ` +
  `shape-rendering="crispEdges" class="${isWorking ? 'working' : 'idle'}">` +
  `<title>The gold rider on its cloud ride, across the stars</title>` +
  `<style>${STYLE}</style>` +
  moon() +
  stars() +
  shootingStar() +
  `<g class="fly"><g class="face">${rider()}</g></g>` +
  `</svg>`

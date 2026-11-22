# Gold Cloud Rider

A Claude Code mod that puts a little gold pixel critter on a cloud in the row just above your message box. It floats back and forth across a strip of night sky, turning around at each end, past twinkling stars, a crescent moon and the occasional shooting star, leaving a trail of gold dust behind it.

- It bobs, waves its arms, blinks, and a glint sweeps across the gold every few seconds.
- While Claude is working it flies faster, with wind streaks behind the cloud.
- The strip stretches to the width of the box, and the stars turn a deeper gold in light mode.
- If your system asks for reduced motion, the scene holds still with the rider resting on the right.

It draws in the Claude desktop app, VS Code and the mobile app. The terminal doesn't draw pictures, so nothing shows there. It adds its own critter and leaves the app's built-in mascot as it is.

## Install

At the prompt of a terminal session:

```
/plugin install gold-cloud-rider --marketplace r0yb0t1th3s3/gold-cloud-rider
```

Answer `y` to add the marketplace, then press Enter to pick the user scope.

From a shell:

```
claude plugin install gold-cloud-rider --marketplace r0yb0t1th3s3/gold-cloud-rider
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `r0yb0t1th3s3/gold-cloud-rider`, then **Add plugin**.

A mod installed from a terminal at the user scope also loads in the desktop app's local sessions.

## How it works

`hooks/register.tsx` draws one row above the prompt (`ui.render` on `AbovePrompt`) holding a single SVG. `hooks/art.ts` builds that SVG: pixel art made of rectangles, animated with CSS only, with no scripts or images.

## License

MIT

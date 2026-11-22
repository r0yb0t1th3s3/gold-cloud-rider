import type { Register } from 'claude-code'

import { skySvg } from './art'

// The app's own mascot can't be recolored by a mod (its colors are baked into
// its animation files), so this draws a gold one of its own in the row just
// above the message box, doing the action the app almost never shows: riding
// a cloud. It floats back and forth across a strip of stars, faster and with
// wind streaks while Claude is working.
export const register: Register = on => {
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    if (e.surface === 'terminal' || e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Svg } = $.ui.resolve(e)

    // The desktop caps a drawing at the width it has, so asking for the most
    // it allows makes the strip as wide as the box.
    return (
      <Box flexDirection="column">
        <Svg
          source={skySvg(e.props.isWorking)}
          alt="A gold pixel critter riding a cloud back and forth across the stars"
          width={4096}
          height={64}
          isInteractive
        />
      </Box>
    )
  })
}

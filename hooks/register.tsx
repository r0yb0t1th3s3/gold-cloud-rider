import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { skySvg } from './art'

// The app's own mascot can't be recolored by a mod (its colors are baked into
// its animation files), so this draws a gold one of its own in the row just
// above the message box, doing the action the app almost never shows: riding
// a cloud. It floats back and forth across a strip of stars, faster and with
// wind streaks while Claude is working. /rider hides or shows it.

const isHidden = atom({ plugin: 'gold-cloud-rider', key: 'isHidden' } as const, false)

// The choice is also kept in the mod's store, so it holds in new sessions.
const SAVED = 'isHidden'

const HIDE_WORDS = ['hide', 'off']
const SHOW_WORDS = ['show', 'on']

/** What `/rider <args>` asks for: hidden or shown, or undefined for a word it doesn't know. */
const wanted = (args: string, hiddenNow: boolean): boolean | undefined => {
  const word = args.trim().toLowerCase()

  if (word === '') {
    return !hiddenNow
  }

  if (HIDE_WORDS.includes(word)) {
    return true
  }

  if (SHOW_WORDS.includes(word)) {
    return false
  }

  return undefined
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'rider',
      description: 'Hide or show the gold cloud rider above the message box',
      argumentHint: '[show|hide]',
      immediate: true,
    })

    const saved = await $.store.get(SAVED)

    if (typeof saved === 'boolean') {
      await update($, isHidden, () => saved)
    }

    return next(e)
  })

  on('command.run', { command: 'rider' }, async ($, e) => {
    const next = wanted(e.args, await read($, isHidden))

    if (next === undefined) {
      return {
        text: 'Type /rider to hide or show the gold rider, or /rider hide and /rider show.',
        isTextDisplayOnly: true,
      }
    }

    await update($, isHidden, () => next)
    await $.store.set(SAVED, next)

    return {
      text: next
        ? 'The gold rider is hidden. Type /rider to bring it back.'
        : 'The gold rider is back above the message box.',
      isTextDisplayOnly: true,
    }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.surface === 'terminal' || e.props.hasSurvey || (await read($, isHidden))) {
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

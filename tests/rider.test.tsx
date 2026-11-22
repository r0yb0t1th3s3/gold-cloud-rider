import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'

const band = (over: { hasSurvey?: boolean; isWorking?: boolean } = {}) => ({
  hasSurvey: false,
  isCollapsed: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns: 80,
  scroll: { offset: 0, bodyRows: 9 },
  view: {},
  ...over,
})

/** Runs `/rider <args>` as the person typing it at the prompt would. */
const rider = ($: Engine, args = '') =>
  $.command.run({
    command: 'rider',
    args,
    origin: { kind: 'composer' },
    presentation: { isFullscreen: false, columns: 80 },
  })

/** Whether the strip is drawn on the desktop right now. */
const isDrawn = async ($: Engine) => {
  const ui = await $.ui.mount({
    plugin: 'gold-cloud-rider',
    surface: 'desktop',
    component: 'AbovePrompt',
    props: band(),
  })
  const svg = await ui.find({ type: 'Svg' })
  await ui.unmount()

  return svg !== undefined
}

test('the gold rider draws above the prompt on every surface with Svg', async $ => {
  for (const surface of ['desktop', 'vscode', 'mobile'] as const) {
    for (const isWorking of [false, true]) {
      const ui = await $.ui.mount({
        plugin: 'gold-cloud-rider',
        surface,
        component: 'AbovePrompt',
        props: band({ isWorking }),
      })

      await ui.drawn()
      expect(await ui.find({ type: 'Svg' })).toBeDefined()
      await ui.unmount()
    }
  }
})

test('it steps aside for a survey and on the terminal', async $ => {
  const survey = await $.ui.mount({
    plugin: 'gold-cloud-rider',
    surface: 'desktop',
    component: 'AbovePrompt',
    props: band({ hasSurvey: true }),
  })
  expect(await survey.find({ type: 'Svg' })).toBeUndefined()
  await survey.unmount()

  const terminal = await $.ui.mount({
    plugin: 'gold-cloud-rider',
    surface: 'terminal',
    component: 'AbovePrompt',
    props: band(),
  })
  expect(await terminal.find({ type: 'Text', text: /./ })).toBeUndefined()
  await terminal.unmount()
})

test('/rider toggles the strip, and show and hide set it', async ($, on) => {
  mock.store(on)

  expect(await isDrawn($)).toBe(true)

  const hidden = await rider($)
  expect(hidden.text).toMatch(/hidden/)
  expect(await isDrawn($)).toBe(false)

  await rider($)
  expect(await isDrawn($)).toBe(true)

  await rider($, 'hide')
  await rider($, 'hide')
  expect(await isDrawn($)).toBe(false)

  await rider($, ' Show ')
  expect(await isDrawn($)).toBe(true)
})

test('/rider with a word it does not know changes nothing', async ($, on) => {
  mock.store(on)

  const answer = await rider($, 'dance')
  expect(answer.text).toMatch(/\/rider hide/)
  expect(await isDrawn($)).toBe(true)
})

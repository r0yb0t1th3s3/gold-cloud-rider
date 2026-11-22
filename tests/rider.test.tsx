import { expect, test } from 'claude-code/testing'

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

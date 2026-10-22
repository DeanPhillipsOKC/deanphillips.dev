// Card 6, Excessive Agency. The fixes are drawn onto the same diagram, and the poisoned issue runs
// again at the end to show it getting stopped.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 8,
  script: [
    [0.7, '[casual] Excessive agency means giving an agent more power than its job needs.'],
    [0.35, 'Say one token lets it read issues, merge code, and change settings.'],
    [0.45, '[curious] A poisoned issue tells it to turn off the required checks.'],
    [0.3, 'It can, so it does.'],
    [0.7, "[calm] Telling it to behave won't stop that. A prompt is only a request."],
    [0.35, "So take away the tools it doesn't need."],
    [0.3, 'Check permissions in code, before anything merges.'],
    [0.3, 'And let a person approve anything risky.'],
    [0.5, 'Now the same issue goes nowhere.'],
    [0.6, '[warm] Try the quick check on this card.'],
  ],
  config: {
    layout: 'access',
    tag: ['LLM06', 'Excessive agency'],
    top: { glyph: 'doc', label: 'A poisoned issue', color: '#9aa6b6', bubble: 'turn off the checks' },
    modelLabel: 'The agent',
    items: [
      { glyph: 'doc', label: ['Read', 'issues'] },
      { glyph: 'merge', label: ['Merge', 'code'] },
      { glyph: 'sliders', label: ['Change', 'settings'] },
    ],
    hit: [2],
    hitDir: 'down',
    hitNote: 'checks turned off',
    fixTitle: ['The fix isn’t', 'asking it to behave'],
    oldIdea: ['"Never touch settings', 'unless it’s safe."'],
    replay: {
      fixes: [
        { do: 'cut', item: 2, at: 0.8, note: 'not given' },
        { do: 'mark', item: 1, at: 0.5, glyph: 'shield', color: '#a78bfa' },
        { do: 'mark', item: 1, at: 0.5, dx: 58, glyph: 'person', color: '#3ddc97' },
      ],
      tries: [{ item: 2, stop: 0.68 }, { item: 1, stop: 0.18 }],
      endNote: { item: 2, text: 'checks stay on' },
    },
    outro: ['Try the quick', 'check below'],
  },
};

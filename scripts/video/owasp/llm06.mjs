// Card 6, Excessive Agency.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  script: [
    [0.7, '[casual] Excessive agency, in half a minute.'],
    [0.35, 'An agent gets one token that can read issues, merge code, and change settings.'],
    [0.45, '[curious] A poisoned issue tells it to turn off the required checks.'],
    [0.3, 'It can, so it does.'],
    [0.7, "[calm] Here's the part people miss. Asking it to behave isn't the fix."],
    [0.35, 'Give it the fewest tools.'],
    [0.3, 'Check permissions in code, not in the prompt.'],
    [0.3, 'And let a person approve anything risky.'],
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
    fixes: [
      { glyph: 'key', color: '#4fd1c5', label: 'Fewest tools', sub: 'Only what the job needs' },
      { glyph: 'shield', color: '#a78bfa', label: 'Checks in code', sub: 'A prompt is a request' },
      { glyph: 'person', color: '#3ddc97', label: 'A person approves', sub: 'For anything risky' },
    ],
    outro: ['Try the quick', 'check below'],
  },
};

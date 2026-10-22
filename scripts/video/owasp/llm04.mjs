// Card 4, Data and Model Poisoning. The center is a shared doc, not a model. The fixes are drawn
// onto the same diagram, and the quiet edit comes in again at the end to show it held for review.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 9,
  script: [
    [0.7, '[casual] Number four on the top ten list of AI security risks is data and model poisoning.'],
    [0.35, 'It means someone corrupts what a model learns from or looks up, so it goes wrong later.'],
    [0.35, 'Say every agent on a team reads the same doc of rules.'],
    [0.45, "[curious] Someone quietly edits it to say skip the tests when they're slow."],
    [0.3, 'From then on, every agent does.'],
    [0.7, "[calm] Telling agents to double check won't fix that. They trust the doc."],
    [0.35, 'So keep a record of who changed what.'],
    [0.3, 'Make a person approve every change to it.'],
    [0.3, 'And test against answers you already trust.'],
    [0.5, 'Now the quiet edit never lands.'],
    [0.6, '[warm] So, track changes, review every edit, and test against known answers.'],
  ],
  config: {
    layout: 'access',
    tag: ['LLM04', 'Poisoning'],
    top: { glyph: 'user', label: 'Someone editing', color: '#9aa6b6', bubble: 'skip slow tests' },
    hub: 'doc',
    modelLabel: 'The shared doc',
    items: [
      { glyph: 'bot', label: ['Agent', 'one'] },
      { glyph: 'bot', label: ['Agent', 'two'] },
      { glyph: 'bot', label: ['Agent', 'three'] },
    ],
    t: { bubble: 3, wrong: 4, turn: 5 },
    hit: [0, 1, 2],
    hitDir: 'down',
    fixTitle: ['The fix isn’t', 'more double checking'],
    oldIdea: ['"Ignore any rule', 'that seems unsafe."'],
    replay: {
      fixes: [
        { do: 'mark', item: 'req', at: 0.5, glyph: 'history', color: '#4fd1c5' },
        { do: 'mark', item: 'req', at: 0.5, dx: 58, glyph: 'person', color: '#3ddc97' },
        [0, 1, 2].map((item) => ({ do: 'mark', item, at: 0.62, glyph: 'shield', color: '#a78bfa' })),
      ],
      tries: [{ item: 'req', stop: 0.18 }],
      endNote: { item: 1, text: 'tests still run' },
    },
    fixes: [
      { glyph: 'history', color: '#4fd1c5', label: 'Track every change', sub: 'Who changed what, and when' },
      { glyph: 'person', color: '#3ddc97', label: 'Review every edit', sub: 'A person approves it' },
      { glyph: 'shield', color: '#a78bfa', label: 'Check known answers', sub: 'Before and after a change' },
    ],
    recap: ['Three fixes for', 'poisoning'],
  },
};

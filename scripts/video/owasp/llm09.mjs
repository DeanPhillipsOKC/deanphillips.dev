// Card 9, Misinformation. The fixes are drawn onto the same diagram, and the same question comes
// in again at the end to show the made-up package checked and never installed.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 9,
  script: [
    [0.7, '[casual] Number nine on the top ten list of AI security risks is misinformation.'],
    [0.35, 'It means a model can sound sure and be wrong, and people trust it anyway.'],
    [0.35, "Say a coding assistant suggests a library that doesn't exist."],
    [0.45, '[curious] Someone notices, and publishes a real package with that name, full of bad code.'],
    [0.3, 'The next developer who asks installs it.'],
    [0.7, "[calm] Asking the model to be accurate won't fix that. It doesn't know what it doesn't know."],
    [0.35, "So check that a package is real and trusted before you install it."],
    [0.3, 'Ground answers in real sources, with links.'],
    [0.3, 'And have a person verify anything important.'],
    [0.5, 'Now the fake package never gets installed.'],
    [0.6, "[warm] So, check it's real, ground it in sources, and verify what matters."],
  ],
  config: {
    layout: 'access',
    tag: ['LLM09', 'Misinformation'],
    top: { glyph: 'user', label: 'A developer', color: '#9aa6b6', bubble: 'a library for this?' },
    modelLabel: 'The assistant',
    items: [
      { glyph: 'pkg', label: ['A real', 'package'] },
      { glyph: 'pkg', label: ['Another', 'real one'] },
      { glyph: 'pkg', label: ['A made up', 'name'] },
    ],
    t: { bubble: 2, wrong: 4, turn: 5 },
    hit: [2],
    hitDir: 'down',
    hitNote: 'attacker’s code',
    fixTitle: ['The fix isn’t', 'a more careful model'],
    oldIdea: ['"Only suggest', 'real libraries."'],
    replay: {
      fixes: [
        { do: 'mark', item: 2, at: 0.55, glyph: 'shield', color: '#4fd1c5' },
        { do: 'mark', item: 'req', at: 0.5, glyph: 'search', color: '#a78bfa' },
        { do: 'mark', item: 'req', at: 0.5, dx: 58, glyph: 'person', color: '#3ddc97' },
      ],
      tries: [{ item: 2, stop: 0.42 }],
      endNote: { item: 2, text: 'not installed' },
    },
    fixes: [
      { glyph: 'shield', color: '#4fd1c5', label: 'Check it’s real', sub: 'Before you install it' },
      { glyph: 'search', color: '#a78bfa', label: 'Cite sources', sub: 'Answers with links' },
      { glyph: 'person', color: '#3ddc97', label: 'A person verifies', sub: 'Anything important' },
    ],
    recap: ['Three fixes for', 'misinformation'],
  },
};

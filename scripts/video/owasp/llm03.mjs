// Card 3, Supply Chain. The fixes are drawn onto the same diagram, and the bad update comes in
// again at the end to show it held at the door.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 9,
  script: [
    [0.7, '[casual] Number three on the top ten list of AI security risks is the supply chain.'],
    [0.35, 'It means the code, models, and data you depend on were made by other people, and any of them can be tampered with.'],
    [0.35, 'Say a popular package ships an update with hidden code that steals keys when it installs.'],
    [0.45, '[curious] An agent installs it the same day.'],
    [0.3, 'The install script runs, and the keys are gone.'],
    [0.7, "[calm] Trusting popular packages won't fix that. Popular packages get hijacked too."],
    [0.35, 'So wait a few days before taking an update, unless it fixes a security hole.'],
    [0.3, 'Pin exact versions, so nothing updates on its own.'],
    [0.3, 'And never let installs run their own scripts.'],
    [0.5, 'Now the bad update never gets in.'],
    [0.6, '[warm] So, wait a few days, pin your versions, and skip install scripts.'],
  ],
  config: {
    layout: 'access',
    tag: ['LLM03', 'Supply chain'],
    top: { glyph: 'pkg', label: 'A package update', color: '#9aa6b6', bubble: 'hidden code inside' },
    modelLabel: 'The agent',
    items: [
      { glyph: 'pkg', label: ['Install', 'it'] },
      { glyph: 'code', label: ['Run its', 'scripts'] },
      { glyph: 'key', label: ['Release', 'keys'] },
    ],
    t: { bubble: 2, wrong: 4, turn: 5 },
    hit: [2],
    hitDir: 'down',
    hitNote: 'keys stolen',
    fixTitle: ['The fix isn’t', 'trusting popular names'],
    oldIdea: ['"Only install packages', 'that lots of people use."'],
    replay: {
      fixes: [
        { do: 'mark', item: 'req', at: 0.5, glyph: 'clock', color: '#a78bfa' },
        { do: 'mark', item: 'req', at: 0.5, dx: 58, glyph: 'lock', color: '#4fd1c5' },
        { do: 'cut', item: 1, at: 0.7, note: 'not allowed' },
      ],
      tries: [{ item: 'req', stop: 0.18 }],
      endNote: { item: 2, text: 'keys stay safe' },
    },
    fixes: [
      { glyph: 'clock', color: '#a78bfa', label: 'Wait a few days', sub: 'Let others find it first' },
      { glyph: 'lock', color: '#4fd1c5', label: 'Pin exact versions', sub: 'Nothing updates on its own' },
      { glyph: 'code', color: '#3ddc97', label: 'No install scripts', sub: 'Nothing runs on install' },
    ],
    recap: ['Three fixes for', 'the supply chain'],
  },
};

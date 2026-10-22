// Card 5, Improper Output Handling. The fixes are drawn onto the same diagram, and the crafted
// question comes in again at the end to show the script shown as plain text.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 9,
  script: [
    [0.7, '[casual] Number five on the top ten list of AI security risks is improper output handling.'],
    [0.35, "It means what a model writes gets used without a check, so it can act like an attacker's input."],
    [0.35, "Say a chat assistant's reply goes straight into a web page."],
    [0.45, '[curious] A crafted question makes the reply include a script.'],
    [0.3, "The next visitor's browser runs it."],
    [0.7, "[calm] Asking the model to be careful won't fix that. Its output is still untrusted."],
    [0.35, 'So treat what it writes like any outside input.'],
    [0.3, 'Encode it for where it lands, a page, a database, or a shell.'],
    [0.3, 'And add a content security policy to the page.'],
    [0.5, 'Now the script never runs.'],
    [0.6, '[warm] So, treat output as untrusted, encode it, and lock down the page.'],
  ],
  config: {
    layout: 'access',
    tag: ['LLM05', 'Output handling'],
    top: { glyph: 'user', label: 'Someone asking', color: '#9aa6b6', bubble: 'a crafted question' },
    modelLabel: 'The assistant',
    items: [
      { glyph: 'page', label: ['Web', 'page'] },
      { glyph: 'db', label: ['Data', 'base'] },
      { glyph: 'term', label: ['Shell'] },
    ],
    t: { bubble: 3, wrong: 4, turn: 5 },
    hit: [0],
    hitDir: 'down',
    hitNote: 'script runs',
    fixTitle: ['The fix isn’t', 'asking it to be careful'],
    oldIdea: ['"Never put code', 'in your replies."'],
    replay: {
      fixes: [
        { do: 'mark', item: 1, at: 0.25, glyph: 'shield', color: '#a78bfa' },
        [0, 2].map((item) => ({ do: 'mark', item, at: 0.62, glyph: 'code', color: '#4fd1c5' })),
        { do: 'mark', item: 0, at: 1, dx: 54, dy: 30, glyph: 'lock', color: '#3ddc97' },
      ],
      tries: [{ item: 0, stop: 0.5 }],
      endNote: { item: 0, text: 'shown as text' },
    },
    fixes: [
      { glyph: 'shield', color: '#a78bfa', label: 'Don’t trust output', sub: 'Like any outside input' },
      { glyph: 'code', color: '#4fd1c5', label: 'Encode it', sub: 'For a page, a database, a shell' },
      { glyph: 'lock', color: '#3ddc97', label: 'Lock down the page', sub: 'A content security policy' },
    ],
    recap: ['Three fixes for', 'unsafe output'],
  },
};

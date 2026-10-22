// Card 2, Sensitive Information Disclosure. The fixes are drawn onto the same diagram, and the
// same question runs again at the end to show nothing coming back.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 9,
  script: [
    [0.7, '[casual] Number two on the top ten list of AI security risks is sensitive information disclosure.'],
    [0.35, 'It means the model, or the app around it, shows something it never should.'],
    [0.35, "Say a support bot can see every customer's details, even though it only needs one person's at a time."],
    [0.45, '[curious] Then someone asks it to list the last ten people who wrote in, with their emails.'],
    [0.3, 'It does. The data was right there.'],
    [0.7, "[calm] Telling it to keep quiet won't fix that. The data is still in reach."],
    [0.35, 'So only give it the details it needs.'],
    [0.3, 'Strip out what it should never see.'],
    [0.3, 'And check what goes out before it leaves.'],
    [0.5, 'Now the same question gets nothing back.'],
    [0.6, '[warm] So, only what it needs, nothing sensitive, and a check on the way out.'],
  ],
  config: {
    layout: 'access',
    tag: ['LLM02', 'Sensitive information'],
    top: { glyph: 'user', label: 'Someone asking', color: '#9aa6b6', bubble: 'the last ten, with emails' },
    modelLabel: 'The support bot',
    items: [
      { glyph: 'db', label: ['Ava’s', 'details'] },
      { glyph: 'db', label: ['Ben’s', 'details'] },
      { glyph: 'db', label: ['Cara’s', 'details'] },
    ],
    t: { bubble: 3, wrong: 4, turn: 5 },
    hit: [0, 1, 2],
    hitDir: 'up',
    fixTitle: ['The fix isn’t', 'telling it to keep quiet'],
    oldIdea: ['"Please never share', 'private information."'],
    replay: {
      fixes: [
        [{ do: 'cut', item: 1, at: 0.7, note: 'not given' }, { do: 'cut', item: 2, at: 0.7, note: 'not given' }],
        { do: 'mark', item: 0, at: 0.55, glyph: 'eyeoff', color: '#a78bfa' },
        { do: 'mark', item: 'req', at: 0.45, glyph: 'shield', color: '#3ddc97' },
      ],
      tries: [{ item: 0, up: true, stop: 0.3 }],
      endNote: { item: 1, text: 'no list goes out' },
    },
    fixes: [
      { glyph: 'key', color: '#4fd1c5', label: 'Only what it needs', sub: 'One person at a time' },
      { glyph: 'eyeoff', color: '#a78bfa', label: 'Remove private data', sub: 'Before it ever sees it' },
      { glyph: 'shield', color: '#3ddc97', label: 'Check what goes out', sub: 'Review before it leaves' },
    ],
    recap: ['Three fixes for', 'sensitive data'],
  },
};

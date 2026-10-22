// Card 2, Sensitive Information Disclosure.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  script: [
    [0.7, '[casual] Sensitive information disclosure, in half a minute.'],
    [0.35, "A support bot can see every customer's details, even though it only needs one person's at a time."],
    [0.45, '[curious] Then someone asks it to list the last ten people who wrote in, with their emails.'],
    [0.3, 'It does. The data was right there.'],
    [0.7, "[calm] Here's the part people miss. Telling it to keep quiet isn't the fix."],
    [0.35, 'Only give it the details it needs.'],
    [0.3, 'Strip out what it should never see.'],
    [0.3, 'And check what goes out before it leaves.'],
    [0.6, '[warm] Try the quick check on this card.'],
  ],
  config: {
    layout: 'access',
    tag: ['LLM02', 'Sensitive information'],
    top: { glyph: 'user', label: 'Someone asking', color: '#9aa6b6', bubble: 'list everyone’s emails' },
    modelLabel: 'The support bot',
    items: [
      { glyph: 'db', label: ['Ava’s', 'details'] },
      { glyph: 'db', label: ['Ben’s', 'details'] },
      { glyph: 'db', label: ['Cara’s', 'details'] },
    ],
    hit: [0, 1, 2],
    hitDir: 'up',
    fixTitle: ['The fix isn’t', 'telling it to keep quiet'],
    oldIdea: ['"Please never share', 'private information."'],
    fixes: [
      { glyph: 'key', color: '#4fd1c5', label: 'Only what it needs', sub: 'One person at a time' },
      { glyph: 'eyeoff', color: '#a78bfa', label: 'Strip the sensitive parts', sub: 'Before it ever sees them' },
      { glyph: 'shield', color: '#3ddc97', label: 'Check what goes out', sub: 'Review before it leaves' },
    ],
    outro: ['Try the quick', 'check below'],
  },
};

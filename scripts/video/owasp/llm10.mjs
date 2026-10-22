// Card 10, Unbounded Consumption.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  script: [
    [0.7, '[casual] Unbounded consumption, in half a minute.'],
    [0.35, 'A review files a follow up job. An agent builds it.'],
    [0.45, '[curious] Then its review files another. And another.'],
    [0.3, 'With no cap, the loop runs all night, and the bill grows with it.'],
    [0.7, "[calm] Here's the part people miss. Asking agents to stop isn't the fix."],
    [0.35, 'Cap how many runs can start.'],
    [0.3, 'Set time limits.'],
    [0.3, 'And alert on odd spikes.'],
    [0.6, '[warm] Try the quick check on this card.'],
  ],
  config: {
    layout: 'loop',
    tag: ['LLM10', 'Runaway use'],
    nodes: [
      { glyph: 'review', label: 'A review', color: '#a78bfa' },
      { glyph: 'doc', label: 'A new job', color: '#4fd1c5' },
      { glyph: 'agent', label: 'An agent', color: '#4fd1c5' },
    ],
    counterLabel: 'runs tonight',
    meterLabel: 'the bill',
    fixTitle: ['The fix isn’t', 'asking them to stop'],
    oldIdea: ['"Stop when you', 'have done enough."'],
    fixes: [
      { glyph: 'gauge', color: '#4fd1c5', label: 'Cap the runs', sub: 'A daily limit, set by a script' },
      { glyph: 'clock', color: '#a78bfa', label: 'Time limits', sub: 'Stale work expires' },
      { glyph: 'bell', color: '#3ddc97', label: 'Alert on spikes', sub: 'Know before the bill does' },
    ],
    outro: ['Try the quick', 'check below'],
  },
};

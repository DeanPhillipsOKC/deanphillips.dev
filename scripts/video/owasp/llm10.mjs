// Card 10, Unbounded Consumption. The fixes are drawn onto the same loop, and the loop runs again
// at the end to show it stopping at the cap.
export default {
  scene: 'scripts/video/owasp/card-scene.html',
  posterLine: 9,
  script: [
    [0.7, '[casual] Number ten on the top ten list of AI security risks is unbounded consumption.'],
    [0.35, 'It means nothing limits how much work an AI system runs, or what it costs.'],
    [0.35, 'Say a review files a follow up job, and an agent builds it.'],
    [0.45, '[curious] Then its review files another. And another.'],
    [0.3, 'With no cap, the loop runs all night, and the bill grows with it.'],
    [0.7, "[calm] Asking the agents to stop won't fix that. They can't tell when enough is enough."],
    [0.35, 'So cap how many runs can start each day.'],
    [0.3, 'Set time limits, so stale work expires.'],
    [0.3, 'And alert on odd spikes.'],
    [0.5, 'Now the loop stops at the cap.'],
    [1.4, '[warm] So, a cap, time limits, and an alert before the bill gets big.'],
  ],
  config: {
    layout: 'loop',
    tag: ['LLM10', 'Runaway use'],
    t: { ramp: 3, wrong: 4, turn: 5 },
    nodes: [
      { glyph: 'review', label: 'A review', color: '#a78bfa' },
      { glyph: 'doc', label: 'A new job', color: '#4fd1c5' },
      { glyph: 'agent', label: 'An agent', color: '#4fd1c5' },
    ],
    counterLabel: 'runs tonight',
    meterLabel: 'the bill',
    fixTitle: ['The fix isn’t', 'asking them to stop'],
    oldIdea: ['"Stop when you', 'have done enough."'],
    replay: {
      cap: 10,
      fixes: [
        { glyph: 'gauge', color: '#4fd1c5', angle: -30 },
        { glyph: 'clock', color: '#a78bfa', angle: 90 },
        { glyph: 'bell', color: '#3ddc97', x: 452, y: 568 },
      ],
      endNote: 'stopped at the cap',
    },
    fixes: [
      { glyph: 'gauge', color: '#4fd1c5', label: 'Cap the runs', sub: 'A daily limit, set by a script' },
      { glyph: 'clock', color: '#a78bfa', label: 'Time limits', sub: 'Stale work expires' },
      { glyph: 'bell', color: '#3ddc97', label: 'Alert on spikes', sub: 'Know before the bill does' },
    ],
    recap: ['Three fixes for', 'runaway use'],
  },
};

// Card 1, Prompt Injection. Its scene is drawn by hand (llm01-scene.html), not from the shared layouts.
export default {
  scene: 'scripts/video/owasp/llm01-scene.html',
  posterLine: 8,
  script: [
    [0.7, '[casual] Number one on the top ten list of AI security risks is prompt injection.'],
    [0.35, 'A model reads words. Your instructions, an email, a web page. It all arrives as plain text.'],
    [0.45, "[curious] So when an email says ignore your rules, the model can't always tell it's just data."],
    [0.3, "That's the whole attack. Outside text, trying to give orders."],
    [0.7, "[calm] A better prompt won't fix that. The model still can't tell who's talking."],
    [0.35, 'So give the model less power.'],
    [0.3, 'Keep the checks in code.'],
    [0.3, 'And let a person approve anything risky.'],
    [0.5, "Now the same email can't do any harm."],
    [0.6, '[warm] So, less power, checks in code, and a person who approves.'],
  ],
};

// Card 1, Prompt Injection. Its scene is drawn by hand (llm01-scene.html), not from the shared layouts.
export default {
  scene: 'scripts/video/owasp/llm01-scene.html',
  script: [
    [0.7, '[casual] Prompt injection, in under a minute.'],
    [0.35, 'A model reads words. Your instructions, an email, a web page. It all arrives as plain text.'],
    [0.45, "[curious] So when an email says ignore your rules, the model can't always tell it's just data."],
    [0.3, "That's the whole attack. Outside text, trying to give orders."],
    [0.7, "[calm] Here's the part people miss. The fix isn't a better prompt."],
    [0.35, 'Give the model less power.'],
    [0.3, 'Keep the checks in code.'],
    [0.3, 'And let a person approve anything risky.'],
    [0.6, '[warm] Try the quick check on this card. Then take on the other nine.'],
  ],
};

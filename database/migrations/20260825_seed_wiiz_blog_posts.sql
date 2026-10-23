-- Seed the public WiiZ blog entries currently shown on https://www.wiiz.it/blog.
-- Safe to re-run: rows are keyed by their canonical slug.

SET NAMES utf8mb4;

INSERT INTO blog_posts
  (title, slug, short_description, content, filepath, status, is_active, created_at, updated_at)
VALUES
  (
    'Who Governs the Agent? How the Industry Is Finally Closing the Agentic AI Security Gap',
    'who-governs-the-agent-how-the-industry-is-finally-closing-the-agentic-ai-security-gap',
    'Agentic AI governance is making autonomous systems observable, controllable, and trustworthy through identity, auditability, and enforceable boundaries.',
    '<h2>From invisible automation to accountable agents</h2><p>For years, AI systems could make decisions and trigger actions without a clear operational identity, audit trail, or consistent policy boundary. As agents become more capable, that gap becomes an enterprise security and governance concern.</p><h2>What effective agent governance requires</h2><p>A practical governance model connects every agent and workflow to an owner, records the context and outcome of each execution, and applies policies before an action reaches an enterprise system.</p><ul><li>Identity and access controls for agents, tools, and models.</li><li>Traceable execution logs for investigation and compliance.</li><li>Guardrails that can block, redact, mask, or require approval.</li><li>Continuous monitoring of performance, cost, and risk.</li></ul><h2>Why observability closes the loop</h2><p>Governance is strongest when teams can see what an agent did, understand why it did it, and intervene when the result is outside policy. This turns agentic AI from an opaque automation layer into an operational system that can be improved responsibly.</p><p>Organizations that combine orchestration, governance, and observability are better positioned to scale AI with confidence.</p>',
    'blog/5.jpg',
    'published',
    1,
    '2026-05-16 00:00:00',
    '2026-05-16 00:00:00'
  ),
  (
    'Not Just a Chatbot: How Agentic AI Is Quietly Fixing Broken Systems Across Industries',
    'not-just-a-chatbot-how-agentic-ai-is-quietly-fixing-broken-systems-across-industries',
    'Agentic AI is moving beyond conversation to reason, coordinate, and act across fragmented processes in healthcare, finance, logistics, and other industries.',
    '<h2>Beyond the chat interface</h2><p>Many enterprise processes are slowed by disconnected systems, repetitive handoffs, and information that is difficult to find. A chatbot can answer a question, but an agentic system can understand a goal, use the right tools, and coordinate the steps needed to complete the work.</p><h2>Where the impact appears</h2><p>In healthcare, agents can help route information and prepare case summaries. In finance, they can support document review, compliance checks, and customer operations. In logistics and manufacturing, they can connect live operational signals to recommendations and follow-up actions.</p><h2>The enterprise difference</h2><p>Useful agentic AI is not simply about adding a model to an existing screen. It needs access to trusted enterprise information, clear permissions, workflow orchestration, and visibility into every action.</p><ul><li>Reason over structured and unstructured business information.</li><li>Coordinate multiple agents, models, and tools.</li><li>Keep humans in the approval loop for sensitive decisions.</li><li>Measure outcomes, latency, and token costs continuously.</li></ul><p>That combination helps organizations repair broken handoffs and turn AI experimentation into measurable operational improvement.</p>',
    'blog/6.webp',
    'published',
    1,
    '2026-05-16 00:00:00',
    '2026-05-16 00:00:00'
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  short_description = VALUES(short_description),
  content = VALUES(content),
  filepath = VALUES(filepath),
  status = VALUES(status),
  is_active = VALUES(is_active),
  updated_at = VALUES(updated_at);

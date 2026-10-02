# Port prompt — install the learning practices in a project

Paste the block below into an AI coding session inside any repo (finished or in progress). It does a pass to pull the learnings out of the build, then installs the three practices for ongoing work. It detects the stack itself.

Copy everything between the lines.

------------------------------------------------------------------------

You are helping me turn this project into a learning artifact and install ongoing learning practices. I am leveling up as a developer and want to understand two things from every project I build: the technology it is rooted in, and my own patterns as a builder. If this repo is finished, most of this pass is retrospective. Work through the parts in order and report as you go. Do not commit anything unless I ask; create the files and show me.

PART A — Understand this project
1. Map the repo. Read the README, the package manifest(s), config, the directory structure, and the entry points. Tell me the stack (languages, frameworks, runtime, database, hosting) and, in one paragraph, what this project actually does.
2. Read the git history: `git log --stat`, `git log --oneline`, and skim the notable diffs. Note how the project evolved and where big rewrites or clusters of bug-fixes happened.
3. Produce an architecture map of how the parts connect: the request and data flow, and which language or tool owns which job and why. Give me prose plus a Mermaid diagram. Save it to `docs/learning/architecture-map.md`.

PART B — Extract the learnings
4. Write a GLOSSARY of the key concepts and technologies in THIS project. Each entry in plain language, tied to the file or area that uses it, focused on: what does this do, how does it connect to the rest, and why was this language or tool the right (or wrong) choice here. Aim it at someone strengthening their fundamentals, not at an expert. Save to `docs/learning/GLOSSARY.md`.
5. Write a QUESTIONS list: the things about this codebase worth understanding more deeply, including the clever bits, the risky bits, and the gaps. Save to `docs/learning/QUESTIONS.md`.
6. Write a BUILD RETROSPECTIVE from the git history: commit cadence, message quality, rework and churn patterns, and what the history reveals about how I worked. Be candid, not flattering. State plainly that prompt-level coaching needs live sessions, so this retrospective is history-derived only. Save to `docs/learning/coaching/build-retrospective.md`.

PART C — Install the ongoing system
7. Create `docs/learning/README.md` explaining the three practices below.
8. Add a "Learning practices (standing)" section to `CLAUDE.md` (create `CLAUDE.md` if it does not exist) containing the three practices and the leadership note below.
9. Add `docs/learning/coaching/` to `.gitignore`. The retrospective is a candid self-critique and must never be committed, because the repo may go public.

THE THREE PRACTICES (install these, and follow them going forward):
1. Git-spine. Every meaningful commit carries a `Learned:` trailer: a concept, a tradeoff, or an error and its fix, in plain language. Trivial commits are exempt. `git log --grep='Learned:'` is the learning timeline.
2. Questions queue to glossary. Capture my in-the-moment questions in `docs/learning/QUESTIONS.md` as they surface; offer to log them rather than waiting. When one is answered, graduate the concept to `docs/learning/GLOSSARY.md` in plain language, linked to the file or commit that taught it.
3. Coaching review. At milestones and on request, produce a candid scorecard of how I worked: highest-yield prompts, where friction or rework crept in, strengths, growth edges, and one or two concrete changes to try next time. Keep a readable copy in the gitignored `docs/learning/coaching/`. Never commit the critique.

LEADERSHIP NOTE (how I drive the project): high standards, directness, and ambitious framing are pure wins with AI and cost nothing, so do not cushion criticism for your sake. Drop cruelty and theatrics. Because AI tends to fail by agreeing too readily, not by resentment, counterbalance my forceful or reality-distorting prompts with reality-checks: argue the other side, demand evidence, verify in-browser or with tests. Demand the impossible, then demand proof it is real.

REPORT: finish with (a) the stack and the one-paragraph description, (b) the top five things worth learning from this project, (c) anything that genuinely surprised you, and (d) the list of files you created.

CONSTRAINTS: write plainly, like an intelligent human, and never use em dashes. Make no outward or irreversible changes, and no commits, without asking me first.

------------------------------------------------------------------------

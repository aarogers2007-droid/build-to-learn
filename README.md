# Build to Learn

A small kit for learning from every project you ship with an AI assistant, about the technology you are using and about how you work.

When you build fast with AI, the lessons go by faster than you can absorb them. A tricky bug gets fixed and the understanding evaporates. A good decision gets made and the reasoning is gone by next week. This kit catches those lessons without turning into a chore, and renders them into one page you can actually read.

**Live demo:** https://aarogers2007-droid.github.io/build-to-learn/ (built from Iris, my open accessibility project)

## The idea

Three practices, each bolted to something you already do, so none of them rot:

1. **Git-spine.** Every meaningful commit carries a `Learned:` trailer: a concept, a tradeoff, or an error and its fix, in plain language. Then `git log --grep='Learned:'` is your learning timeline, tied to the exact diff that taught it. Nothing to maintain separately.
2. **Questions queue to glossary.** You dump curiosity the moment it strikes into `docs/learning/QUESTIONS.md`. When a question gets answered, the concept graduates to `docs/learning/GLOSSARY.md` in plain language, linked to the file that taught it. The shape of your questions is the map of what you are actually learning.
3. **Coaching review.** At milestones, the assistant writes a candid scorecard of how you worked: your highest-yield moves, where rework crept in, and one concrete thing to change. It stays local and gitignored, because it is a frank critique.

A generator (`generate.mjs`, zero dependencies) scans every project's `docs/learning/` folder and renders the glossary, questions, architecture diagrams, and coaching notes into a single browsable page.

## What showed up when I ran it across my own projects

The point of the practice is that past lessons become visible, so patterns you never planned start to rhyme. Mine, so far:

- **Authorization belongs in the database.** I kept arriving at the same answer on different projects: decide access with a row-level security rule keyed on the authenticated identity, not with a check in application code that someone can forget. A forgotten app-layer check still cannot leak data. Iris commits to the same per-user isolation.
- **One choke point for volatile dependencies.** Model IDs, API shapes, and provider quirks churn. Routing every call through a single module, with every model string in one config file, turned a painful migration into a nearly one-line change.
- **Choose fail-open versus fail-closed on purpose, per check.** Security and privacy checks should fail closed. A slow or missing nice-to-have should fail open so the product degrades instead of locking the user out. "Fail closed" is not a reflex to apply everywhere.
- **Keep the front-door doc honest.** The one document a new reader sees first, the README, is the easiest to leave lying. A front door that lies is worse than no front door.

None of these were planned insights. They only became visible because the practice wrote them down as they happened. That is the whole argument for doing it.

## Use it

In a finished project, or one in progress:

1. Paste [`prompts/port-prompt.md`](prompts/port-prompt.md) into an AI coding session in that repo. It reads the codebase and git history, writes a plain-language glossary and an architecture map, and installs the three practices going forward.
2. Later, paste [`prompts/answer-questions-prompt.md`](prompts/answer-questions-prompt.md) to work through the questions queue, answering each from the real code and graduating the concepts into the glossary.
3. Point the generator at your projects and build the hub:

   ```bash
   node generate.mjs                    # full hub, includes coaching -> index.html
   node generate.mjs --no-coaching      # shareable, no coaching     -> index-shareable.html
   node generate.mjs --only myproj --no-coaching --out docs/index.html   # one project, Pages-ready
   ```

   Edit `SCAN_ROOTS`, `EXTRA_PATHS`, and `NAME_MAP` at the top of `generate.mjs` to match where your repos live.

The coaching reviews are gitignored by default. Keep them local.

## License

MIT. Take it, adapt it, make it yours.

# Answer-the-questions prompt

Paste the block below into a project that already has a `docs/learning/` folder. It works through `docs/learning/QUESTIONS.md`, answers each question from the real code, and graduates what it learns into the glossary.

Copy everything between the lines.

------------------------------------------------------------------------

You are helping me learn from this project by answering the open questions it logged earlier. This repo already has a `docs/learning/` folder. Your job is to turn `docs/learning/QUESTIONS.md` from a list of unknowns into understanding.

Rules of the road:
- Answer from the actual code, not from memory. For each question, find and read the real files first, then answer. If you cannot verify something, say so plainly rather than guessing. Cite the file, and the function or line where it helps.
- Teach, do not just state. Each answer should say what the thing does, how it connects to the rest of the system, and why it was built this way (the tradeoff). Plain language, aimed at someone strengthening their programming fundamentals, not at an expert.

Do this, in order, and show your work as you go:
1. Read `docs/learning/QUESTIONS.md`. For each open question:
   a. Research it in the codebase and answer it clearly, teaching as above, with file citations.
   b. If the answer is a reusable concept, add it to `docs/learning/GLOSSARY.md` in plain language, linked to the file or commit that taught it.
   c. Remove the now-answered item from `QUESTIONS.md` (git history keeps the old version). Leave genuinely-open ones in place, each with a one-line note on exactly what is needed to close it.
2. Some items in the queue are really documentation-truth problems you flagged (for example a README that describes removed features, or inconsistent names across files). Do NOT silently rewrite product or user-facing docs. Instead, list each discrepancy next to the current reality and your recommended fix, and ask me to approve before changing any README or user-facing doc.
3. Keep a short running answer log in your reply so I can read your reasoning, not only the final glossary.

Report at the end:
- Which questions are now answered and live in the glossary.
- Which remain open, and exactly what is needed to answer each.
- The documentation-truth fixes awaiting my decision, each with your recommendation.

Constraints: write plainly, like an intelligent human, and never use em dashes. Make no commits, and no changes to product or user-facing docs, without my approval. Verify every claim against the code.

------------------------------------------------------------------------

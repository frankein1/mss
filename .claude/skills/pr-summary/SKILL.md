# PR Summary — Write a pull request summary to a markdown file

Generate a concise PR summary for the current branch, written in French, and save it to `docs/pr-<branch-suffix>.md`.

The summary should help reviewers understand **why** the change was made and **what choices matter** — not enumerate every modified file or line.

## Steps

1. **Gather context** — run these commands:
   - `git log main..HEAD --oneline` — all commits on the branch
   - `git diff main --stat` — files changed
   - `git diff main` — full diff
   - Read any existing `docs/pr-*.md` for this branch

2. **Identify what matters for review** — focus on:
   - The motivation: what problem exists, why act now
   - Architecture decisions: new patterns, structural choices, tradeoffs made
   - Breaking changes: API changes, schema migrations, removed features, changed behavior
   - Risks and edge cases worth calling out
   - Measured results if applicable (perf benchmarks, before/after)

   **Do NOT** list every file changed, every function added, or every test written. Reviewers can read the diff for that.

3. **Write the summary** in French using this template:

```markdown
## Contexte

<Why this branch exists. What problem it solves. 2-3 sentences max.>

## Choix et points d'attention

<What the reviewer needs to understand beyond the diff:

- Key architecture or design decisions and their rationale
- Breaking changes or behavioral changes
- Risks, tradeoffs, or known limitations
- Performance impact with numbers if relevant

Keep it to the essential points. A few focused bullets beat a wall of text.>

## Screenshots

<If UI changes, otherwise omit this section entirely.>

## Comment tester

<Numbered steps to verify locally. Keep it short — only non-obvious steps.>

## TODO avant merge

- [ ] Y a-t-il ajout de variables d'environnement ? Si oui, les ai-je déjà rajoutées dans les environnements déployés
      **ET** ai-je communiqué sur le canal dev afin qu'elles soient rajoutées dans l'environnement local de chacune/chacun ?

/assign me

#[issue-number]
```

4. **Save** to `docs/pr-<branch-suffix>.md` where `<branch-suffix>` is the branch name with the leading ticket number (e.g. branch `948-chargement-liste-documents` → `docs/pr-948-chargement-liste-documents.md`). If the file already exists, update it.

## Guidelines

- Write in French (the team's working language)
- Be concise, but don't compress at the expense of clarity — complex PRs deserve longer summaries
- Focus on the "why" and the "what matters", not the "what was done"
- Mark env var checkbox as done (`[x]`) when no env vars are added
- Factual tone, no filler

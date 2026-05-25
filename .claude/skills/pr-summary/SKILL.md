# PR Summary — Write a pull request summary to a markdown file

Generate a PR summary document for the current branch, written in French, and save it to `docs/pr-<branch-suffix>.md`.

## Steps

1. **Gather context** — run these commands to understand the full scope of changes:
   - `git log main..HEAD --oneline` — all commits on the branch
   - `git diff main --stat` — files changed
   - `git diff main` — full diff
   - Read any existing `docs/pr-*.md` for this branch

2. **Analyze changes** — categorize each change:
   - Performance improvements (indexes, query changes, caching)
   - New features or endpoints
   - Bug fixes
   - Test coverage (new test files, what they cover)
   - Infrastructure / tooling changes (fixtures, test utils, config)
   - Schema / migration changes

3. **Write the summary** in French using this exact template:

```markdown
## Contexte/Problème

<Why this branch exists. What problem it solves. 2-4 sentences.>

## Implémentation/Changements

<Group changes by category with ### subheadings. For each change:

- What file/area changed
- What specifically changed and why
- Include measured results if applicable (perf benchmarks, before/after)>

## Screenshots

<Screenshots if UI changes, otherwise "N/A (pas de changement UI)">

## Comment tester

<Numbered steps to verify the changes locally. Include:

1. Setup steps (migrations, seeds)
2. How to run relevant tests
3. Manual verification steps if applicable>

## TODO avant merge

- [ ] Y a-t-il ajout de variables d'environnement ? Si oui, les ai-je déjà rajoutées dans les environnements déployés
      **ET** ai-je communiqué sur le canal dev afin qu'elles soient rajoutées dans l'environnement local de chacune/chacun ?

/assign me

#[issue-number]
```

4. **Save** to `docs/pr-<branch-suffix>.md` where `<branch-suffix>` is the branch name with the leading ticket number (e.g. branch `948-chargement-liste-documents` → `docs/pr-948-chargement-liste-documents.md`). If the file already exists, update it with the latest changes rather than duplicating content.

## Guidelines

- Write in French (the team's working language)
- Be specific and quantitative — include test counts, performance numbers, file names
- For test coverage sections, list the test categories and count per category
- Mark env var checkbox as done (`[x] Y a-t-il ajout de variables d'environnement ?`) when no env vars are added
- Keep the tone factual and concise — no marketing language

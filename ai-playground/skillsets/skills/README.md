# Skills Directory

Store each skill as a folder containing a `SKILL.md` entry point.

Recommended structure per skill:

- `<skill-name>/SKILL.md`: instructions, workflow, and boundaries
- `<skill-name>/references/`: optional reference docs
- `<skill-name>/scripts/`: optional helper scripts
- `<skill-name>/assets/`: optional templates and static assets

## Best Practices

1. Keep `SKILL.md` concise and task-oriented.
2. Include clear trigger conditions (when to use this skill).
3. Put reusable templates in `assets/` instead of inline duplication.
4. Keep provider-specific details in `config/`, not in skill logic.
5. Document assumptions, inputs, and expected outputs explicitly.

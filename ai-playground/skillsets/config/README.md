# Multi-Provider LLM Configuration (Provider Native Formats)

This directory now uses each provider's common/default config style instead of a unified YAML schema.

## 1) Claude Code

Path: `config/claude-code/`

- `CLAUDE.md`: default instruction file style used by Claude Code projects
- `settings.json`: JSON settings-style config for model/runtime preferences

## 2) OpenAI Codex

Path: `config/openai-codex/`

- `config.toml`: TOML config style used by Codex CLI tooling

## 3) Kimi CLI

Path: `config/kimi-cli/`

- `.env.example`: environment-variable style configuration
- `config.json`: JSON runtime options

## 4) GLM

Path: `config/glm/`

- `.env.example`: environment-variable style configuration
- `request.json`: default OpenAI-compatible request body template

## 5) MiniMax

Path: `config/minimax/`

- `.env.example`: environment-variable style configuration
- `request.json`: JSON request template

## 6) OpenCode

Path: `config/opencode/`

- `opencode.json`: JSON config style

## 7) Qwen

Path: `config/qwen/`

- `.env.example`: environment-variable style configuration
- `request.json`: DashScope-compatible JSON request template

## 8) ZhipuAI

Path: `config/zhipuai/`

- `.env.example`: environment-variable style configuration
- `request.json`: GLM/Zhipu JSON request template

## Security Notes

1. Do not commit real API keys.
2. Copy `.env.example` to `.env` locally when needed.
3. Rotate keys if exposed.


## More Documentation

- `USAGE.md`: system-level and project-level setup guide

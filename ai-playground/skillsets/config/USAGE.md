# Configuration Usage Guide

This document explains how to use provider configuration files at two scopes:

1. System level: shared defaults for your whole machine
2. Project level: overrides inside a specific repository

## Scope Rules

Recommended precedence:

1. Project-level config (highest priority)
2. System-level config (fallback)
3. Provider CLI built-in defaults

Keep secrets in environment variables, not committed files.

## System-Level Setup

Use a central directory to store global defaults.

Suggested locations:

- macOS/Linux: `~/.config/llm-providers/`
- Windows: `%APPDATA%\\llm-providers\\`

Copy this repo's `config/<provider>/` folder into your system-level location.

Example (macOS/Linux):

```bash
mkdir -p ~/.config/llm-providers
cp -R config/openai-codex ~/.config/llm-providers/
cp -R config/claude-code ~/.config/llm-providers/
```

Set global environment variables in your shell profile (`~/.zshrc`, `~/.bashrc`):

```bash
export OPENAI_API_KEY="..."
export CLAUDE_API_KEY="..."
export KIMI_API_KEY="..."
export GLM_API_KEY="..."
export MINIMAX_API_KEY="..."
export OPENCODE_API_KEY="..."
export QWEN_API_KEY="..."
export ZHIPUAI_API_KEY="..."
```

Reload shell:

```bash
source ~/.zshrc
```

## Project-Level Setup

Place project-specific config under your repository, for example:

- `.llm/config/openai-codex/config.toml`
- `.llm/config/claude-code/settings.json`
- `.llm/config/qwen/request.json`

Project-level values should tune model/runtime behavior for that repo only.

For env files, use:

- `.env.example` committed
- `.env` local only (add to `.gitignore`)

Example:

```bash
mkdir -p .llm/config
cp -R config/* .llm/config/
cp .llm/config/qwen/.env.example .llm/config/qwen/.env
```

## Provider-by-Provider Usage

## Claude Code

Files:

- `claude-code/CLAUDE.md`
- `claude-code/settings.json`

Usage pattern:

1. Put `CLAUDE.md` at project root (or merge into your existing one).
2. Keep `settings.json` in your tool config path.
3. Export `CLAUDE_API_KEY`.

System-level example path:

- `~/.config/llm-providers/claude-code/settings.json`

Project-level example path:

- `<repo>/.llm/config/claude-code/settings.json`

## OpenAI Codex

File:

- `openai-codex/config.toml`

Usage pattern:

1. Keep a global `config.toml` for defaults.
2. Add a project copy to override model or token limits.
3. Export `OPENAI_API_KEY`.

System-level example path:

- `~/.config/llm-providers/openai-codex/config.toml`

Project-level example path:

- `<repo>/.llm/config/openai-codex/config.toml`

## Kimi CLI

Files:

- `kimi-cli/.env.example`
- `kimi-cli/config.json`

Usage pattern:

1. Copy `.env.example` to `.env` locally.
2. Load env before running CLI.
3. Use `config.json` as runtime options.

Example:

```bash
set -a
source .llm/config/kimi-cli/.env
set +a
```

## GLM

Files:

- `glm/.env.example`
- `glm/request.json`

Usage pattern:

1. Copy `.env.example` to `.env`.
2. Load env vars.
3. Use `request.json` as base request payload.

## MiniMax

Files:

- `minimax/.env.example`
- `minimax/request.json`

Usage pattern:

1. Copy `.env.example` to `.env`.
2. Load env vars.
3. Send requests using `request.json` template.

## OpenCode

File:

- `opencode/opencode.json`

Usage pattern:

1. Keep `opencode.json` in system or project config path.
2. Export `OPENCODE_API_KEY`.
3. Override model per project if needed.

## Qwen

Files:

- `qwen/.env.example`
- `qwen/request.json`

Usage pattern:

1. Copy `.env.example` to `.env`.
2. Load env vars.
3. Use `request.json` for DashScope-compatible calls.

## ZhipuAI

Files:

- `zhipuai/.env.example`
- `zhipuai/request.json`

Usage pattern:

1. Copy `.env.example` to `.env`.
2. Load env vars.
3. Use `request.json` as GLM-compatible payload.

## Recommended Team Workflow

1. Commit shared templates only: `config/**`, `.env.example`
2. Ignore local secrets: `.env`
3. Define project overrides in `.llm/config/`
4. Keep system defaults in `~/.config/llm-providers/`

## Quick Start Checklist

1. Choose provider config folder(s)
2. Install at system path and/or project path
3. Set required `*_API_KEY` env vars
4. Copy `.env.example` to `.env` where applicable
5. Run your CLI/tool with project config first, fallback to system config

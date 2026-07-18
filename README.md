# pi-deepseek-pricing

DeepSeek model pricing extension for [pi coding agent](https://github.com/earendil-works/pi).

## What it does

- **`/deepseek-pricing`** command -- displays a pricing table for all DeepSeek models
- **`deepseek_pricing` tool** -- LLM-callable tool that answers pricing questions

## Models

| Model | Input / 1M tokens | Output / 1M tokens | Cache Read / 1M tokens | Context | Max Output |
|---|---|---|---|---|---|
| deepseek-v4-flash | $0.1400 | $0.2800 | $0.0028 | 1.0M | 384K |
| deepseek-v4-pro | $0.4350 | $0.8700 | $0.0036 | 1.0M | 384K |

## Install

### Global (single file)

```bash
cp extensions/deepseek-pricing.ts ~/.pi/agent/extensions/deepseek-pricing.ts
```

Then `/reload` in pi or restart.

### As a pi package

```bash
pi install npm:pi-deepseek-pricing
```

### Quick test

```bash
pi -e ./extensions/deepseek-pricing.ts
```

## Usage

In pi, type:

```
/deepseek-pricing
```

Or ask the agent: "What's the DeepSeek pricing?"

# pi-deepseek-pricing

DeepSeek peak pricing indicator extension for [pi coding agent](https://github.com/earendil-works/pi).

## What it does

Shows a **red warning** in the pi status bar and widget area when using DeepSeek models during peak pricing hours (2x cost). Shows **green** during off-peak. Automatically clears when using non-DeepSeek models.

### Peak Hours (UTC)

| Period | UTC | UTC+8 (CST) |
|---|---|---|
| Morning peak | 1:00 AM – 4:00 AM | 9:00 AM – 12:00 PM |
| Afternoon peak | 6:00 AM – 10:00 AM | 2:00 PM – 6:00 PM |

During these windows, DeepSeek API costs are **2x** the regular price.

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

No commands needed — the indicator appears automatically in the status bar when you select a DeepSeek model.

- **Peak hours:** `DeepSeek PEAK PRICING (2x)` in red, with end-time widget
- **Off-peak:** `DeepSeek off-peak` in green
- **Non-DeepSeek models:** indicator hidden

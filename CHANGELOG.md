# Changelog

## 1.0.1

### Changed

- Complete rewrite: replaced `/deepseek-pricing` command + `deepseek_pricing` tool with a peak-pricing indicator
- Red status bar + widget warning during peak hours (2x cost)
- Green status bar + widget during off-peak hours
- Auto-detects DeepSeek model selection via `model_select` event
- Timer-based recheck every minute to catch hour boundaries
- Cleanup on session shutdown
- Updated README to reflect new behavior

## 1.0.0

### Added

- Initial release
- Red status bar warning when DeepSeek models are selected during peak pricing hours (2x cost)
- Green status indicator during off-peak hours
- Widget showing peak end time or off-peak status
- Auto-clears indicators when non-DeepSeek models are selected
- Timer-based recheck every minute to catch hour boundaries
- Proper cleanup on session shutdown

### Peak Hours (UTC)

| Period | UTC | UTC+8 (CST) |
|---|---|---|
| Morning peak | 1:00 – 4:00 | 9:00 AM – 12:00 PM |
| Afternoon peak | 6:00 – 10:00 | 2:00 PM – 6:00 PM |

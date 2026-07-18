/**
 * DeepSeek Peak Pricing Indicator
 *
 * Shows a red warning when using DeepSeek models during peak pricing hours,
 * and shows peak/off-peak status for all DeepSeek models in the model picker.
 *
 * DeepSeek peak hours (UTC): 1:00-4:00 AM and 6:00-10:00 AM
 * (UTC+8: 9:00 AM-12:00 PM and 2:00-6:00 PM)
 *
 * During peak hours, API costs are 2x the regular price.
 *
 * Place in ~/.pi/agent/extensions/ or .pi/extensions/ for auto-discovery.
 */

import type { ExtensionAPI, ThemeColor } from "@earendil-works/pi-coding-agent";

// Peak hour slots as [startHour, endHour) pairs in UTC
const PEAK_SLOTS: readonly [number, number][] = [
	[1, 4], // 1:00-4:00 AM UTC (9:00 AM-12:00 PM UTC+8)
	[6, 10], // 6:00-10:00 AM UTC (2:00-6:00 PM UTC+8)
];

function isPeakHour(): boolean {
	const utcHour = new Date().getUTCHours();
	return PEAK_SLOTS.some(([start, end]) => utcHour >= start && utcHour < end);
}

function isDeepSeekProvider(provider: string): boolean {
	return provider === "deepseek";
}

const STATUS_KEY = "deepseek-pricing";
const WIDGET_KEY = "deepseek-pricing";

function updateDeepSeekStatus(ctx: {
	ui: {
		theme: {
			fg: (color: ThemeColor, text: string) => string;
		};
		setStatus: (key: string, text: string | undefined) => void;
		setWidget: (key: string, content: string[] | undefined) => void;
	};
	model?: { provider: string; id: string };
}) {
	const model = ctx.model;
	const peak = isPeakHour();
	const theme = ctx.ui.theme;

	if (model && isDeepSeekProvider(model.provider)) {
		if (peak) {
			// Red warning: peak pricing active
			const peakEnd = getCurrentPeakEnd()!;
			const remaining = timeRemainingHuman(peakEnd);
			const endsAt = `${peakEnd.getUTCHours().toString().padStart(2, "0")}:00 UTC`;
			ctx.ui.setStatus(
				STATUS_KEY,
				theme.fg("error", `DeepSeek PEAK (2x, ends ${remaining})`),
			);
			ctx.ui.setWidget(WIDGET_KEY, [
				theme.fg("error", ` DeepSeek peak pricing active -- costs are 2x (ends ${remaining} at ${endsAt})`),
			]);
		} else {
			// Green: off-peak — show when next peak starts
			const nextPeak = getNextPeakStart();
			const remaining = timeRemainingHuman(nextPeak);
			const startsAt = `${nextPeak.getUTCHours().toString().padStart(2, "0")}:00 UTC`;
			ctx.ui.setStatus(
				STATUS_KEY,
				theme.fg("success", `DeepSeek off-peak (peak in ${remaining})`),
			);
			ctx.ui.setWidget(WIDGET_KEY, [
				theme.fg("success", ` DeepSeek off-peak pricing (next peak in ${remaining} at ${startsAt})`),
			]);
		}
	} else {
		// Not using DeepSeek: clear indicators
		ctx.ui.setStatus(STATUS_KEY, undefined);
		ctx.ui.setWidget(WIDGET_KEY, undefined);
	}
}

/** Date in UTC for when the current peak slot ends (or null if off-peak). */
function getCurrentPeakEnd(): Date | null {
	const now = new Date();
	const utcHour = now.getUTCHours();
	for (const [start, end] of PEAK_SLOTS) {
		if (utcHour >= start && utcHour < end) {
			const d = new Date(now);
			d.setUTCHours(end, 0, 0, 0);
			return d;
		}
	}
	return null;
}

/** Date in UTC for when the next peak slot starts. */
function getNextPeakStart(): Date {
	const now = new Date();
	const utcHour = now.getUTCHours();
	for (const [start] of PEAK_SLOTS) {
		if (utcHour < start) {
			const d = new Date(now);
			d.setUTCHours(start, 0, 0, 0);
			return d;
		}
	}
	// All slots passed today — next is tomorrow's first slot
	const d = new Date(now);
	d.setUTCDate(d.getUTCDate() + 1);
	d.setUTCHours(PEAK_SLOTS[0][0], 0, 0, 0);
	return d;
}

/**
 * Format time remaining between now and a future date as "Xh Ym".
 * Returns "<1m" if under a minute.
 */
function timeRemainingHuman(target: Date): string {
	const diffMs = target.getTime() - Date.now();
	if (diffMs <= 0) return "now";
	const totalMinutes = Math.ceil(diffMs / 60_000);
	if (totalMinutes < 1) return "<1m";
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (hours === 0) return `${minutes}m`;
	return `${hours}h ${minutes}m`;
}

let timer: ReturnType<typeof setInterval> | null = null;

export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		updateDeepSeekStatus(ctx);

		// Re-check every minute to catch hour boundaries
		timer = setInterval(() => {
			updateDeepSeekStatus(ctx);
		}, 60_000);
	});

	pi.on("model_select", async (event, ctx) => {
		updateDeepSeekStatus(ctx);
	});

	pi.on("session_shutdown", async () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	});
}

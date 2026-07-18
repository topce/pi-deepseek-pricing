/**
 * DeepSeek Pricing Extension
 *
 * /deepseek-pricing command + deepseek_pricing tool for the LLM.
 *
 * Install globally:
 *   cp extensions/deepseek-pricing.js ~/.pi/agent/extensions/deepseek-pricing.js
 */

const PRICING = {
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    input: 0.14,
    output: 0.28,
    cacheRead: 0.0028,
    contextWindow: 1_000_000,
    maxTokens: 384_000,
  },
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    input: 0.435,
    output: 0.87,
    cacheRead: 0.003625,
    contextWindow: 1_000_000,
    maxTokens: 384_000,
  },
};

function formatPrice(price) {
  return `$${price.toFixed(4)}`;
}

function pricingTable() {
  const lines = [
    "| Model | Input / 1M tokens | Output / 1M tokens | Cache Read / 1M tokens | Context | Max Output |",
    "|-------|-------------------|--------------------|------------------------|---------|------------|",
  ];
  for (const [id, p] of Object.entries(PRICING)) {
    const ctx = p.contextWindow >= 1_000_000
      ? `${(p.contextWindow / 1_000_000).toFixed(1)}M`
      : `${(p.contextWindow / 1000).toFixed(0)}K`;
    const max = p.maxTokens >= 1000
      ? `${(p.maxTokens / 1000).toFixed(0)}K`
      : `${p.maxTokens}`;
    lines.push(`| ${id} | ${formatPrice(p.input)} | ${formatPrice(p.output)} | ${formatPrice(p.cacheRead)} | ${ctx} | ${max} |`);
  }
  return lines.join("\n");
}

export default function (pi) {
  pi.registerCommand("deepseek-pricing", {
    description: "Show DeepSeek model pricing",
    handler: async (_args, ctx) => {
      ctx.ui.notify(pricingTable(), "info");
    },
  });

  pi.registerTool({
    name: "deepseek_pricing",
    label: "DeepSeek Pricing",
    description: "Get current DeepSeek API pricing for all models. Call this when the user asks about DeepSeek pricing, costs, or model comparison.",
    parameters: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description: "Specific model ID (e.g. deepseek-v4-flash, deepseek-v4-pro). Omit for all.",
        },
      },
    },
    async execute(_toolCallId, params) {
      if (params.model) {
        const p = PRICING[params.model];
        if (!p) {
          return {
            content: [{ type: "text", text: `Unknown model "${params.model}". Available: ${Object.keys(PRICING).join(", ")}` }],
            details: {},
          };
        }
        const text = [
          `**${p.name}** (\`${params.model}\`)`,
          `- Input: ${formatPrice(p.input)} / 1M tokens`,
          `- Output: ${formatPrice(p.output)} / 1M tokens`,
          `- Cache read: ${formatPrice(p.cacheRead)} / 1M tokens`,
          `- Context window: ${(p.contextWindow / 1000).toFixed(0)}K`,
          `- Max output tokens: ${(p.maxTokens / 1000).toFixed(0)}K`,
        ].join("\n");
        return { content: [{ type: "text", text }], details: {} };
      }
      return {
        content: [{ type: "text", text: pricingTable() }],
        details: {},
      };
    },
  });
}

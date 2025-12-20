/**
 * AI Summary Generation Step
 *
 * Generates multi-format podcast summaries using Gemini 2.0.
 *
 * Summary Formats:
 * - Full: 200-300 word comprehensive overview for show notes
 * - Bullets: 5-7 scannable key points for quick reference
 * - Insights: 3-5 actionable takeaways for the audience
 * - TL;DR: One-sentence hook for social media
 */
import { genAI, MODELS } from "../../lib/geminiai-client";
import { type Summary, summarySchema } from "../../schemas/ai-outputs";
import type { TranscriptWithExtras } from "../../types/assemblyai";

// System prompt defines Gemini's role and expertise
const SUMMARY_SYSTEM_PROMPT =
  "You are an expert podcast content analyst and marketing strategist. Your summaries are engaging, insightful, and highlight the most valuable takeaways for listeners.";

/**
 * Builds the user prompt with transcript context and detailed instructions
 */
function buildSummaryPrompt(transcript: TranscriptWithExtras): string {
  return `Analyze this podcast transcript in detail and create a comprehensive summary package.

TRANSCRIPT (first 5000 chars):
${transcript.text.substring(0, 5000)}...

${transcript.chapters.length > 0
      ? `\nAUTO-DETECTED CHAPTERS:\n${transcript.chapters
        .map((ch, idx) => `${idx + 1}. ${ch.headline} - ${ch.summary}`)
        .join("\n")}`
      : ""
    }

Create a summary with:

1. FULL OVERVIEW (200-300 words):
   - What is this podcast about?
   - Who is speaking and what's their perspective?
   - What are the main themes and arguments?
   - Why should someone listen to this?

2. KEY BULLET POINTS (5-7 items):
   - Main topics discussed in order
   - Important facts or statistics mentioned
   - Key arguments or positions taken
   - Notable quotes or moments

3. ACTIONABLE INSIGHTS (3-5 items):
   - What can listeners learn or apply?
   - Key takeaways that provide value
   - Perspectives that challenge conventional thinking
   - Practical advice or recommendations

4. TL;DR (one compelling sentence):
   - Capture the essence and hook interest
   - Make someone want to listen

Be specific, engaging, and valuable. Focus on what makes this podcast unique and worth listening to.`;
}

/**
 * Generates summary using Gemini with structured outputs
 */
export async function generateSummary(
  transcript: TranscriptWithExtras
): Promise<Summary> {
  console.log("Generating podcast summary with Gemini 2.0 Flash");

  try {
    const response = await genAI.models.generateContent({
      model: MODELS.FLASH,
      contents: [
        { role: "user", parts: [{ text: SUMMARY_SYSTEM_PROMPT + "\n\n" + buildSummaryPrompt(transcript) }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const content = response.text;

    // Parse and validate response against schema
    const summary = content
      ? summarySchema.parse(JSON.parse(content))
      : {
        full: transcript.text.substring(0, 500),
        bullets: ["Full transcript available"],
        insights: ["See transcript"],
        tldr: transcript.text.substring(0, 200),
      };

    return summary;
  } catch (error) {
    console.error("Gemini summary generation error:", error);

    return {
      full: "⚠️ Error generating summary with Gemini. Please check logs or try again.",
      bullets: ["Summary generation failed - see full transcript"],
      insights: ["Error occurred during AI generation"],
      tldr: "Summary generation failed",
    };
  }
}


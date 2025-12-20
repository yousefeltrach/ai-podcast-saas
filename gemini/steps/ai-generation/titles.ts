/**
 * Title Suggestions Generation
 * 
 * Generates 4 types of title variations using Gemini 2.0.
 */
import { genAI, MODELS } from "../../lib/geminiai-client";
import { type Titles, titlesSchema } from "../../schemas/ai-outputs";
import type { TranscriptWithExtras } from "../../types/assemblyai";

// System prompt defines Gemini's expertise in SEO and viral content
const TITLES_SYSTEM_PROMPT =
  "You are an expert in SEO, content marketing, and viral content creation. You understand what makes titles clickable while maintaining credibility and search rankings.";

/**
 * Builds prompt with transcript preview and title-specific guidelines
 */
function buildTitlesPrompt(transcript: TranscriptWithExtras): string {
  return `Create optimized titles for this podcast episode.

TRANSCRIPT PREVIEW:
${transcript.text.substring(0, 3000)}...

${transcript.chapters.length > 0
      ? `MAIN TOPICS COVERED:\n${transcript.chapters
        .map((ch, idx) => `${idx + 1}. ${ch.headline}`)
        .join("\n")}`
      : ""
    }

Generate 4 types of titles:

1. YOUTUBE SHORT TITLES (exactly 3):
   - 40-60 characters each
   - Hook-focused, curiosity-driven
   - Clickable but not clickbait
   - Use power words and numbers when relevant

2. YOUTUBE LONG TITLES (exactly 3):
   - 70-100 characters each
   - Include SEO keywords naturally
   - Descriptive and informative
   - Format: "Main Topic: Subtitle | Context or Value Prop"

3. PODCAST EPISODE TITLES (exactly 3):
   - Creative, memorable titles
   - Balance intrigue with clarity
   - Good for RSS feeds and directories
   - Can use "Episode #" format or standalone

4. SEO KEYWORDS (5-10):
   - High-traffic search terms
   - Relevant to podcast content
   - Mix of broad and niche terms
   - Focus on what people actually search for

Make titles compelling, accurate, and optimized for discovery.`;
}

/**
 * Generates title suggestions using Gemini with structured outputs
 */
export async function generateTitles(
  transcript: TranscriptWithExtras,
): Promise<Titles> {
  console.log("Generating title suggestions with Gemini 2.0 Flash");

  try {
    const response = await genAI.models.generateContent({
      model: MODELS.FLASH,
      contents: [
        { role: "user", parts: [{ text: TITLES_SYSTEM_PROMPT + "\n\n" + buildTitlesPrompt(transcript) }] }
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const content = response.text;
    // Parse and validate against schema
    const titles = content
      ? titlesSchema.parse(JSON.parse(content))
      : {
        youtubeShort: ["Podcast Episode"],
        youtubeLong: ["Podcast Episode - Full Discussion"],
        podcastTitles: ["New Episode"],
        seoKeywords: ["podcast"],
      };

    return titles;
  } catch (error) {
    console.error("Gemini titles error:", error);

    return {
      youtubeShort: ["⚠️ Title generation failed"],
      youtubeLong: ["⚠️ Title generation failed - check logs"],
      podcastTitles: ["⚠️ Title generation failed"],
      seoKeywords: ["error"],
    };
  }
}


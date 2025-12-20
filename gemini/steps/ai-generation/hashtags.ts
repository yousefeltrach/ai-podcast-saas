/**
 * Platform-Specific Hashtag Generation
 *
 * Generates optimized hashtag strategies for 5 social platforms using Gemini 2.0.
 */
import { genAI, MODELS } from "../../lib/geminiai-client";
import { type Hashtags, hashtagsSchema } from "../../schemas/ai-outputs";
import type { TranscriptWithExtras } from "../../types/assemblyai";

// System prompt establishes Gemini's knowledge of hashtag strategies
const HASHTAGS_SYSTEM_PROMPT =
  "You are a social media growth expert who understands platform algorithms and trending hashtag strategies. You create hashtag sets that maximize reach and engagement.";

/**
 * Builds prompt with episode topics and platform-specific guidelines
 */
function buildHashtagsPrompt(transcript: TranscriptWithExtras): string {
  return `Create platform-optimized hashtag strategies for this podcast.

TOPICS COVERED:
${transcript.chapters
      ?.map((ch, idx) => `${idx + 1}. ${ch.headline}`)
      .join("\n") || "General discussion"
    }

Generate hashtags for each platform following their best practices:

1. YOUTUBE (exactly 5 hashtags):
   - Broad reach, discovery-focused
   - Mix of general and niche
   - Trending in podcast/content space
   - Good for recommendations algorithm

2. INSTAGRAM (6-8 hashtags):
   - Mix of highly popular (100k+ posts) and niche (10k-50k posts)
   - Community-building tags
   - Content discovery tags
   - Trending but relevant

3. TIKTOK (5-6 hashtags):
   - Currently trending tags
   - Gen Z relevant
   - FYP optimization
   - Mix viral and niche

4. LINKEDIN (exactly 5 hashtags):
   - Professional, B2B focused
   - Industry-relevant
   - Thought leadership tags
   - Career/business oriented

5. TWITTER (exactly 5 hashtags):
   - Concise, trending
   - Topic-specific
   - Conversation-starting
   - Mix broad and niche

All hashtags should include the # symbol and be relevant to the actual content discussed.`;
}

/**
 * Generates hashtag sets using Gemini with structured outputs
 */
export async function generateHashtags(
  transcript: TranscriptWithExtras
): Promise<Hashtags> {
  console.log("Generating hashtags with Gemini 2.0 Flash");

  try {
    const response = await genAI.models.generateContent({
      model: MODELS.FLASH,
      contents: [
        { role: "user", parts: [{ text: HASHTAGS_SYSTEM_PROMPT + "\n\n" + buildHashtagsPrompt(transcript) }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const content = response.text;

    // Parse and validate against schema
    const hashtags = content
      ? hashtagsSchema.parse(JSON.parse(content))
      : {
        youtube: ["#Podcast"],
        instagram: ["#Podcast", "#Content"],
        tiktok: ["#Podcast"],
        linkedin: ["#Podcast"],
        twitter: ["#Podcast"],
      };

    return hashtags;
  } catch (error) {
    console.error("Gemini hashtags error:", error);

    return {
      youtube: ["⚠️ Hashtag generation failed"],
      instagram: ["⚠️ Hashtag generation failed"],
      tiktok: ["⚠️ Hashtag generation failed"],
      linkedin: ["⚠️ Hashtag generation failed"],
      twitter: ["⚠️ Hashtag generation failed"],
    };
  }
}


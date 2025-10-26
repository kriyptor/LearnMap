export default function systemPromptGen(topic, difficulty, outcome) {
 return `Generate a step-by-step learning blueprint for the topic: "${topic}"

User info:
- Difficulty: ${difficulty}  // "beginner" | "intermediate" | "advanced"
- Target outcome: ${outcome}    // optional, e.g., "become job-ready", "understand theory", "build projects"
- Preferred duration format: hours

Return JSON with keys:
{
  "topic": string,
  "shortDescription": string (1-2 sentences),
  "estimatedTotalHours": number,
  "modules": [
    {
      "title": string,
      "summary": string (1 sentence),
      "order": number,
      "estimatedHours": number,
      "lessons": [
        {
          "title": string,
          "description": string (1-2 sentences),
          "order": number,
          "estimatedHours": number,
          "resources": [
            { "title": string, "url": string (if known or empty), "type": string (video/article/book) }
          ]
        }
      ]
    }
  ],
  "tags": [string]
}

Constraints:
- Produce 4–8 modules for beginner, 3–6 for intermediate, and 2–5 for advanced.
- For each module, include 3–6 lessons.
- Keep each lesson estimatedHours between 0.5 and 6.
- If URLs are not known, leave url as "" but include clear resource titles.
- Output valid JSON only.
`
    
}
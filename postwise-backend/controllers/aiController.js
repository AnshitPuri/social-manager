import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export const analyzeWithAI = async (content) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Analyze the given content and provide insights on sentiment, readability, and engagement potential."
        },
        {
          role: "user",
          content: `Analyze this social media post:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze content with AI');
  }
};


export const generateImprovedCaptions = async (content, tone) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative social media copywriter. Generate 3 improved versions of the given caption in a ${tone} tone. Return JSON array with format: [{"id": 1, "caption": "...", "description": "..."}]`
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate improved captions');
  }
};


export const generateContentIdeas = async (niche, platform) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media strategist. Generate 5 engaging content ideas for ${niche} on ${platform}. Include title, caption, best posting time, and relevant hashtags. Return as JSON array.`
        },
        {
          role: "user",
          content: `Generate content ideas for: ${niche}`
        }
      ],
      temperature: 0.9,
      max_tokens: 1500
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate content ideas');
  }
};

export default {
  analyzeWithAI,
  generateImprovedCaptions,
  generateContentIdeas
};
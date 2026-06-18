import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { prisma } from '@/lib/prisma';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { destination, days, budget, interests } = await req.json();

    const allDestinations = await prisma.destination.findMany({ take: 20 });
    const destinationsContext = allDestinations.map(d => 
      `${d.name} (${d.city}, ${d.state}) - Category: ${d.categories.join(', ')}, Budget: ₹${d.avgBudget}/day. ${d.description}`
    ).join('\n');

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are an expert Indian Travel Itinerary Generator. 
      You are given a destination, trip duration (days), budget category, and interests.
      Generate a realistic, logical, day-by-day itinerary. 
      If the destination matches one of the locations in the provided database, strongly prefer recommending actual attractions from that area.
      
      Database of known destinations:
      ${destinationsContext}
      
      You MUST respond with ONLY a valid JSON object, no extra text before or after. Use this exact structure:
      {
        "title": "Catchy title",
        "description": "Short summary",
        "days": [
          {
            "dayNumber": 1,
            "theme": "Theme of the day",
            "activities": [
              {
                "time": "09:00 AM",
                "title": "Activity name",
                "description": "Details",
                "costEstimate": 500
              }
            ]
          }
        ]
      }`,
      prompt: `Create a ${days}-day itinerary for ${destination}. Budget level: ${budget}. Key interests: ${interests.join(', ')}. Respond with ONLY valid JSON.`,
    });

    // Parse the JSON from the text response
    const text = result.text.trim();
    // Extract JSON if wrapped in code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const jsonStr = (jsonMatch[1] || text).trim();
    const data = JSON.parse(jsonStr);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Itinerary API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred during itinerary generation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

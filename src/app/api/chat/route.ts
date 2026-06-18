import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { mockDestinations, mockUsers } from '@/lib/mock-data';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use mock data for AI context to avoid database cold-start timeouts
    const allDestinations = mockDestinations.slice(0, 20);
    const allGuides = mockUsers.filter(u => u.role === 'guide' || (u.role as string) === 'GUIDE').slice(0, 20);

    // Prepare context from our mock data to make the AI smart
    const destinationsContext = allDestinations.map(d => 
      `${d.name} (${d.city}, ${d.state}) - Category: ${d.categories.join(', ')}, Budget: ₹${d.avgBudget}/day. ${d.description}`
    ).join('\n');

    const guidesContext = allGuides.map(g => 
      `${g.profile?.firstName} ${g.profile?.lastName} in ${g.profile?.location}. Specializes in: ${g.guideProfile?.specializations.join(', ')}. Rate: ₹${g.guideProfile?.pricePerHour}/hr.`
    ).join('\n');

    const systemPrompt = `
      You are the TourMate AI Assistant, a friendly and expert travel companion for exploring India.
      Your goal is to recommend highly personalized local travel experiences, hidden gems, and verified student guides.
      You should be concise, helpful, and enthusiastic. Use formatting (bolding, lists) to make your responses easy to read.
      
      Here is the current database of destinations available on the platform:
      ${destinationsContext}
      
      Here is the current database of verified student guides available on the platform:
      ${guidesContext}
      
      Instructions:
      1. When a user asks for recommendations, ONLY recommend destinations or guides from the provided database context above.
      2. If the user asks for something not in the database, politely explain that you are currently focused on a select group of curated experiences, but recommend the closest match.
      3. Always encourage users to book a verified student guide for an authentic local experience.
    `;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred during chat processing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

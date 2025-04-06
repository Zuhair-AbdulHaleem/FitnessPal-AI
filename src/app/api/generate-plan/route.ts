import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const prompt = `Create a detailed fitness and nutrition plan based on the following information:

Personal Information:
- Age: ${body.age}
- Gender: ${body.gender}
- Height: ${body.height}cm
- Weight: ${body.weight}kg

Fitness Goals:
- Primary Goal: ${body.goal}
- Activity Level: ${body.activityLevel}
- Workout Experience: ${body.workoutExperience}
- Available Time: ${body.availableTime} minutes
- Equipment: ${body.equipment?.join(', ') || 'None specified'}

Diet Preferences: ${body.dietPreferences?.join(', ') || 'None specified'}

Please provide a comprehensive plan that includes:
1. A detailed weekly workout schedule with specific exercises, sets, reps, and rest periods
2. A daily meal plan with specific foods and portion sizes
3. General nutrition guidelines and recommendations
4. Tips for staying motivated and tracking progress
5. Any additional recommendations based on the provided information

Format the response in a clear, easy-to-follow structure with sections and bullet points where appropriate.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const plan = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
} 
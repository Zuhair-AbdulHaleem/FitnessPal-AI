import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const {
      age,
      gender,
      heightFeet,
      heightInches,
      weight,
      goal,
      activityLevel,
      workoutExperience,
      availableTime,
      dietaryRestrictions,
      equipment,
      dietPreferences,
      availableCookTime,
      additionalNotes,
    } = await request.json();

    // Convert height to cm for the prompt
    const heightInCm = Math.round((Number(heightFeet) * 30.48) + (Number(heightInches) * 2.54));

    const prompt = `Create a personalized fitness and nutrition plan for a ${age}-year-old ${gender} with the following details:

Physical Profile:
- Height: ${heightFeet}'${heightInches}" (${heightInCm} cm)
- Weight: ${weight} kg
- Fitness Goal: ${goal.replace('_', ' ')}
- Activity Level: ${activityLevel.replace('_', ' ')}
- Workout Experience: ${workoutExperience}

Time & Equipment:
- Available Workout Time: ${availableTime}
- Available Cooking Time: ${availableCookTime}
- Available Equipment: ${equipment.length ? equipment.join(', ') : 'No equipment'}

Dietary Information:
- Dietary Restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'None'}
- Diet Preferences: ${dietPreferences.length ? dietPreferences.join(', ') : 'No specific preferences'}

Additional Notes:
${additionalNotes}

Please provide a comprehensive plan including:
1. A detailed workout routine with specific exercises, sets, reps, and rest periods
2. A nutrition plan with meal suggestions and timing
3. Weekly schedule breakdown
4. Tips for progression and maintaining motivation

Format the response with clear sections and bullet points for easy reading.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return NextResponse.json({ plan: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
} 
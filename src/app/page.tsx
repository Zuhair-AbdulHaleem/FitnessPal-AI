'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  heightFeet: z.string().min(1, "Please select feet"),
  heightInches: z.string().min(1, "Please select inches"),
  weight: z.number().min(30).max(300),
  goal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'endurance']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  dietaryRestrictions: z.array(z.string()),
  workoutExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  availableTime: z.string().min(1, "Please select workout time"),
  equipment: z.array(z.string()),
  dietPreferences: z.array(z.string()),
  availableCookTime: z.string().min(1, "Please select cooking time"),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      gender: undefined,
      heightFeet: '',
      heightInches: '',
      weight: undefined,
      goal: undefined,
      activityLevel: undefined,
      workoutExperience: undefined,
      availableTime: '',
      dietaryRestrictions: [],
      equipment: [],
      dietPreferences: [],
      availableCookTime: '',
      additionalNotes: '',
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          additionalNotes: data.additionalNotes || 'No additional notes provided',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const result = await response.json();
      setPlan(result.plan);
    } catch (error) {
      console.error('Error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!planRef.current) return;
    
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = planRef.current;
      
      const opt = {
        margin: 1,
        filename: 'fitness-plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const dietOptions = [
    'vegetarian',
    'vegan',
    'gluten_free',
    'dairy_free',
    'low_carb',
    'high_protein',
    'mediterranean',
    'keto',
    'paleo',
    'none'
  ];

  const workoutTimeOptions = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes',
    '120 minutes',
  ];

  const cookingTimeOptions = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes',
    '120 minutes',
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Personalized Fitness Journey Starts Here
          </h1>
          <p className="text-xl text-gray-600">
            Answer a few questions to get your custom fitness and nutrition plan
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Age</label>
                        <input
                          type="number"
                          {...register('age', { 
                            valueAsNumber: true,
                            required: true 
                          })}
                          placeholder="Enter your age"
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        {errors.age && (
                          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Gender</label>
                        <select
                          {...register('gender', { required: true })}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Height</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <select
                              {...register('heightFeet')}
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                              <option value="">Feet</option>
                              {[4, 5, 6, 7].map(feet => (
                                <option key={feet} value={feet.toString()}>{feet} ft</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <select
                              {...register('heightInches')}
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                              <option value="">Inches</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i.toString()}>{i} in</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {(errors.heightFeet || errors.heightInches) && (
                          <p className="text-red-500 text-sm mt-1">Please select both feet and inches</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          {...register('weight', { 
                            valueAsNumber: true,
                            required: true 
                          })}
                          placeholder="Enter your weight"
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        {errors.weight && (
                          <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Fitness Goals</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Primary Goal</label>
                        <select
                          {...register('goal')}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Goal</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="endurance">Endurance</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Activity Level</label>
                        <select
                          {...register('activityLevel')}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Activity Level</option>
                          <option value="sedentary">Sedentary</option>
                          <option value="light">Light</option>
                          <option value="moderate">Moderate</option>
                          <option value="active">Active</option>
                          <option value="very_active">Very Active</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Workout Experience</label>
                        <select
                          {...register('workoutExperience')}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Experience Level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Available Workout Time</label>
                        <select
                          {...register('availableTime')}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Workout Time</option>
                          {workoutTimeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {errors.availableTime && (
                          <p className="text-red-500 text-sm mt-1">{errors.availableTime.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Available Cooking Time</label>
                        <select
                          {...register('availableCookTime')}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Cooking Time</option>
                          {cookingTimeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-4">Diet Preferences</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {dietOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          {...register('dietPreferences')}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Additional Notes or Preferences
                  </label>
                  <textarea
                    {...register('additionalNotes')}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 min-h-[100px]"
                    placeholder="Any other preferences, health conditions, or specific goals you'd like to mention..."
                  />
                </div>

                <div className="flex justify-center mt-8">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Plan'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div ref={planRef}>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Your Personalized Fitness Journey
                  </h2>
                  <div className="max-w-2xl mx-auto">
                    <p className="text-xl text-gray-600 mb-4">Based on your profile:</p>
                    <div className="grid grid-cols-2 gap-4 text-left bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div>
                        <p className="text-gray-700"><span className="font-medium">Age:</span> {watch('age')} years</p>
                        <p className="text-gray-700"><span className="font-medium">Gender:</span> {watch('gender')}</p>
                        <p className="text-gray-700">
                          <span className="font-medium">Height:</span> {watch('heightFeet')} ft {watch('heightInches')} in
                        </p>
                        <p className="text-gray-700"><span className="font-medium">Weight:</span> {watch('weight')} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-700"><span className="font-medium">Goal:</span> {watch('goal')?.replace('_', ' ')}</p>
                        <p className="text-gray-700"><span className="font-medium">Activity Level:</span> {watch('activityLevel')?.replace('_', ' ')}</p>
                        <p className="text-gray-700"><span className="font-medium">Experience:</span> {watch('workoutExperience')}</p>
                        <p className="text-gray-700"><span className="font-medium">Available Time:</span> {watch('availableTime')}</p>
                        <p className="text-gray-700"><span className="font-medium">Cooking Time:</span> {watch('availableCookTime')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  {plan.split('\n\n').map((section, index) => {
                    if (!section.trim()) return null;

                    const isHeader = section.startsWith('#') || 
                      section.startsWith('Exercise Plan') || 
                      section.startsWith('Nutrition Plan') || 
                      section.startsWith('Weekly Schedule') ||
                      section.startsWith('Diet Plan');

                    return (
                      <div 
                        key={index} 
                        className={`mb-8 p-6 rounded-xl border ${
                          index % 2 === 0 
                            ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100' 
                            : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100'
                        }`}
                      >
                        {section.split('\n').map((line, lineIndex) => {
                          // Handle headers
                          if (line.startsWith('#') || isHeader) {
                            const headerText = line.replace(/^#+\s*/, '');
                            return (
                              <div key={lineIndex} className="flex items-center space-x-3 mb-6">
                                {headerText.toLowerCase().includes('exercise') && (
                                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                  </svg>
                                )}
                                {headerText.toLowerCase().includes('nutrition') && (
                                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                  </svg>
                                )}
                                {headerText.toLowerCase().includes('schedule') && (
                                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                                {headerText.toLowerCase().includes('diet') && (
                                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {headerText.toLowerCase().includes('cardio') && (
                                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                )}
                                {headerText.toLowerCase().includes('strength') && (
                                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                )}
                                {headerText.toLowerCase().includes('tips') && (
                                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                )}
                                <h3 className="text-xl font-semibold text-indigo-600">
                                  {headerText}
                                </h3>
                              </div>
                            );
                          }
                          // Handle bullet points
                          else if (line.startsWith('-') || line.startsWith('*')) {
                            return (
                              <div key={lineIndex} className="flex items-start space-x-3 mb-3 group hover:bg-white/50 p-2 rounded-lg transition-colors">
                                <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mt-2 group-hover:scale-110 transition-transform"></div>
                                <p className="text-gray-700">{line.replace(/^[-*]\s*/, '')}</p>
                              </div>
                            );
                          }
                          // Handle numbered lists
                          else if (/^\d+\./.test(line)) {
                            return (
                              <div key={lineIndex} className="flex items-start space-x-3 mb-3 group hover:bg-white/50 p-2 rounded-lg transition-colors">
                                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  {line.match(/^\d+/)[0]}
                                </span>
                                <p className="text-gray-700">{line.replace(/^\d+\.\s*/, '')}</p>
                              </div>
                            );
                          }
                          // Regular text
                          else if (line.trim()) {
                            return (
                              <p key={lineIndex} className="text-gray-700 mb-3 hover:bg-white/50 p-2 rounded-lg transition-colors">
                                {line}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  onClick={() => setPlan(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Generate New Plan
                </motion.button>

                <motion.button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  goal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'endurance']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  dietaryRestrictions: z.array(z.string()),
  workoutExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  availableTime: z.number().min(30).max(300),
  equipment: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

export default function GeneratePlanPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setPlan(result.plan);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: 'Personal Information',
      fields: [
        { name: 'age', label: 'Age', type: 'number' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
        { name: 'height', label: 'Height (cm)', type: 'number' },
        { name: 'weight', label: 'Weight (kg)', type: 'number' },
      ],
    },
    {
      title: 'Fitness Goals',
      fields: [
        { name: 'goal', label: 'Primary Goal', type: 'select', options: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'] },
        { name: 'activityLevel', label: 'Activity Level', type: 'select', options: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
        { name: 'workoutExperience', label: 'Workout Experience', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      ],
    },
    {
      title: 'Preferences',
      fields: [
        { name: 'availableTime', label: 'Available Time per Session (minutes)', type: 'number' },
        { name: 'equipment', label: 'Available Equipment', type: 'multiselect', options: ['dumbbells', 'barbell', 'kettlebell', 'resistance_bands', 'yoga_mat', 'none'] },
        { name: 'dietaryRestrictions', label: 'Dietary Restrictions', type: 'multiselect', options: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'none'] },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Generate Your Plan</h1>
      
      <AnimatePresence mode="wait">
        {!plan ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-xl p-6"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between mb-6">
                {steps.map((s, index) => (
                  <div
                    key={s.title}
                    className={`flex items-center ${
                      index + 1 === step ? 'text-purple-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index + 1 === step
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-2">{s.title}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {steps[step - 1].fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        {...register(field.name as keyof FormData)}
                        className="w-full p-2 border rounded-md"
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'multiselect' ? (
                      <div className="grid grid-cols-2 gap-2">
                        {field.options?.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              value={option}
                              {...register(field.name as keyof FormData)}
                              className="rounded"
                            />
                            <span>{option.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        {...register(field.name as keyof FormData, { valueAsNumber: field.type === 'number' })}
                        className="w-full p-2 border rounded-md"
                      />
                    )}
                    {errors[field.name as keyof FormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 bg-gray-200 rounded-md"
                  >
                    Previous
                  </button>
                )}
                {step < steps.length ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:opacity-50"
                  >
                    {isLoading ? 'Generating...' : 'Generate Plan'}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Your Personalized Plan</h2>
            <div className="prose max-w-none">
              {plan.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <button
              onClick={() => setPlan(null)}
              className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
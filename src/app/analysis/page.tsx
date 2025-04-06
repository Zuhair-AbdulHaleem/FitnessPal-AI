'use client';

import { motion } from 'framer-motion';

export default function Analysis() {
  const progressData = [
    { month: 'Jan', weight: 80, target: 75 },
    { month: 'Feb', weight: 78, target: 75 },
    { month: 'Mar', weight: 76, target: 75 },
    { month: 'Apr', weight: 75, target: 75 },
  ];

  const stats = [
    { title: 'Average Workout Duration', value: '45 min', trend: '+5%' },
    { title: 'Calories Burned', value: '12,500', trend: '+8%' },
    { title: 'Workouts Completed', value: '48', trend: '+12%' },
    { title: 'Success Rate', value: '92%', trend: '+3%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Progress Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
          <div className="h-64">
            {/* Placeholder for chart - you can integrate a charting library here */}
            <div className="flex items-end h-48 space-x-4">
              {progressData.map((data) => (
                <div key={data.month} className="flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-full bg-purple-500 rounded-t"
                      style={{ height: `${(data.weight / 80) * 100}%` }}
                    />
                    <div className="mt-2 text-sm">{data.month}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.title} className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <span className="text-green-500 font-semibold">{stat.trend}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Increase cardio sessions to 4 times per week
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Add more protein to your diet
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Consider adding HIIT workouts
          </li>
        </ul>
      </motion.div>
    </div>
  );
} 
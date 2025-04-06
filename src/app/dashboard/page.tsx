'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const metrics = [
    { title: 'Current Plan', value: 'Active', color: 'bg-green-500' },
    { title: 'Workouts Completed', value: '12', color: 'bg-blue-500' },
    { title: 'Calories Burned', value: '2,450', color: 'bg-purple-500' },
    { title: 'Progress', value: '75%', color: 'bg-yellow-500' },
  ];

  const quickActions = [
    { title: 'Generate New Plan', path: '/generate-plan', icon: '📝' },
    { title: 'View Progress', path: '/analysis', icon: '📊' },
    { title: 'Update Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 ${metric.color} rounded-full mr-3`} />
              <h3 className="text-gray-500 text-sm">{metric.title}</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href={action.path}
              className="block bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{action.icon}</span>
                <h3 className="text-lg font-semibold">{action.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
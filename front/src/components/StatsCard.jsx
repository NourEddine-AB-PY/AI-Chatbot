import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function StatsCard({ icon, value, label, trend, trendValue, color }) {
  const colorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
  };
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center border border-gray-700 hover:shadow-2xl transition-shadow duration-200"
    >
      <span className="text-4xl mb-2">{icon}</span>
      <div className={`text-2xl font-bold ${colorMap[color] || 'text-blue-400'}`}>{value} <span className="text-base ml-1">{trendValue}</span></div>
      <div className="text-gray-300">{label}</div>
    </motion.div>
  );
}

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  trend: PropTypes.string,
  trendValue: PropTypes.string,
  color: PropTypes.string,
}; 
import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTest } from '../../context/TestContext';

const Timer: React.FC = () => {
  const { timeRemaining, decrementTime, isTestStarted, isTestComplete } = useTest();

  useEffect(() => {
    if (isTestStarted && !isTestComplete) {
      const timer = setInterval(() => {
        decrementTime();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTestStarted, isTestComplete, decrementTime]);

  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Determine timer color based on time remaining
  let timerColor = 'text-gray-700';
  if (timeRemaining < 300) { // Less than 5 minutes
    timerColor = 'text-red-600';
  } else if (timeRemaining < 600) { // Less than 10 minutes
    timerColor = 'text-orange-500';
  }

  return (
    <div className={`flex items-center ${timerColor} font-medium`}>
      <Clock size={18} className="mr-2" />
      <span className="tabular-nums">{formattedTime}</span>
    </div>
  );
};

export default Timer;
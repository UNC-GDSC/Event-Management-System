import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FiSun className="text-xl text-yellow-500" />
      ) : (
        <FiMoon className="text-xl text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeToggle;

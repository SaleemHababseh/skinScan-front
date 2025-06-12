import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../store/theme-store';
import Button from './Button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 h-9 p-0 rounded-full"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;

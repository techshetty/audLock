import { Lock,Sun,Moon,Github} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Header=()=>{
    const {darkMode,setDarkMode,themeClasses}=useTheme();
    return( <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${themeClasses.headerBg} ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>
                  AUDLOCK
                </h1>
                <p className={`text-xs ${themeClasses.textMuted} -mt-1`}>
                  Hide in plain sound
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <a
                href="https://github.com/techshetty"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>);
}
export default Header;
import { useTheme } from "../context/ThemeContext";

const Footer=()=>{
    const {themeClasses}=useTheme();
    return (
        <footer className={`mt-16 py-8 border-t ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={themeClasses.textMuted}>
            Built with ❤️ by @techshetty
          </p>
        </div>
      </footer>
    )
}
export default Footer;
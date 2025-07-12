import { useTheme } from "../context/ThemeContext";

const BG=()=>{
    return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Cursor Trail */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-purple-500 rounded-full absolute top-0.5 left-0.5 animate-pulse"></div>
            </div>
            
            {/* Floating Dots */}
            <div className="absolute top-16 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-24 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-16 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-24 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
              <path
                d="M50,50 Q150,20 250,50 T450,50"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M100,80 Q200,40 300,80 T500,80"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
                style={{animationDelay: '1s'}}
              />
            </svg>
            
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-0 left-1/4 text-green-500 text-xs font-mono animate-pulse" style={{animationDelay: '0s'}}>
                01010100
              </div>
              <div className="absolute top-8 right-1/4 text-blue-500 text-xs font-mono animate-pulse" style={{animationDelay: '0.7s'}}>
                11001010
              </div>
              <div className="absolute bottom-12 left-1/3 text-purple-500 text-xs font-mono animate-pulse" style={{animationDelay: '1.4s'}}>
                10101100
              </div>
              <div className="absolute bottom-4 right-1/3 text-cyan-500 text-xs font-mono animate-pulse" style={{animationDelay: '2.1s'}}>
                01110001
              </div>
            </div>
          </div>
    )
}
export default BG;
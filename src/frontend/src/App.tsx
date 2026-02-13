import { useState, useEffect, useRef } from 'react';
import FloatingHeartsBackground from './components/FloatingHeartsBackground';
import MovingNoButton from './components/MovingNoButton';
import FireworksOverlay from './components/FireworksOverlay';
import { Button } from './components/ui/button';
import { Heart } from 'lucide-react';

function App() {
  const [yesClicked, setYesClicked] = useState(false);
  const [noMessage, setNoMessage] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = 'Open At Your Own Risk';
  }, []);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (fireworksTimeoutRef.current) {
        clearTimeout(fireworksTimeoutRef.current);
      }
    };
  }, []);

  const handleYesClick = () => {
    setYesClicked(true);
    setShowFireworks(true);
    // Stop fireworks after 10 seconds (increased from 5)
    fireworksTimeoutRef.current = setTimeout(() => {
      setShowFireworks(false);
      fireworksTimeoutRef.current = null;
    }, 10000);
  };

  const handleNoMove = (message: string) => {
    setNoMessage(message);
  };

  if (yesClicked) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingHeartsBackground />
        {showFireworks && <FireworksOverlay intensity="high" />}
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <div className="max-w-2xl w-full text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-valentine-primary animate-pulse">
              Yayyyyy!! I knew it — you will say YES to me! 💖
            </h1>
            
            <div className="mt-12">
              <img 
                src="/assets/generated/couple-sunset-hug.dim_1600x900.png" 
                alt="Romantic couple at sunset"
                className="w-full max-w-xl mx-auto rounded-3xl shadow-2xl"
              />
            </div>
            
            <div className="mt-8 space-y-4 text-lg md:text-xl text-valentine-text">
              <p className="font-medium">
                Ab after all aap ne YES keh diya hai… so where are my chocolates?? 🍫
              </p>
              <p className="text-2xl font-bold text-valentine-primary">
                LOVE YOU MR. SELF OBSESSED ❤️❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingHeartsBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Title with animated hearts */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 animate-bounce-slow">
              <Heart className="w-8 h-8 fill-valentine-heart text-valentine-heart" />
            </div>
            <div className="absolute -top-6 -right-2 animate-pulse-slow">
              <Heart className="w-6 h-6 fill-valentine-heart text-valentine-heart" />
            </div>
            <div className="absolute -bottom-2 -left-6 animate-wiggle">
              <Heart className="w-7 h-7 fill-valentine-heart text-valentine-heart" />
            </div>
            <div className="absolute -bottom-4 -right-4 animate-bounce-slow delay-300">
              <Heart className="w-8 h-8 fill-valentine-heart text-valentine-heart" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-valentine-primary tracking-tight px-8">
              KONAIN
            </h1>
          </div>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl font-semibold text-valentine-text mt-8">
            Will you be my Valentine? ❤️
          </h2>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 relative min-h-[60px]">
            <Button
              onClick={handleYesClick}
              size="lg"
              className="bg-valentine-yes hover:bg-valentine-yes-hover text-white font-bold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              YES
            </Button>
            
            <MovingNoButton onMove={handleNoMove} />
          </div>

          {/* Message area */}
          {noMessage && (
            <div className="mt-6 min-h-[40px] flex items-center justify-center">
              <p className="text-lg md:text-xl font-medium text-valentine-primary animate-fade-in">
                {noMessage}
              </p>
            </div>
          )}

          {/* Extra cute text */}
          <div className="mt-12 px-4">
            <p className="text-base md:text-lg text-valentine-text leading-relaxed">
              MR. SELF OBSESSED, wese Valentines ki zaroorat nahi hoti, hamari vibe match hoti hai aur aap ke sath har din special hota hai — lekin phir bhi aaj extra special bananay ke liye 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

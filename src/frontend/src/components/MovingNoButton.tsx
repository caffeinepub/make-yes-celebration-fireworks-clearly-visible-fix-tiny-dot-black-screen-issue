import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';

const MESSAGES = [
  'Try again Janaab',
  'Nah itni asaani sy thori choru gi',
  'Allah Mr. Self Obsessed itny nakhry?',
  'Kis baat ka attitude hai?',
  'Ufff seriously? Again NO???',
  'Ab zyada ho raha hai, My Love!',
  'Try Againnn!',
  'Hahah kachi goliya nahi kheli mainy',
  'Nah yahan koi Nooo nahi hai',
  'Achaa idhr to aaye na!',
];

interface MovingNoButtonProps {
  onMove: (message: string) => void;
}

export default function MovingNoButton({ onMove }: MovingNoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messageIndex, setMessageIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const moveButton = useCallback(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe bounds (keep button fully visible)
    const maxX = viewportWidth - buttonRect.width - 40;
    const maxY = viewportHeight - buttonRect.height - 40;
    const minX = 40;
    const minY = 40;
    
    // Generate random position within safe bounds
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;
    
    setPosition({ x: newX, y: newY });
    
    // Update message
    const nextIndex = (messageIndex + 1) % MESSAGES.length;
    setMessageIndex(nextIndex);
    onMove(MESSAGES[nextIndex]);
  }, [messageIndex, onMove]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    moveButton();
  };

  return (
    <Button
      ref={buttonRef}
      onMouseEnter={moveButton}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      onClick={handleInteraction}
      size="lg"
      variant="outline"
      className="bg-valentine-no hover:bg-valentine-no-hover text-valentine-no-text font-bold text-xl px-12 py-6 rounded-full shadow-lg border-2 border-valentine-no-border transition-all duration-200"
      style={{
        position: position.x || position.y ? 'fixed' : 'relative',
        left: position.x ? `${position.x}px` : 'auto',
        top: position.y ? `${position.y}px` : 'auto',
        zIndex: 20,
      }}
    >
      NO
    </Button>
  );
}

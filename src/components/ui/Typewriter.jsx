import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

export default function Typewriter({
  words = [],
  typeSpeed = 75,
  deleteSpeed = 40,
  pauseAfterType = 1600,
  pauseAfterDelete = 300,
  className,
  cursorClassName,
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    if (!words.length) return;
    const word = words[index];
    let timer;

    if (phase === 'typing') {
      if (text.length < word.length) {
        timer = setTimeout(
          () => setText(word.slice(0, text.length + 1)),
          typeSpeed,
        );
      } else {
        timer = setTimeout(() => setPhase('deleting'), pauseAfterType);
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(
          () => setText(word.slice(0, text.length - 1)),
          deleteSpeed,
        );
      } else {
        timer = setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setPhase('typing');
        }, pauseAfterDelete);
      }
    }

    return () => clearTimeout(timer);
  }, [
    text,
    phase,
    index,
    words,
    typeSpeed,
    deleteSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  return (
    <span className={cn('inline-flex items-baseline', className)}>
      <span>{text}</span>
      <span
        aria-hidden
        className={cn(
          'ml-1 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-accent-from',
          'animate-pulse',
          cursorClassName,
        )}
      />
    </span>
  );
}

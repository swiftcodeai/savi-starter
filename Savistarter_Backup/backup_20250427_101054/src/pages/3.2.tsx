import React, { useEffect, useState, useRef } from "react";
import LessonLayout from "@/components/LessonLayout";
import { LessonSequence } from "@/App";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import LessonInstructionsPopup from '@/components/LessonInstructionsPopup';

const GRID_ROWS = 8;
const GRID_COLS = 12;
const FADE_INTERVAL = 700; // ms
const ROUNDS = 4;

const getInitialBlocks = () => {
  const blocks = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blocks.push({
        id: `${row}-${col}`,
        row,
        col,
        faded: false
      });
    }
  }
  return blocks;
};

const getRightSideBlockIds = () => {
  // Rightmost 4 columns
  const ids = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = GRID_COLS - 4; col < GRID_COLS; col++) {
      ids.push(`${row}-${col}`);
    }
  }
  return ids;
};

const BlockGridOverlay = ({ imageUrl, resetKey }) => {
  const [blocks, setBlocks] = useState(getInitialBlocks());

  useEffect(() => {
    setBlocks(getInitialBlocks());
  }, [resetKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prevBlocks) => {
        const unfaded = prevBlocks.filter(b => !b.faded);
        if (unfaded.length === 0) {
          clearInterval(interval);
          return prevBlocks;
        }
        const randomBlock = unfaded[Math.floor(Math.random() * unfaded.length)];
        return prevBlocks.map((b) =>
          b.id === randomBlock.id ? { ...b, faded: true } : b
        );
      });
    }, FADE_INTERVAL);
    return () => clearInterval(interval);
  }, [resetKey]);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video">
      <img
        src={imageUrl}
        alt="Selected"
        className="w-full h-full object-contain rounded-2xl border-4 border-cyan-200 shadow-xl"
      />
      {/* Overlay grid */}
      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`transition-opacity duration-700 bg-cyan-500 border-2 border-white ${block.faded ? 'opacity-0' : 'opacity-100'}`}
            style={{ pointerEvents: 'none', borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
};

// Vocab words and images
const GAME_DATA = [
  { word: "ZERO", image: "/vocab-images/zero.png" },
  { word: "ONE", image: "/vocab-images/one.png" },
  { word: "TWO", image: "/vocab-images/two.png" },
  { word: "THREE", image: "/vocab-images/three.png" },
  { word: "FOUR", image: "/vocab-images/four.png" },
  { word: "FIVE", image: "/vocab-images/five.png" },
  { word: "SIX", image: "/vocab-images/six.png" },
  { word: "HI", image: "/vocab-images/hi.png" },
  { word: "HELLO", image: "/vocab-images/hello.png" },
  { word: "FELIX", image: "/vocab-images/felix.png" },
  { word: "OLA", image: "/vocab-images/ola.png" },
  { word: "MS FINE", image: "/vocab-images/msfine.png" },
];

const generateLetters = (word: string) => {
  const letters = word.split('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const additionalLetters = alphabet
    .filter(letter => !letters.includes(letter))
    .sort(() => Math.random() - 0.5)
    .slice(0, 17 - letters.length);
  return [...letters, ...additionalLetters].sort(() => Math.random() - 0.5);
};

const getRandomIndices = (n: number, max: number) => {
  const indices = Array.from({ length: max }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, n);
};

const WordSpellingGame = () => {
  const { toast } = useToast();
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);
  // Pick 4 random vocab words for the session
  const [roundOrder] = useState(() => getRandomIndices(ROUNDS, GAME_DATA.length));
  const gameData = GAME_DATA[roundOrder[round]];
  const [letters, setLetters] = useState(() => generateLetters(gameData.word));
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setLetters(generateLetters(gameData.word));
    setSelectedLetters([]);
    setRevealed(false);
    setIsComplete(false);
    setResetKey(prev => prev + 1);
  }, [round]);

  useEffect(() => {
    if (selectedLetters.join('') === gameData.word) {
      toast({
        title: "Correct!",
        description: "Well done! You spelled the word correctly!",
      });
      setRevealed(true);
      setIsComplete(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      // Go to next round after a short delay
      setTimeout(() => {
        if (round < ROUNDS - 1) {
          setRound(r => r + 1);
        } else {
          setCompleted(true);
        }
      }, 1800);
    }
  }, [selectedLetters, gameData.word, toast, round]);

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.length < gameData.word.length && !isComplete) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleDeleteLetter = () => {
    if (!isComplete) setSelectedLetters(selectedLetters.slice(0, -1));
  };

  const imageUrl = gameData.image;

  const title = completed ? "You finished all rounds!" : `Round ${round + 1} of ${ROUNDS}`;
  const subtitle = "";

  const handleRestart = () => {
    setRound(0);
    setCompleted(false);
    setLetters(generateLetters(gameData.word));
    setSelectedLetters([]);
    setRevealed(false);
    setIsComplete(false);
    setResetKey(prev => prev + 1);
  };

  return (
    <LessonLayout
      title="Word Spelling Game"
      subtitle="Practice spelling words"
      className="max-w-6xl mx-auto"
      prevPath={LessonSequence["3.1"]}
      nextPath={LessonSequence["3.3"]}
      onRestart={handleRestart}
    >
      <LessonInstructionsPopup
        lessonId="3.2"
        title="Spelling Practice Time!"
        instructions={
          <div>
            <p>Welcome to the Word Spelling Game! Here's how to play:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Look at the image and listen to the word</li>
              <li>Type the correct spelling in the box</li>
              <li>Click 'Check' to see if you're right</li>
              <li>Get hints if you need help</li>
              <li>Practice each word until you get it right</li>
              <li>Move on to the next word when ready</li>
            </ul>
            <p className="mt-4 text-gray-500 italic">Tip: Sound out each word carefully before spelling it!</p>
          </div>
        }
      />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 pb-32">
        {/* Left side - Letter selection */}
        <div className="bg-white rounded-2xl p-10 shadow-2xl flex-1 w-full">
          {completed ? (
            <div className="text-3xl font-bold text-center text-green-600 py-24">🎉 You did it! 🎉</div>
          ) : (
            <>
              {/* Word progress display */}
              <div className="mb-12 flex justify-center gap-4">
                {gameData.word.split('').map((letter, index) => (
                  <div
                    key={`slot-${index}`}
                    className={cn(
                      "w-20 h-20 border-4 rounded-2xl flex items-center justify-center text-4xl font-extrabold",
                      selectedLetters[index] ? "border-cyan-400 bg-cyan-50" : "border-gray-300 bg-gray-50"
                    )}
                  >
                    {selectedLetters[index] || ''}
                  </div>
                ))}
              </div>

              {/* Letter grid */}
              <div className="grid grid-cols-6 gap-4 mb-8">
                {letters.map((letter, index) => (
                  <button
                    key={`letter-${index}`}
                    onClick={() => handleLetterClick(letter)}
                    className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl font-bold hover:bg-yellow-200 transition-colors shadow-md"
                    disabled={isComplete}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Delete button */}
              <div className="flex justify-center mt-6">
                <button
                  className="px-6 py-3 border-2 border-cyan-300 rounded-xl bg-gray-100 hover:bg-cyan-50 text-lg font-semibold shadow"
                  onClick={handleDeleteLetter}
                  disabled={selectedLetters.length === 0 || isComplete}
                >
                  Delete Letter
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right side - Image with blocks */}
        <div className="bg-white rounded-2xl p-10 shadow-2xl flex-1 w-full flex items-center justify-center">
          {imageUrl && <BlockGridOverlay imageUrl={imageUrl} resetKey={resetKey} />}
        </div>
      </div>
    </LessonLayout>
  );
};

export default WordSpellingGame;

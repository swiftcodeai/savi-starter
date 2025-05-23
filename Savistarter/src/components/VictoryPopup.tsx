import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface VictoryPopupProps {
  onClose: () => void;
  message: string;
  nextPath: string;
}

const VictoryPopup: React.FC<VictoryPopupProps> = ({ onClose, message, nextPath }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti when the popup appears
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleContinue = () => {
    onClose();
    navigate(nextPath);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform animate-pop shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-cyan-600 mb-4">Victory! 🎉</h2>
          <p className="text-lg text-gray-700 mb-8">{message}</p>
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg"
          >
            Continue to Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryPopup; 
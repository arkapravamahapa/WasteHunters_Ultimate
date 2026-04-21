import React, { useState } from 'react';
import { PlayCircle, X, CheckCircle, HelpCircle } from 'lucide-react';
// 🌟 Correct relative path: 3 levels up to reach 'src'
import { API_BASE_URL } from '../../../api_config';

const ModuleCard = ({ title, category, desc, videoUrl, quizData, reward, level, duration }) => {
  const [showModal, setShowModal] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClaim = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/claim-tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens: parseInt(reward) }),
        });
        if (res.ok) { 
            setIsCompleted(true); 
            setShowModal(false); 
            setQuizStep(0); 
        }
    } catch (err) {
        console.error("Failed to claim reward:", err);
    }
  };

  const catColor = category === "E-Waste" ? "text-purple-400 bg-purple-400/10" 
                 : category === "Plastic" ? "text-blue-400 bg-blue-400/10"
                 : "text-green-400 bg-green-400/10";

  return (
    <>
      <div onClick={() => !isCompleted && setShowModal(true)} className="bg-dark-800 p-6 rounded-2xl border border-dark-700 hover:border-waste-500 cursor-pointer transition-all h-full flex flex-col shadow-lg hover:shadow-waste-500/10">
        <div className="flex justify-between mb-4">
          <span className={`text-xs font-bold px-2 py-1 rounded ${catColor}`}>{category} | {level}</span>
          <span className="text-waste-500 font-bold text-xs">+{reward} Tokens</span>
        </div>
        <h3 className="text-white font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-1">{desc}</p>
        <button className={`w-full font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isCompleted ? 'bg-waste-500/10 text-waste-500' : 'bg-white text-dark-900'}`}>
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />} {isCompleted ? 'Completed' : 'Start Lesson'}
        </button>
      </div>

      {showModal && quizData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-dark-700 w-full max-w-2xl rounded-3xl overflow-hidden p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">{title}</h2>
              <X className="cursor-pointer text-gray-500 hover:text-white transition-colors" onClick={() => setShowModal(false)} />
            </div>
            
            <div className="aspect-video rounded-xl overflow-hidden border border-dark-700 bg-black">
              <iframe width="100%" height="100%" src={`${videoUrl}?rel=0`} title={title} frameBorder="0" allowFullScreen></iframe>
            </div>

            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
              <div className="flex items-center gap-2 mb-4 text-waste-500">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Knowledge Check</span>
              </div>
              <p className="text-white font-medium mb-4">{quizData[quizStep % quizData.length]?.q}</p>
              <div className="grid grid-cols-1 gap-2">
                {quizData[quizStep % quizData.length]?.options.map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => opt === quizData[quizStep % quizData.length].correct ? setQuizStep(prev => prev + 1) : alert("Try again!")}
                    className="w-full text-left p-3 rounded-xl border border-dark-700 bg-dark-900 text-gray-400 hover:border-gray-500 text-sm transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleClaim} 
              disabled={quizStep < quizData.length} 
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${quizStep >= quizData.length ? 'bg-waste-500 text-dark-900' : 'bg-dark-700 text-gray-500 cursor-not-allowed opacity-50'}`}
            >
              {quizStep >= quizData.length ? "Claim My Tokens" : `Answer more to unlock tokens`}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// 🌟 THE MAGIC LINE: This is what fixes the error!
export default ModuleCard;
import React, { useState, useEffect } from 'react';
import ModuleCard from './components/ModuleCard';
import { Zap, Loader2, X, CheckCircle, Trophy } from 'lucide-react';
import { API_BASE_URL } from '../../api_config';

const EducationPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showMasterclass, setShowMasterclass] = useState(false);
  const [masterclassQuizStep, setMasterclassQuizStep] = useState(0);
  const [masterclassCompleted, setMasterclassCompleted] = useState(false);

  useEffect(() => {
    // 🌟 Using backticks and our global variable
    fetch(`${API_BASE_URL}/api/lessons`)
      .then(res => res.json())
      .then(data => { 
        setLessons(data); 
        setLoading(false); 
      })
      .catch(err => {
        console.error("Error fetching lessons:", err);
        setLoading(false);
      });
  }, []);
  const handleClaimMasterclass = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/claim-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens: 500 }),
    });
    if (res.ok) { 
      setMasterclassCompleted(true); 
      setShowMasterclass(false); 
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* FEATURED MASTERCLASS HEADER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-dark-800 to-dark-900 p-8 md:p-12 border border-dark-700 shadow-xl overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-waste-500">
            <Zap className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">Featured Masterclass</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Masterclass: Precious Metal Recovery</h1>
          <p className="text-gray-400 mb-8 max-w-2xl">Learn the industrial process of extracting gold and silver from high-end motherboards while staying safe from toxic arsenic and lead.</p>
          <button 
            onClick={() => !masterclassCompleted && setShowMasterclass(true)}
            className={`font-bold py-3 px-8 rounded-xl transition-all ${masterclassCompleted ? 'bg-waste-500/20 text-waste-500' : 'bg-white text-dark-900 hover:scale-105'}`}
          >
            {masterclassCompleted ? 'Masterclass Completed' : 'Start Masterclass (+500 Tokens)'}
          </button>
        </div>
      </div>

      {/* MASTERCLASS MODAL */}
      {showMasterclass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95">
          <div className="bg-dark-900 border border-dark-700 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Trophy className="text-yellow-500" /> Advanced Recovery Exam</h2>
              <button onClick={() => setShowMasterclass(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="aspect-video rounded-2xl overflow-hidden border-4 border-dark-700 shadow-2xl bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/nvNbDV1Yu-Q?rel=0" 
                  title="Masterclass Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                <p className="text-white font-medium mb-4">Knowledge Check: Why is it dangerous to crush IC packages to extract copper?</p>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => alert("Try again! Crushing creates dangerous dust.")} className="text-left p-3 rounded-xl border border-dark-700 bg-dark-900 text-gray-400">It's too loud.</button>
                  <button onClick={() => setMasterclassQuizStep(1)} className={`text-left p-3 rounded-xl border transition-all ${masterclassQuizStep === 1 ? 'border-waste-500 bg-waste-500/10 text-waste-500' : 'border-dark-700 bg-dark-900 text-gray-400'}`}>It turns silicon wafers into airborne arsenic dust.</button>
                  <button onClick={() => alert("Try again!")} className="text-left p-3 rounded-xl border border-dark-700 bg-dark-900 text-gray-400">Copper is too soft to crush.</button>
                </div>
              </div>

              <button 
                onClick={handleClaimMasterclass}
                disabled={masterclassQuizStep === 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${masterclassQuizStep === 1 ? 'bg-waste-500 text-dark-900' : 'bg-dark-700 text-gray-500 cursor-not-allowed'}`}
              >
                Claim 500 Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LESSONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-waste-500 w-10 h-10 mb-4" />
            <p className="text-gray-500">Syncing with WasteHunters Database...</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <ModuleCard 
              key={lesson.id}
              title={lesson.title} 
              category={lesson.category}
              desc={lesson.content_summary} 
              videoUrl={lesson.video_url} 
              quizData={lesson.quiz_data}
              reward="50"
              level={lesson.id % 2 === 0 ? "Intermediate" : "Beginner"}
              duration="10 mins"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EducationPage;
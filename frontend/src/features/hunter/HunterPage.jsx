import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import AIAnalysisResult from './components/AIAnalysisResult';
import { Loader2 } from 'lucide-react';

const HunterPage = () => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleCapture = async (imgUrl) => {
    setImage(imgUrl);
    setAnalyzing(true);
    setResult(null);

    try {
        const blob = await (await fetch(imgUrl)).blob();
        const formData = new FormData();
        formData.append('file', blob, 'capture.jpg');

        const response = await fetch('http://127.0.0.1:8000/api/classify', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        if (data.status === "success") {
            // SAFETY CHECK: Ensure Gemini's response is treated as a JavaScript object
            const parsedResult = typeof data.classification === 'string' 
                ? JSON.parse(data.classification) 
                : data.classification;
                
            setResult(parsedResult);
        } else {
            console.error("AI Error:", data.message);
            setResult({ error: "Could not classify item." });
        }
    } catch (error) {
        console.error("Upload failed:", error);
        setResult({ error: "Backend connection failed." });
    } finally {
        setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Hunter Tool</h1>
            <p className="text-gray-400 mt-1">AI-powered e-waste classification using Gemini 3.1 Flash.</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            {!image && (
                <CameraCapture onCapture={handleCapture} />
            )}

            {image && analyzing && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in mt-20">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-dark-700 border-t-waste-500 animate-spin mb-8"></div>
                        <div className="absolute inset-0 flex items-center justify-center -mt-8">
                            <span className="text-xl font-bold text-white">AI</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Analyzing Material...</h2>
                    <p className="text-gray-400 max-w-md">Gemini is identifying components, checking for toxins, and estimating recoverable precious metals.</p>
                </div>
            )}

            {image && !analyzing && result && (
                <AIAnalysisResult 
                    image={image} 
                    result={result} 
                    onReset={handleReset} 
                />
            )}
        </div>
    </div>
  );
};

export default HunterPage;
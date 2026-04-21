import React from 'react';
import { ArrowLeft, Award, Zap, Leaf, ShieldAlert } from 'lucide-react';

const AIAnalysisResult = ({ image, result, onReset }) => {
    if (result.error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center mt-20">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
                <p className="text-gray-400 mb-6">{result.error}</p>
                <button onClick={onReset} className="bg-dark-800 hover:bg-dark-700 text-white font-bold py-2 px-6 rounded-lg transition-colors border border-gray-700">
                    Try Another Scan
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-in slide-in-from-bottom-8 duration-500 pb-10">
            {/* Left Column: The Image */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden border-2 border-dark-700 shadow-xl relative group">
                    <img src={image} alt="Captured Waste" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
                </div>
                
                <button 
                    onClick={onReset} 
                    className="flex items-center justify-center gap-2 w-full bg-dark-800 hover:bg-dark-700 text-white font-bold py-3 px-4 rounded-xl transition-colors border border-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Scan Another Item
                </button>
            </div>

            {/* Right Column: AI Analysis Data */}
            <div className="w-full md:w-2/3 space-y-6">
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-waste-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                    <span className="inline-block bg-waste-500/20 text-waste-500 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3">
                        {result.category || "E-Waste"}
                    </span>
                    <h2 className="text-3xl font-black text-white mb-2">{result.item}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{result.disposal_guide}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-dark-800 p-5 rounded-2xl border border-blue-500/30 flex flex-col justify-center relative overflow-hidden">
                        <Leaf className="absolute right-4 bottom-4 w-12 h-12 text-blue-500/10" />
                        <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Carbon Offset</h4>
                        <p className="text-3xl font-black text-white">
                            {result.carbon_saved || "0"} <span className="text-sm font-normal text-gray-400">kg CO₂</span>
                        </p>
                    </div>

                    <div className="bg-dark-800 p-5 rounded-2xl border border-waste-500/30 flex flex-col justify-center relative overflow-hidden">
                        <Award className="absolute right-4 bottom-4 w-12 h-12 text-waste-500/10" />
                        <h4 className="text-waste-500 text-xs font-bold uppercase tracking-wider mb-2">Reward Value</h4>
                        <p className="text-3xl font-black text-white flex items-center gap-2">
                            +{result.tokens || "10"} <span className="text-sm font-normal text-gray-400">Tokens</span>
                        </p>
                    </div>
                </div>

                {result.materials && result.materials.length > 0 && (
                    <div className="bg-[#0b1120] p-6 rounded-2xl border border-yellow-500/30 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-white font-bold text-lg">Recoverable Materials</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {result.materials.map((mat, index) => (
                                <div key={index} className="bg-dark-800 border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <span className="text-gray-300 font-bold text-sm">{mat.name}</span>
                                    <span className="text-yellow-500 font-black text-sm">{mat.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🌟 FIXED: Added onClick to navigate to your map */}
                <button 
                    onClick={() => window.location.href = '/live-map'}
                    className="w-full bg-waste-500 hover:bg-emerald-500 text-dark-900 font-black text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                >
                    Find Drop-off Hub to Claim Tokens
                </button>
            </div>
        </div>
    );
};

export default AIAnalysisResult;
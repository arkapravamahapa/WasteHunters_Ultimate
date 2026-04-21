import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Zap, X, Image as ImageIcon } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null); // Reference for the hidden file input
    
    const [stream, setStream] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // 1. Handle File Upload from Computer
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onCapture(reader.result); // Sends the Base64 image back to HunterPage
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Start the Live Webcam
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" },
                audio: false 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Please allow camera permissions or upload a file instead.");
        }
    };

    // 3. Snap Photo from Video Stream
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = canvas.toDataURL('image/jpeg');
            stopCamera();
            onCapture(imageData);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    useEffect(() => {
        return () => stopCamera();
    }, [stream]);

    return (
        <div className="w-full max-w-2xl mx-auto h-[500px] bg-dark-800 rounded-3xl border-2 border-dark-700 flex flex-col items-center justify-center relative overflow-hidden">
            
            {!isCameraOpen ? (
                // 🌟 INITIAL STATE: CHOICE BETWEEN CAMERA OR UPLOAD
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 w-full h-full">
                    
                    {/* OPTION 1: OPEN CAMERA */}
                    <button 
                        onClick={startCamera}
                        className="flex flex-col items-center justify-center gap-4 bg-dark-900/50 border border-gray-700 rounded-2xl hover:border-waste-500 hover:bg-waste-500/5 transition-all group"
                    >
                        <div className="w-16 h-16 bg-waste-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-waste-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">Live Scan</h3>
                            <p className="text-gray-500 text-xs mt-1">Use your webcam</p>
                        </div>
                    </button>

                    {/* OPTION 2: UPLOAD FROM COMPUTER */}
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="flex flex-col items-center justify-center gap-4 bg-dark-900/50 border border-gray-700 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">Upload File</h3>
                            <p className="text-gray-500 text-xs mt-1">Select from computer</p>
                        </div>
                        {/* Hidden Input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                        />
                    </button>
                    
                </div>
            ) : (
                // 🌟 CAMERA OPEN STATE
                <div className="w-full h-full relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    
                    {/* Back/Close Button */}
                    <button 
                        onClick={stopCamera}
                        className="absolute top-4 right-4 z-10 bg-dark-900/80 p-2 rounded-full text-white border border-white/10 hover:bg-red-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Viewfinder Overlay */}
                    <div className="absolute inset-0 border-[60px] border-dark-900/40 pointer-events-none">
                        <div className="w-full h-full border-2 border-waste-500/30 rounded-xl relative">
                            <Zap className="absolute top-2 left-2 w-4 h-4 text-yellow-400" />
                        </div>
                    </div>

                    {/* Capture Button */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <button 
                            onClick={capturePhoto}
                            className="w-20 h-20 bg-white rounded-full border-8 border-waste-500/20 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <div className="w-14 h-14 bg-waste-500 rounded-full border-4 border-white shadow-inner"></div>
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden canvas for snapshotting */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default CameraCapture;
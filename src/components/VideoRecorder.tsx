
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, X } from "lucide-react";

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob) => void;
  maxDuration?: number; // In seconds
}

const VideoRecorder = ({ 
  onRecordingComplete,
  maxDuration = 120 // Default 2 minutes
}: VideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
        onRecordingComplete(blob);
        
        // Clear the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start the timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => {
          if (prevTime >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prevTime + 1;
        });
      }, 1000);
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Could not access camera or microphone. Please ensure you've granted permission.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    
    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };
  
  const resetRecording = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    setError(null);
    
    // Make sure stream is cleared
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
          {error}
        </div>
      )}
      
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative mb-4">
        {recordedVideo ? (
          <video 
            src={recordedVideo} 
            controls 
            className="w-full h-full object-cover"
          />
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full flex items-center">
            <span className="animate-pulse mr-1 h-2 w-2 bg-white rounded-full inline-block"></span>
            <span>{formatTime(recordingTime)} / {formatTime(maxDuration)}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 mt-2">
        {!isRecording && !recordedVideo && (
          <Button 
            onClick={startRecording}
            className="flex items-center gap-2"
          >
            <Camera size={16} />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="flex items-center gap-2"
          >
            <X size={16} />
            Stop Recording
          </Button>
        )}
        
        {recordedVideo && (
          <Button 
            onClick={resetRecording}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Video size={16} />
            Record Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;

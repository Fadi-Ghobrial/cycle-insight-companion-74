
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { LHTestResult, FertilityData } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Upload } from 'lucide-react';
import { format } from 'date-fns';

export const OvulationTestScanner: React.FC = () => {
  const { addFertilityData } = useAppStore();
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<LHTestResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock function to analyze the test image
  const analyzeTest = (imageData: string): Promise<LHTestResult> => {
    return new Promise((resolve) => {
      // In a real implementation, this would use image processing or ML
      // For demo purposes, we'll just return a random result
      setProcessing(true);
      
      setTimeout(() => {
        const results = [LHTestResult.NEGATIVE, LHTestResult.POSITIVE, LHTestResult.HIGH, LHTestResult.PEAK];
        const randomIndex = Math.floor(Math.random() * results.length);
        resolve(results[randomIndex]);
        setProcessing(false);
      }, 2000);
    });
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        
        // Analyze the test
        analyzeTest(event.target.result as string).then(result => {
          setResult(result);
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle camera capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const capturedImage = canvas.toDataURL('image/png');
        setImage(capturedImage);
        
        // Stop the camera
        stopCamera();
        
        // Analyze the test
        analyzeTest(capturedImage).then(result => {
          setResult(result);
        });
      }
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Save the test result
  const saveResult = () => {
    if (!result) return;
    
    // Add fertility data with test result
    const fertilityData: Omit<FertilityData, 'id'> = {
      userId: 'guest', // This would be the actual user ID in a real app
      cycleId: 'current', // This would be the actual cycle ID
      ovulationTestResult: result,
      date: new Date(),
      notes: `LH test result: ${result}`
    };
    
    addFertilityData(fertilityData);
    
    toast({
      title: "Test Saved",
      description: `Your ${result} LH test result has been saved.`
    });
    
    // Reset the scanner
    setImage(null);
    setResult(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ovulation Test Scanner</CardTitle>
        <CardDescription>
          Scan your LH test strips to track your ovulation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Test scanning area */}
          <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${image || cameraActive ? 'h-64' : 'h-40'}`}>
            {cameraActive ? (
              // Camera view
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="h-full w-full object-cover"
              />
            ) : image ? (
              // Uploaded or captured image
              <img 
                src={image} 
                alt="LH Test" 
                className="h-full object-contain"
              />
            ) : (
              // Upload prompt
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload or take a photo of your LH test
                </p>
              </div>
            )}
          </div>
          
          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Hidden file input */}
          <input 
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          
          {/* Processing indicator */}
          {processing && (
            <div className="flex justify-center">
              <div className="animate-pulse text-center">
                <p className="text-sm text-muted-foreground">Analyzing test...</p>
              </div>
            </div>
          )}
          
          {/* Test result */}
          {result && !processing && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Test Result</h3>
                  <div className={`inline-block px-4 py-2 rounded-full font-medium ${
                    result === LHTestResult.POSITIVE || result === LHTestResult.PEAK 
                      ? 'bg-green-100 text-green-800' 
                      : result === LHTestResult.HIGH
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {result === LHTestResult.POSITIVE 
                      ? 'Positive' 
                      : result === LHTestResult.NEGATIVE
                        ? 'Negative'
                        : result === LHTestResult.HIGH
                          ? 'High'
                          : 'Peak'}
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground">
                    {result === LHTestResult.POSITIVE || result === LHTestResult.PEAK
                      ? 'LH surge detected! You are likely to ovulate in the next 24-48 hours.'
                      : result === LHTestResult.HIGH
                        ? 'Your LH levels are rising. You may be approaching your surge.'
                        : 'No LH surge detected. Continue testing daily.'}
                  </p>
                  
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Test taken on {format(new Date(), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Instructions */}
          {!image && !cameraActive && (
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">How to use the scanner:</h3>
                <ol className="text-sm space-y-2 list-decimal pl-5">
                  <li>Make sure the test is completely developed</li>
                  <li>Place test on a flat, well-lit surface</li>
                  <li>Align the test strip in the camera view</li>
                  <li>Hold steady while capturing the image</li>
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {cameraActive ? (
          <>
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            <Button onClick={captureImage}>
              Capture Photo
            </Button>
          </>
        ) : image && result ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => { setImage(null); setResult(null); }}
            >
              Retake
            </Button>
            <Button onClick={saveResult}>
              Save Result
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
            <Button onClick={startCamera}>
              <Camera className="h-4 w-4 mr-2" /> Camera
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

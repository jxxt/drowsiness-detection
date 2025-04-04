import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user"
};

const Home = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const capture = async () => {
    setIsLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    try {
      // Convert base64 image to blob for API upload
      const blob = await fetch(imageSrc).then(res => res.blob());
      
      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');

      // Call your FastAPI endpoint
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();

      // Show toast based on prediction
      if (result.predicted_class === 'Drowsy') {
        toast.error(`Drowsy detected! (Confidence: ${(result.confidence * 100).toFixed(1)}%)`, {
          position: "top-center",
          autoClose: 5000
        });
      } else {
        toast.success(`Alert (Confidence: ${(result.confidence * 100).toFixed(1)}%)`, {
          position: "top-center",
          autoClose: 3000
        });
      }

    } catch (error) {
      toast.error('Error processing image', {
        position: "top-center"
      });
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Employee Drowsiness Detection</h1>
      <div className="webcam-container">
        <Webcam
          audio={false}
          height={480}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          videoConstraints={videoConstraints}
        />
      </div>
      <button 
        className={`capture-button ${isLoading ? 'loading' : ''}`} 
        onClick={capture}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Capture'}
      </button>
      
      {capturedImage && (
        <div className="captured-image">
          <h3>Last Captured Image:</h3>
          <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%' }} />
        </div>
      )}
      
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Home;
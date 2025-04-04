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

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    // Simulate sending image to backend and getting a response
    // In production, send `imageSrc` to your API endpoint.
    setTimeout(() => {
      const isDrowsy = Math.random() < 0.5;
      if(isDrowsy) {
        toast.error("Drowsy", { position: toast.POSITION.TOP_CENTER });
      } else {
        toast.success("Not Drowsy", { position: toast.POSITION.TOP_CENTER });
      }
    }, 1000);
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
      <button className="capture-button" onClick={capture}>
        Capture
      </button>
      <ToastContainer />
    </div>
  );
};

export default Home;
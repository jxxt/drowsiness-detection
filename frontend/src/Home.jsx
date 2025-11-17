import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
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
            const blob = await fetch(imageSrc).then((res) => res.blob());

            // Create form data
            const formData = new FormData();
            formData.append("file", blob, "capture.jpg");

            // Call your FastAPI endpoint
            // Local API (comment out when using deployed API)
            // const response = await fetch('http://localhost:8000/predict', {
            //   method: 'POST',
            //   body: formData
            // });

            // Deployed API on Google Cloud Run
            const response = await fetch(
                "https://drowsiness-api-479356669218.us-central1.run.app/predict",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const result = await response.json();

            // Show toast based on prediction
            if (result.predicted_class === "Drowsy") {
                toast.error(
                    `Drowsy detected! (Confidence: ${(
                        result.confidence * 100
                    ).toFixed(1)}%)`,
                    {
                        position: "top-center",
                        autoClose: 5000,
                    }
                );
            } else {
                toast.success(
                    `Alert (Confidence: ${(result.confidence * 100).toFixed(
                        1
                    )}%)`,
                    {
                        position: "top-center",
                        autoClose: 3000,
                    }
                );
            }
        } catch (error) {
            toast.error("Error processing image", {
                position: "top-center",
            });
            console.error("API Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className="header">
                <h1>Employee Drowsiness Detection</h1>
                <p className="subtitle">AI-powered monitoring system</p>
            </div>

            <div className="content-container">
                <div className="webcam-section">
                    <div className="webcam-container">
                        <div className="webcam-overlay">
                            <div className="corner top-left"></div>
                            <div className="corner top-right"></div>
                            <div className="corner bottom-left"></div>
                            <div className="corner bottom-right"></div>
                        </div>
                        <Webcam
                            audio={false}
                            height={480}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={640}
                            videoConstraints={videoConstraints}
                            className="webcam-video"
                            mirrored={true}
                        />
                        {isLoading && <div className="scanning-effect"></div>}
                    </div>

                    <button
                        className={`capture-button ${
                            isLoading ? "loading" : ""
                        }`}
                        onClick={capture}
                        disabled={isLoading}
                    >
                        <span className="button-icon">
                            {isLoading ? "⟳" : "◉"}
                        </span>
                        <span className="button-text">
                            {isLoading ? "Processing..." : "Capture Image"}
                        </span>
                    </button>
                </div>

                {capturedImage && (
                    <div className="result-section">
                        <div className="captured-image">
                            <h3>Last Captured Image</h3>
                            <div className="image-container">
                                <img src={capturedImage} alt="Captured" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="footer">
                <p>
                    Advanced Computer Vision • Machine Learning • Real-time
                    Detection
                </p>
            </div>

            <ToastContainer position="top-center" />
        </div>
    );
};

export default Home;

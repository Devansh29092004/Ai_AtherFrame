import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import waves from '../Assets/waves.webp';
import { GoogleGenAI, Modality } from '@google/genai';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState('/');
  let inputRef = useRef(null);

  const imageGenerator = async () => {
    if (inputRef.current.value.trim() === '') {
      alert('Please enter a prompt');
      return;
    }

    try {
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error('Google Gemini API key is missing. Please check your .env file.');
      }

      const ai = new GoogleGenAI({ apiKey });

      const contents = inputRef.current.value.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
      if (imagePart && imagePart.inlineData) {
        const imageData = imagePart.inlineData.data;
        const imageUrl = `data:image/png;base64,${imageData}`;
        setImage_url(imageUrl); // Set the generated image as a data URL
      } else {
        throw new Error('No image data received from the API.');
      }
    } catch (error) {
      console.error('Error generating image:', error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Ai <span>AetherFrame</span>
      </div>
      <div className="img loading">
        <div className="image">
          <img src={image_url === '/' ? waves : image_url} alt="Generated or Waves background" />
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Are Thinking"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;


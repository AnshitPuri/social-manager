import React, { useState, useRef } from 'react';
import { Wand2, Image, Type, Upload, X, Download, RefreshCw, Sparkles, Copy, Check, Eraser, PaintBucket, Zap, Plus } from 'lucide-react';

// Add your Gemini API key here
const GEMINI_API_KEY = "AIzaSyBAv2OpTW6YOTxkIQJNwvyogwXZMSJJ1zA";

// Available models - you can switch between them
const MODELS = {
  'flash-lite': 'gemini-2.0-flash-lite',
  'flash': 'gemini-2.5-flash',
  'flash-exp': 'gemini-2.0-flash-exp', // Experimental
  'thinking-exp': 'gemini-2.0-flash-thinking-exp', // Experimental with reasoning
};

export default function ImprovePage() {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [tone, setTone] = useState('professional');
  const [selectedModel, setSelectedModel] = useState('flash-lite');
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState('enhance');
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const fileInputRef = useRef(null);

  const tones = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'funny', label: 'Funny', emoji: '😂' },
    { value: 'inspirational', label: 'Inspirational', emoji: '✨' },
    { value: 'educational', label: 'Educational', emoji: '📚' },
    { value: 'promotional', label: 'Promotional', emoji: '🎯' }
  ];

  const editModes = [
    { value: 'enhance', label: 'Enhance', icon: Sparkles, description: 'Improve quality & colors' },
    { value: 'remove', label: 'Remove Object', icon: Eraser, description: 'Remove unwanted elements' },
    { value: 'add', label: 'Add Element', icon: Plus, description: 'Add objects or effects' },
    { value: 'background', label: 'Remove Background', icon: PaintBucket, description: 'Remove background' }
  ];

  const handleImprove = async () => {
    if (!text.trim()) {
      setError('Please enter some text to improve');
      return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      setError('Please add your Gemini API key. Get it free from: https://aistudio.google.com/app/apikey');
      return;
    }

    setError('');
    setLoading(true);
    setVariations(null);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Improve this social media caption in a ${tone} tone. Return ONLY valid JSON with no preamble or markdown backticks, in this exact format:
{
  "variations": [
    {"text": "improved caption 1", "reason": "why this is better"},
    {"text": "improved caption 2", "reason": "why this is better"},
    {"text": "improved caption 3", "reason": "why this is better"}
  ]
}

Original caption: "${text}"

Make each variation unique and compelling for social media.`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const cleanText = textContent.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      if (parsed.variations && Array.isArray(parsed.variations)) {
        setVariations(parsed.variations);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(`Failed to generate improved versions: ${err.message}`);
      console.error('Improve error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageHistory([reader.result]);
        setImageAnalysis(''); // Clear previous analysis
      };
      reader.readAsDataURL(file);
      setError('');
      setEditedImage(null);
    }
  };

  const handleImageEdit = async () => {
    if (!imagePreview) {
      setError('Please upload an image first');
      return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      setError('Please add your Gemini API key to enable image analysis. Get it free from: https://aistudio.google.com/app/apikey');
      return;
    }

    if (editMode !== 'enhance' && !editPrompt.trim()) {
      setError('Please describe what you want to do');
      return;
    }

    setError('');
    setImageLoading(true);

    try {
      const base64Image = imagePreview.split(',')[1];
      
      const prompt = editMode === 'enhance' 
        ? 'Describe this image in detail, including colors, composition, lighting, and suggest improvements for better quality.'
        : editMode === 'remove' 
        ? `Analyze this image and suggest how to ${editPrompt}. Describe what needs to be removed and how the image would look after.`
        : editMode === 'add'
        ? `Analyze this image and suggest how to ${editPrompt}. Describe how this addition would enhance the image.`
        : `Describe what removing the background from this image would look like.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Image analysis failed');
      }

      const data = await response.json();
      const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      setImageAnalysis(analysis);
      setError('');
      
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      console.error('Image analysis error:', err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = 'edited-image.png';
      link.click();
    }
  };

  const handleCopyVariation = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const resetImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setEditedImage(null);
    setEditPrompt('');
    setImageHistory([]);
    setImageAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            AI Content Improver
          </h1>
          <p className="text-xl text-slate-600">
            Enhance your captions and edit images with AI-powered tools
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg inline-flex gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Type className="w-5 h-5" />
              Text Improver
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Image className="w-5 h-5" />
              Image Editor
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 max-w-4xl mx-auto">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Select Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        tone === t.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{t.emoji}</div>
                      <div className="text-sm font-semibold text-slate-700">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Your Caption
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your post caption here..."
                  className="w-full h-40 px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 resize-none text-slate-800"
                  disabled={loading}
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>{text.length} characters</span>
                  <span>{text.trim().split(/\s+/).filter(w => w).length} words</span>
                </div>
              </div>

              <button
                onClick={handleImprove}
                disabled={loading || !text.trim()}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Improve Caption
                  </>
                )}
              </button>
            </div>

            {variations && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  Improved Versions
                </h3>
                {variations.map((variation, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="text-slate-800 text-lg leading-relaxed mb-3">
                          {variation.text}
                        </div>
                        <div className="text-sm text-slate-500 italic">
                          💡 {variation.reason}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyVariation(variation.text, index)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all flex-shrink-0"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'image' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-cyan-500" />
                  Upload & Edit
                </h3>

                {!imagePreview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-cyan-500 transition-all cursor-pointer bg-slate-50">
                    <label className="cursor-pointer block">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-lg font-semibold text-slate-700 mb-2">
                        Click to upload image
                      </p>
                      <p className="text-sm text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full rounded-xl shadow-md"
                      />
                      <button
                        onClick={resetImage}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <label className="block text-slate-700 font-semibold mb-3">
                        Edit Mode
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {editModes.map((mode) => (
                          <button
                            key={mode.value}
                            onClick={() => setEditMode(mode.value)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              editMode === mode.value
                                ? 'border-cyan-500 bg-cyan-50 shadow-md'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <mode.icon className={`w-5 h-5 mb-2 ${editMode === mode.value ? 'text-cyan-600' : 'text-slate-400'}`} />
                            <div className="text-sm font-semibold text-slate-700">{mode.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{mode.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {editMode !== 'enhance' && editMode !== 'background' && (
                      <div className="mb-6">
                        <label className="block text-slate-700 font-semibold mb-3">
                          Describe Your Edit
                        </label>
                        <textarea
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          placeholder={
                            editMode === 'remove' ? 'e.g., Remove the person in the background' :
                            editMode === 'add' ? 'e.g., Add sunglasses, add sunset background' :
                            'Describe what you want...'
                          }
                          className="w-full h-24 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 resize-none"
                          disabled={imageLoading}
                        />
                      </div>
                    )}

                    <button
                      onClick={handleImageEdit}
                      disabled={imageLoading}
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {imageLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Analyze Image with AI
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  AI Analysis
                </h3>

                {imageAnalysis ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-cyan-50 to-indigo-50 rounded-xl p-6 border border-cyan-200">
                      <div className="flex items-start gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-slate-800 mb-2">
                            AI Vision Analysis
                          </h4>
                          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {imageAnalysis}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                          <h5 className="font-bold text-amber-900 mb-2">Important Note</h5>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            This is an <strong>AI analysis and suggestions</strong> only. The Gemini API used here can analyze images and suggest improvements, but it <strong>cannot perform actual image editing</strong> (like removing objects, adding elements, or changing backgrounds).
                          </p>
                          <p className="text-sm text-amber-800 mt-2">
                            For real image editing, you would need paid APIs like <strong>Stability AI</strong>, <strong>Replicate</strong>, or <strong>DALL-E</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setImageAnalysis('')}
                      className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Analyze Again
                    </button>
                  </div>
                ) : editedImage ? (
                  <>
                    <div className="mb-6">
                      <img
                        src={editedImage}
                        alt="Edited"
                        className="w-full rounded-xl shadow-lg"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownloadImage}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setImagePreview(editedImage);
                          setEditedImage(null);
                        }}
                        className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Edit Again
                      </button>
                    </div>

                    {imageHistory.length > 1 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Edit History</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {imageHistory.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Version ${idx + 1}`}
                              className="w-20 h-20 rounded-lg object-cover cursor-pointer border-2 border-slate-200 hover:border-cyan-500 transition-all"
                              onClick={() => setImagePreview(img)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <div className="text-center">
                      <Image className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 font-medium">
                        Upload an image and click "Analyze" to see AI suggestions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-2xl p-6 border border-cyan-200">
              <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                About Image Analysis
              </h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><strong>AI Vision:</strong> Gemini 2.0 Flash Lite analyzes your image and suggests improvements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Free Models:</strong> Using Gemini 2.0 Flash Lite (fast & free)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  <span><strong>Note:</strong> This analyzes images but doesn't edit them (requires paid APIs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Text improvement:</strong> Works perfectly with Gemini - try it now!</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
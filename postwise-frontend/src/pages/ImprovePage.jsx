import React, { useState, useRef } from 'react';
import { Wand2, Image, Type, Upload, X, Download, RefreshCw, Sparkles, Copy, Check, Eraser, PaintBucket, Crop, Zap, Plus, Minus, RotateCw, Maximize2 } from 'lucide-react';

export default function ImprovePage() {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Image editing states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState('enhance');
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
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
    { value: 'background', label: 'Change Background', icon: PaintBucket, description: 'Replace background' },
    { value: 'resize', label: 'Resize', icon: Maximize2, description: 'Change dimensions' },
    { value: 'filter', label: 'Apply Filter', icon: Wand2, description: 'Add creative filters' }
  ];

  const handleImprove = async () => {
    if (!text.trim()) {
      setError('Please enter some text to improve');
      return;
    }

    setError('');
    setLoading(true);
    setVariations(null);

    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockVariations = [
        {
          text: "🚀 Transform your social media game with AI-powered insights! Our platform analyzes engagement patterns to help you create content that resonates. Ready to 10x your reach?",
          reason: "Added emojis, stronger hook, and clear call-to-action"
        },
        {
          text: "Discover the power of AI-driven social media optimization. We help you understand what works, when to post, and how to engage your audience effectively. Start growing today!",
          reason: "More professional tone with benefits-focused messaging"
        },
        {
          text: "Want better engagement? 📊 Our AI analyzes millions of posts to give you actionable insights. Learn what your audience loves and watch your metrics soar! ⬆️",
          reason: "Question-based hook with data credibility and visual elements"
        }
      ];

      setVariations(mockVariations);
    } catch (err) {
      setError('Failed to generate improved versions. Please try again.');
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
      };
      reader.readAsDataURL(file);
      setError('');
      setEditedImage(null);
    }
  };

  const handleImageEdit = async () => {
    if (!selectedImage && !imagePreview) {
      setError('Please upload an image first');
      return;
    }

    if (editMode !== 'enhance' && editMode !== 'resize' && editMode !== 'filter' && !editPrompt.trim()) {
      setError('Please describe what you want to do');
      return;
    }

    setError('');
    setImageLoading(true);

    try {
      // Mock AI image editing - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo, just return the same image
      // In production, this would call an AI image editing API
      setEditedImage(imagePreview);
      setImageHistory(prev => [...prev, imagePreview]);
    } catch (err) {
      setError('Failed to edit image. Please try again.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    // Updated background to a simple slate-50 for a cleaner look
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Updated header gradient to Cyan and Indigo */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            AI Content Improver
          </h1>
          <p className="text-xl text-slate-600">
            Enhance your captions and edit images with AI-powered tools
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg inline-flex gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'text'
                  // Updated Text tab active color to Cyan/Blue
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
                  // Updated Image tab active color to Indigo/Purple
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Image className="w-5 h-5" />
              Image Editor
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 max-w-4xl mx-auto">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Text Improver Tab */}
        {activeTab === 'text' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Tone Selector */}
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
                          // Updated tone selector to Indigo
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

              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Your Caption
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your post caption here..."
                  // Updated textarea focus to Cyan
                  className="w-full h-40 px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 resize-none text-slate-800"
                  disabled={loading}
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>{text.length} characters</span>
                  <span>{text.trim().split(/\s+/).filter(w => w).length} words</span>
                </div>
              </div>

              {/* Improve Button */}
              <button
                onClick={handleImprove}
                disabled={loading || !text.trim()}
                // Updated button gradient to Cyan/Indigo
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

            {/* Variations */}
            {variations && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  {/* Updated icon color to Indigo */}
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  Improved Versions
                </h3>
                {variations.map((variation, index) => (
                  <div
                    key={index}
                    // Updated variation card hover border
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
                        // Updated copy button color to Indigo
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all"
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

        {/* Image Editor Tab */}
        {activeTab === 'image' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Panel - Upload & Edit Controls */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  {/* Updated icon color to Cyan */}
                  <Upload className="w-6 h-6 text-cyan-500" />
                  Upload & Edit
                </h3>

                {/* Image Upload */}
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
                    {/* Current Image Preview */}
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

                    {/* Edit Mode Selector */}
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
                                // Updated edit mode selector to Cyan
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

                    {/* Edit Prompt */}
                    {editMode !== 'enhance' && editMode !== 'resize' && editMode !== 'filter' && (
                      <div className="mb-6">
                        <label className="block text-slate-700 font-semibold mb-3">
                          Describe Your Edit
                        </label>
                        <textarea
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          placeholder={
                            editMode === 'remove' ? 'e.g., Remove the person in the background' :
                            editMode === 'add' ? 'e.g., Add a blue sky with clouds' :
                            editMode === 'background' ? 'e.g., Replace background with a beach scene' :
                            'Describe what you want...'
                          }
                          // Updated textarea focus to Cyan
                          className="w-full h-24 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 resize-none"
                          disabled={imageLoading}
                        />
                      </div>
                    )}

                    {/* Quick Enhancements for Enhance Mode */}
                    {editMode === 'enhance' && (
                      <div className="mb-6">
                        <label className="block text-slate-700 font-semibold mb-3">
                          Quick Enhancements
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all">
                            Brighten
                          </button>
                          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all">
                            Sharpen
                          </button>
                          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all">
                            Vivid Colors
                          </button>
                          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all">
                            Auto Fix
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit Button */}
                    <button
                      onClick={handleImageEdit}
                      disabled={imageLoading}
                      // Updated button gradient to Cyan/Indigo
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {imageLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Apply AI Edit
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Right Panel - Result */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  {/* Icon color kept as purple/indigo for contrast */}
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  Result
                </h3>

                {editedImage ? (
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
                        // Updated "Edit Again" button to Indigo
                        className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Edit Again
                      </button>
                    </div>

                    {/* History */}
                    {imageHistory.length > 1 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Edit History</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {imageHistory.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Version ${idx + 1}`}
                              // Updated history image hover border to Cyan
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
                        Your edited image will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Editing Tips */}
            {/* Updated Tips background and text colors */}
            <div className="mt-6 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-2xl p-6 border border-cyan-200">
              <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                AI Editing Tips
              </h4>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span>Be specific in your descriptions for better results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Use enhance mode first to improve overall quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>You can apply multiple edits by using "Edit Again"</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

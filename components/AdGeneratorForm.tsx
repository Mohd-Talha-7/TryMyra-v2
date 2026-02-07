import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, Video, Wand2, UserX, AlertCircle, Loader2, Download, RefreshCcw, CheckCircle, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { AdType } from '../types';
import { useWallet } from '../context/WalletContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useGenerations } from '../context/GenerationsContext';
import { Generation } from '../types/dashboard';

/* ---------------- VIDEO PLAYER FOR RESULTS ---------------- */

const VideoResultPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full bg-black group/video rounded-[24px] overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Control Overlays */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
        <button
          onClick={toggleMute}
          className="p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-primary transition-colors shadow-lg"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={togglePlay}
          className="p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-primary transition-colors shadow-lg"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
      </div>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/30"
        >
          <div className="p-5 bg-primary rounded-full shadow-2xl shadow-primary/40">
            <Play size={24} fill="white" className="text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN FORM COMPONENT ---------------- */
interface AdGeneratorFormProps {
  isDashboard?: boolean;
}

export const AdGeneratorForm: React.FC<AdGeneratorFormProps> = ({ isDashboard }) => {
  const { isSignedIn } = useUser();
  const { balance, deductCredits } = useWallet();
  const { addGeneration } = useGenerations();
  const location = useLocation();

  const [formData, setFormData] = useState({
    productUrl: '',
    productDetails: '',
    adType: AdType.IMAGE,
    productImage: null as File | null
  });

  // Handle service selection from Dashboard
  useEffect(() => {
    if (location.state?.serviceId) {
      const serviceId = location.state.serviceId;
      let type = AdType.IMAGE;
      if (serviceId === 'ugc-ads') type = AdType.UGC_AD;
      else if (serviceId === 'vfx-ads') type = AdType.VFX_AD;
      else if (serviceId === 'no-human') type = AdType.NO_HUMAN_AD;
      setFormData(p => ({ ...p, adType: type }));
    }
  }, [location.state]);

  const getCost = (type: AdType) => {
    switch (type) {
      case AdType.IMAGE: return 5;
      case AdType.UGC_AD: return 20;
      case AdType.VFX_AD: return 25;
      case AdType.NO_HUMAN_AD: return 15;
      default: return 5;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getWebhookUrl = (type: AdType): string => {
    switch (type) {
      case AdType.IMAGE:
        return import.meta.env.VITE_FASTAPI_IMAGE_URL;
      case AdType.UGC_AD:
        return import.meta.env.VITE_FASTAPI_UGC_URL;
      case AdType.VFX_AD:
        return import.meta.env.VITE_FASTAPI_VFX_URL;
      case AdType.NO_HUMAN_AD:
        return import.meta.env.VITE_FASTAPI_NOHUMAN_URL;
      default:
        return import.meta.env.VITE_FASTAPI_IMAGE_URL;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ['jpg', 'jpeg', 'png'].includes(extension || '');

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      setError("Please upload a valid image (JPG, JPEG, or PNG).");
      setFormData(prev => ({ ...prev, productImage: null }));
      return;
    }

    setFormData(prev => ({ ...prev, productImage: file }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const response = await fetch(result.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;

      const extension = result.url.split('.').pop()?.split('?')[0] || (result.type === 'video' ? 'mp4' : 'png');
      link.download = `trymyra_${Date.now()}.${extension}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      const link = document.createElement('a');
      link.href = result.url;
      link.target = "_blank";
      link.download = `trymyra_${Date.now()}`;
      link.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (!isSignedIn) {
      setError("Please sign in to generate ads.");
      return;
    }

    if (!formData.productImage) {
      setError("Please upload a product photo.");
      return;
    }

    const cost = getCost(formData.adType);
    if (balance < cost) {
      setError(`Insufficient credits. This generation costs ${cost} credits, but you have ${balance}.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const defaultFriendlyError = "Something went wrong. Please try again.";
    const targetUrl = getWebhookUrl(formData.adType);

    try {
      const payload = new window.FormData();
      payload.append('product_url', formData.productUrl);
      payload.append('product_details', formData.productDetails);
      payload.append('ad_type', formData.adType);
      payload.append('image', formData.productImage);
      payload.append('product_image_name', formData.productImage.name);

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: payload,
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();

        if (json.success === true && json.data) {
          const assetUrl = json.data.video_url || json.data.image_url;
          const assetTypeFromResponse = json.data.type;
          const assetType = assetTypeFromResponse === 'video' || formData.adType !== AdType.IMAGE ? 'video' : 'image';

          if (!assetUrl) {
            throw new Error("Generation completed but no asset URL was found in the response.");
          }

          const category = formData.adType === AdType.IMAGE ? 'IMAGE' :
            formData.adType === AdType.UGC_AD ? 'UGC' :
              formData.adType === AdType.VFX_AD ? 'VFX' :
                formData.adType === AdType.NO_HUMAN_AD ? 'NO HUMAN' : 'UGC';

          const extractSmartTitle = (details: string, url: string, typeLabel: string, aiTitle?: string, fileName?: string): string => {
            // Priority 1: AI provided title
            if (aiTitle && aiTitle.trim().length > 2) {
              return aiTitle.trim();
            }

            // Priority 2: User provided product details
            if (details && details.trim().length > 0) {
              let title = details.split('\n')[0].trim();
              const words = title.split(/\s+/);
              if (words.length > 6) {
                title = words.slice(0, 6).join(' ') + '...';
              }
              return title.charAt(0).toUpperCase() + title.slice(1);
            }

            // Priority 3: Product URL
            if (url && url.trim().length > 0) {
              try {
                const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
                const pathSegments = urlObj.pathname.split('/').filter(Boolean);
                const lastSegment = pathSegments.pop();
                if (lastSegment) {
                  const cleanTitle = lastSegment
                    .replace(/\.(html|php|asp|aspx|htm)$/i, '')
                    .replace(/[-_]/g, ' ')
                    .trim();
                  if (cleanTitle.length > 2) {
                    return cleanTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  }
                }
                // If path is empty, maybe the hostname?
                if (urlObj.hostname && !urlObj.hostname.includes('google') && !urlObj.hostname.includes('amazon')) {
                  const domain = urlObj.hostname.replace('www.', '').split('.')[0];
                  return domain.charAt(0).toUpperCase() + domain.slice(1);
                }
              } catch (e) { }
            }

            // Priority 4: Image file name
            if (fileName && fileName.trim().length > 0) {
              const cleanFileName = fileName.split('.')[0]
                .replace(/[-_]/g, ' ')
                .replace(/\d+$/, '') // remove trailing numbers
                .trim();
              if (cleanFileName.length > 2 && !/^(image|img|photo|picture|capture|screenshot)$/i.test(cleanFileName)) {
                return cleanFileName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              }
            }

            return `New ${typeLabel}`;
          };

          const adTypeLabel = formData.adType === AdType.IMAGE ? 'Image Ad' :
            formData.adType === AdType.UGC_AD ? 'UGC Video' :
              formData.adType === AdType.VFX_AD ? 'VFX Ad' : 'No Human Ad';

          // Check if API returned a title/product name
          const apiTitle = json.data.title || json.data.product_name || json.data.product_details;
          const fileName = formData.productImage?.name;

          const finalTitle = extractSmartTitle(formData.productDetails, formData.productUrl, adTypeLabel, apiTitle, fileName);

          await deductCredits(getCost(formData.adType), finalTitle, category);

          const newGeneration: Generation = {
            id: Math.random().toString(36).substr(2, 9),
            title: finalTitle,
            type: formData.adType === AdType.IMAGE ? 'Image' :
              formData.adType === AdType.UGC_AD ? 'UGC Video' :
                formData.adType === AdType.VFX_AD ? 'VFX' : 'Script',
            status: 'Ready',
            imageUrl: assetUrl,
            content: formData.productDetails,
            createdAt: Date.now(),
          };

          addGeneration(newGeneration);

          setResult({
            url: assetUrl,
            type: assetType as 'image' | 'video'
          });
          setIsSubmitting(false);
          return;
        } else {
          const errorMsg = json.message || defaultFriendlyError;
          throw new Error(errorMsg);
        }
      }

      if (!response.ok) {
        throw new Error(`The service is currently unavailable (${response.status}).`);
      } else {
        throw new Error("Unexpected response format from the server.");
      }

    } catch (err: any) {
      let finalErrorMessage = defaultFriendlyError;
      if (err.message && !err.message.includes('fetch') && !err.message.includes('JSON')) {
        finalErrorMessage = err.message;
      }

      setError(finalErrorMessage);
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFormData({ productUrl: '', productDetails: '', adType: AdType.IMAGE, productImage: null });
  };

  if (result) {
    return (
      <section id="generate" className={`${isDashboard ? '' : 'py-24 bg-[#f8fafc] dark:bg-background-dark'} flex justify-center px-4 transition-colors duration-300`}>
        <div className={`w-full max-w-4xl ${isDashboard ? 'bg-white/50 dark:bg-[#0B101B]/50' : 'bg-white dark:bg-[#0B101B]'} border border-black/5 dark:border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500`}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Success</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Your Ad is Ready</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
            <div className="w-full max-w-[300px] aspect-[9/16] bg-black rounded-[24px] overflow-hidden border border-white/10 shadow-2xl">
              {result.type === 'video' ? (
                <VideoResultPlayer src={result.url} />
              ) : (
                <img src={result.url} className="w-full h-full object-cover" alt="Result" />
              )}
            </div>

            <div className="flex-1 max-w-sm space-y-6">
              <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                <h4 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-2">Creative Asset</h4>
                <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">Your creative has been professionally rendered. You can now download and use it for your campaigns.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="w-full py-4 bg-primary hover:bg-primaryDark text-white rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Download size={18} /> Download Ad
                </button>
                <button onClick={reset} className="w-full py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl border border-black/10 dark:border-white/10 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 transition-all">
                  <RefreshCcw size={18} /> Create Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="generate" className="w-full max-w-6xl mx-auto p-8 md:p-12 space-y-16">

      {/* Header */}
      <div className="space-y-2 relative">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
              New Creation
            </h2>
            <p className="text-lg text-white/60 max-w-2xl font-light">
              Transform your product into a high-converting advertisement using our <span className="text-[#00f2ea] font-medium">Neural Engine 2.0</span>.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">

        {/* Step 1: Select Ad Type */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">1</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Select Ad Type</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: AdType.IMAGE, label: 'Image Ad', icon: ImageIcon, desc: 'Perfect for social feeds', cost: 5 },
              { id: AdType.UGC_AD, label: 'UGC Ad', icon: Video, desc: 'Authentic creator style', cost: 15 },
              { id: AdType.VFX_AD, label: 'VFX Ad', icon: Wand2, desc: 'High-end cinematic effects', cost: 25 },
              { id: AdType.NO_HUMAN_AD, label: 'No Human Ad', icon: UserX, desc: 'Minimalist product focus', cost: 10 },
            ].map((type) => {
              const Icon = type.icon;
              const isActive = formData.adType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, adType: type.id }))}
                  className={`relative rounded-2xl p-6 flex flex-col gap-6 cursor-pointer group h-64 transition-all duration-300 ${isActive
                    ? 'bg-white/5 border border-primary shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-xl'
                    : 'bg-white/[0.03] border border-white/10 hover:border-white/30 backdrop-blur-xl hover:bg-white/[0.07]'
                    }`}
                >
                  {isActive && (
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/40 blur-3xl rounded-full group-hover:bg-primary/60 transition-all"></div>
                  )}

                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform duration-300 ${isActive
                    ? 'bg-gradient-to-br from-primary/20 to-white/5 border border-primary/30'
                    : 'bg-white/5 border border-white/10 group-hover:bg-white/10'
                    }`}>
                    <Icon className={`${isActive ? 'text-primary' : 'text-white/70 group-hover:text-white'} transition-colors`} size={28} />
                  </div>

                  <div>
                    <h4 className={`font-bold text-xl mb-1 transition-colors ${isActive ? 'text-white' : 'text-white/90'}`}>
                      {type.label}
                    </h4>
                    <p className="text-white/40 text-sm font-medium group-hover:text-white/50 transition-colors">
                      {type.desc}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors ${isActive
                      ? 'bg-primary/20 border border-primary/30 text-[#c4b5fd]'
                      : 'bg-white/5 border border-white/10 text-white/50 group-hover:bg-white/10 group-hover:text-white'
                      }`}>
                      {type.cost} Credits
                    </span>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-[#00f2ea] shadow-[0_0_10px_#00f2ea]"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Product Details */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">2</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Product Details</h3>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/80 ml-1 uppercase tracking-wider text-[11px]">Product URL</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-[#00f2ea]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <input
                  type="url"
                  name="productUrl"
                  value={formData.productUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourstore.com/product-link"
                  className="relative w-full rounded-2xl px-6 py-5 outline-none placeholder:text-white/20 bg-black/20 border border-white/10 backdrop-blur-md text-white transition-all focus:bg-black/40 focus:border-primary/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_15px_rgba(99,102,241,0.2)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-white/80 ml-1 uppercase tracking-wider text-[11px]">Product Description</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-[#00f2ea]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <textarea
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleInputChange}
                  placeholder="Describe the key features, selling points, and target audience..."
                  rows={5}
                  className="relative w-full rounded-2xl px-6 py-5 outline-none resize-none placeholder:text-white/20 bg-black/20 border border-white/10 backdrop-blur-md text-white transition-all focus:bg-black/40 focus:border-primary/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_0_15px_rgba(99,102,241,0.2)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Upload Assets */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#a855f7] text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">3</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Upload Assets</h3>
          </div>

          <div className="w-full relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#00f2ea] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[3rem]"></div>
            <div
              className={`relative overflow-hidden h-72 rounded-[3rem] flex flex-col items-center justify-center gap-6 transition-all backdrop-blur-xl ${dragActive
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-white/[0.03] border border-white/20 hover:border-[#00f2ea]/50'
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              {/* Neon Scanning Line */}
              <div className="scan-line"></div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />

              {formData.productImage ? (
                <div className="text-center animate-in zoom-in-95">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-[#00f2ea]/20 blur-xl rounded-full animate-pulse"></div>
                    <ImageIcon size={40} className="text-[#00f2ea] relative z-10" />
                  </div>
                  <p className="text-xl font-bold text-white mb-2">{formData.productImage.name}</p>
                  <p className="text-sm text-white/40 font-medium">Click to change image</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[#00f2ea]/20 blur-xl rounded-full animate-pulse"></div>
                    <Upload size={40} className="text-[#00f2ea] drop-shadow-[0_0_10px_rgba(0,242,234,0.5)]" />
                  </div>
                  <div className="text-center z-10">
                    <p className="text-xl font-bold text-white mb-2">
                      Drag & drop or <span className="text-[#00f2ea] underline decoration-[#00f2ea]/50 underline-offset-4">browse</span>
                    </p>
                    <p className="text-sm text-white/40 font-medium">Supports JPG, PNG, WEBP (Max 25MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-8 pb-20">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                type="button"
                className="relative w-full py-6 rounded-2xl group overflow-hidden transition-transform active:scale-[0.99]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] via-[#a855f7] to-[#4f46e5] bg-[length:200%_auto] animate-[pulse-glow_3s_infinite]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                <div className="relative flex items-center justify-center gap-4 z-10">
                  <Sparkles size={24} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-xl font-black tracking-wide text-white drop-shadow-md">SIGN IN TO GENERATE</span>
                </div>
              </button>
            </SignInButton>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-6 rounded-2xl group overflow-hidden transition-transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] via-[#a855f7] to-[#4f46e5] bg-[length:200%_auto] animate-[pulse-glow_3s_infinite]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
              <div className="relative flex items-center justify-center gap-4 z-10">
                {isSubmitting ? (
                  <>
                    <Loader2 size={24} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-spin" />
                    <span className="text-xl font-black tracking-wide text-white drop-shadow-md">GENERATING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce" />
                    <span className="text-xl font-black tracking-wide text-white drop-shadow-md">GENERATE AD CAMPAIGN</span>
                  </>
                )}
              </div>
            </button>
          )}

          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-[#00f2ea] rounded-full animate-pulse"></div>
            <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">
              Estimated generation time: 45 seconds
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};
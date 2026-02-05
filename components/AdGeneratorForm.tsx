import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, Video, Wand2, UserX, AlertCircle, Loader2, Download, RefreshCcw, CheckCircle, Play, Pause, Volume2, VolumeX, Wallet } from 'lucide-react';
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
        return 'https://fastapi.ameegolabs.com/webhook/ad/api/image';
      case AdType.UGC_AD:
        return 'https://fastapi.ameegolabs.com/webhook/ad/api/ugc';
      case AdType.VFX_AD:
        return 'https://fastapi.ameegolabs.com/webhook-test/ad/api/vfx';
      case AdType.NO_HUMAN_AD:
        return 'https://fastapi.ameegolabs.com/webhook-test/ad/api/nohuman';
      default:
        return 'https://fastapi.ameegolabs.com/webhook/ad/api/image';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      link.download = `ad_genius_${Date.now()}.${extension}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      const link = document.createElement('a');
      link.href = result.url;
      link.target = "_blank";
      link.download = `ad_genius_${Date.now()}`;
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

          deductCredits(getCost(formData.adType), finalTitle, category);

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
    <section id="generate" className={`${isDashboard ? '' : 'py-20 bg-[#f8fafc] dark:bg-background-dark'} flex justify-center px-4 transition-colors duration-300`}>
      <div className={`w-full max-w-5xl ${isDashboard ? 'bg-white/50 dark:bg-[#0B101B]/95' : 'bg-white dark:bg-[#0B101B]/95'} border border-black/5 dark:border-white/5 rounded-[40px] p-10 md:p-16 shadow-2xl transition-all duration-300`}>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {isDashboard ? 'New Creation' : 'Create Your Ad'}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg font-medium opacity-80 mb-6">
            {isDashboard
              ? 'Transform your product into a high-converting advertisement.'
              : 'Fill in the details below to start generating your content.'}
          </p>

          {isSignedIn && (
            <div className="inline-flex items-center gap-2 bg-black/5 dark:bg-slate-800 border border-black/10 dark:border-white/10 px-4 py-2 rounded-full">
              <Wallet size={16} className="text-primary" />
              <span className="text-sm font-bold text-gray-600 dark:text-slate-300">Balance: <span className="text-slate-900 dark:text-white">{balance} Credits</span></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white ml-1">Select Ad Type</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: AdType.IMAGE, label: 'Image', icon: ImageIcon },
                { id: AdType.UGC_AD, label: 'Ugc Ad', icon: Video },
                { id: AdType.VFX_AD, label: 'Vfx Ad', icon: Wand2 },
                { id: AdType.NO_HUMAN_AD, label: 'No Human_ad', icon: UserX },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, adType: type.id }))}
                  className={`flex flex-col items-center gap-3 p-8 rounded-2xl border transition-all ${formData.adType === type.id
                    ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(47,107,255,0.2)]'
                    : 'bg-white dark:bg-[#141B2D] border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
                    }`}
                >
                  <type.icon size={28} className={formData.adType === type.id ? 'text-primary' : 'text-gray-400 dark:text-slate-500'} />
                  <span className={`text-xs font-medium ${formData.adType === type.id ? 'text-slate-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>
                    {type.label}
                  </span>
                  <span className="text-[10px] font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-gray-500 dark:text-slate-400 mt-1">{getCost(type.id)} Credits</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white ml-1">Product URL</h3>
              <input
                type="text"
                name="productUrl"
                value={formData.productUrl}
                onChange={handleInputChange}
                placeholder="https://myshop.com/product"
                className="w-full bg-black/5 dark:bg-[#141B2D] border border-black/5 dark:border-white/5 rounded-xl px-6 py-4 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white ml-1">Product Details</h3>
              <input
                type="text"
                name="productDetails"
                value={formData.productDetails}
                onChange={handleInputChange}
                placeholder="Brief description or specific tone..."
                className="w-full bg-black/5 dark:bg-[#141B2D] border border-black/5 dark:border-white/5 rounded-xl px-6 py-4 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white ml-1">Product Image</h3>
            <div
              className={`relative border-2 border-dashed rounded-3xl p-16 transition-all text-center cursor-pointer flex flex-col items-center justify-center min-h-[240px] ${dragActive ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-[#141B2D]/50 hover:bg-black/10 dark:hover:bg-[#141B2D]'
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />

              {formData.productImage ? (
                <div className="animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 text-primary champion mx-auto">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">{formData.productImage.name}</p>
                  <p className="text-xs text-primary mt-2 uppercase font-black tracking-widest">Click to change</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0B101B] border border-black/5 dark:border-white/5 flex items-center justify-center mb-6 text-gray-400 dark:text-slate-400 shadow-sm">
                    <Upload size={24} />
                  </div>
                  <p className="text-slate-900 dark:text-white font-bold mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Only JPG, JPEG, or PNG supported</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {!isSignedIn ? (
            <div className="w-full">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full py-5 bg-primary hover:bg-primaryDark text-white rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Sign In to Generate
                </button>
              </SignInButton>
              <p className="text-center text-gray-500 dark:text-slate-500 text-sm mt-3">
                You need to be signed in to generate ads.
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-primary hover:bg-primaryDark disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Creating your ad...
                </>
              ) : (
                'Generate Ad'
              )}
            </button>
          )}
        </form>
      </div>
    </section>
  );
};
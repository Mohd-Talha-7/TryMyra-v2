/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLERK_PUBLISHABLE_KEY: string
    readonly VITE_RAZORPAY_KEY_ID: string
    readonly VITE_GOOGLE_AI_API_KEY: string
    readonly VITE_FASTAPI_IMAGE_URL: string
    readonly VITE_FASTAPI_UGC_URL: string
    readonly VITE_FASTAPI_VFX_URL: string
    readonly VITE_FASTAPI_NOHUMAN_URL: string
    readonly VITE_RAZORPAY_PREFILL_NAME: string
    readonly VITE_RAZORPAY_PREFILL_EMAIL: string
    readonly VITE_RAZORPAY_PREFILL_CONTACT: string
    readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

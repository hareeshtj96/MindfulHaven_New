interface ImportMetaEnv {
    readonly VITE_RAZORPAY_KEY_ID: string;
    readonly VITE_APP_ID: number;
    readonly VITE_APP_SECRET: string;
    readonly VITE_APP_SERVER_URL: string;
    readonly VITE_APP_BUCKET_NAME: string;
    readonly VITE_APP_BUCKET_REGION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
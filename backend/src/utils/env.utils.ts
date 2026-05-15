declare module 'bun' {
  interface Env {
    PORT: number;
    FRONTEND_URL: string;
    DB_USER: string;
    DB_PASSWORD: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_CONNECTION_URL: string;
    DB_URL: string;
    DB_PUBLISHABLE_KEY: string;
    DB_SECRET_KEY: string;
    JWT_SECRET_KEY: string;
    RESEND_API_KEY: string;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_SECRET_KEY: string;
  }
}

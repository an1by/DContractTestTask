declare namespace NodeJS {
    export interface ProcessEnv {
        GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
        GOOGLE_PRIVATE_KEY: string;
        GOOGLE_SHEET_ID: string;
        GOOGLE_SCOPES: string;
    }
}
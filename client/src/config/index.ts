// Desc: Configuration file for the client
const APP_ENV = process.env.REACT_APP_ENV;
const APP_VERSION = process.env.REACT_APP_VERSION || 'v0.0.1';
const APP_DOCUMENTATION_URL = process.env.REACT_APP_DOCUMENTATION_URL;
const APP_LOGO_PATH = process.env.REACT_APP_LOGO_PATH || 'img/logo.png';
const REACT_APP_HOST = process.env.REACT_APP_HOST;
const REACT_APP_NAME = process.env.REACT_APP_NAME;
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET;

const EMAIL_SERVICE_ID = process.env.REACT_APP_EMAIL_SERVICE_ID;
const EMAIL_TEMPLATE_ID = process.env.REACT_APP_EMAIL_TEMPLATE_ID;
const EMAIL_PK = process.env.REACT_APP_EMAIL_PK;



// Conditionally set the API URL based on the environment
export const IS_LOCAL = process.env.REACT_APP_IS_LOCAL === 'false' 
						|| !process.env.REACT_APP_IS_LOCAL 
						? false : true;
export const IS_PROD = process.env.REACT_APP_ENV === 'production' ? 'https://llm-server-flame.vercel.app' : 'https://llm-server-flame.vercel.app';
export const API_URL = IS_LOCAL ? 'http://localhost:8000' : IS_PROD;
export const ON_PREM = process.env.REACT_APP_ON_PREM_OPTIONS === 'false' 
						|| !process.env.REACT_APP_ON_PREM_OPTIONS 
						? false : true;

// Configs
const email = {
    EMAIL_SERVICE_ID,
    EMAIL_TEMPLATE_ID,
    EMAIL_PK,
}

const appConfig = {
    APP_ENV,
    APP_VERSION,
    APP_LOGO_PATH,
    APP_DOCUMENTATION_URL,
    REACT_APP_NAME,
    REACT_APP_HOST,
    JWT_SECRET,
    email
}

export default appConfig;
import { OpenAiChatModels } from "./openai";
import { ON_PREM } from "./index";

const ON_PREM_LLM_OPTIONS = [
    { value: 'llama2', label: 'LLaMA2' },
]
export const MODEL_OPTIONS = ON_PREM ? ON_PREM_LLM_OPTIONS : [
    { value: OpenAiChatModels.GPT_3_5_TURBO, label: 'GPT-3.5 Turbo' },
    { value: OpenAiChatModels.GPT_3_5_TURBO_16K, label: 'GPT-3.5 Turbo 16k' },
    { value: OpenAiChatModels.GPT_4, label: 'GPT-4' },
    { value: OpenAiChatModels.GPT_4_TURBO, label: 'GPT-4 Turbo' },
    { value: 'llama2', label: 'LLaMA2' },
]


const ON_PREM_VECTOR_DB_OPTIONS = [
    { value: 'redis', label: 'Redis' },
]
export const VECTOR_DB_OPTIONS = ON_PREM ? ON_PREM_VECTOR_DB_OPTIONS : [
    { value: 'pinecone', label: 'Pinecone' },
    { value: 'redis', label: 'Redis' },
]

export const LOADER_TYPE_OPTIONS = [
	{ value: 'files', label: 'Files' },
	{ value: 'copy', label: 'Clipboard' },
	{ value: 'yt', label: 'Youtube' },
    { value: 'sitemap', label: 'Sitemap' },
    { value: 'web_base', label: 'Web Page' },
    { value: 'website', label: 'Website' },
    { value: 'urls', label: 'Multi-URL' },
    { value: 'gitbook', label: 'Gitbook' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' }
];

export const URL_FILE_TYPES = [
	'web_base',
	'gitbook',
	'urls',
	'copy',
	'yt',
	'sitemap',
	'website',
	'ethereum',
	'polygon',
];
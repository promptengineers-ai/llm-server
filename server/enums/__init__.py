from enum import Enum


class UrlLoaderType(str, Enum):
	GITBOOK = 'gitbook'
	WEB_PAGE = 'web_base'
	WEBSITE = 'website'
	YOUTUBE = 'yt'
	SITEMAP = 'sitemap'
	URLS = 'urls'
	COPY = 'copy'
	ETHEREUM = 'ethereum'
	POLYGON = 'polygon'


class FileLoaderType(str, Enum):
	TEXT = 'txt'
	HTML = 'html'
	MARKDOWN = 'md'
	CSV = 'csv'
	PDF = 'pdf'

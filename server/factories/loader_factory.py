import nest_asyncio
from langchain.document_loaders import (CSVLoader, DirectoryLoader, GitbookLoader,
										PyPDFLoader, TextLoader,
										UnstructuredHTMLLoader,
										UnstructuredMarkdownLoader,
										UnstructuredURLLoader, WebBaseLoader,
										YoutubeLoader, SitemapLoader, BlockchainDocumentLoader)
from langchain.document_loaders.blockchain import BlockchainType

from server.strategies.loaders import CopyPasteLoader
from server.config import ALCHEMY_API_KEY
from server.utils import get_links, logger

nest_asyncio.apply()

class LoaderFactory:
	@staticmethod
	def create_loader(
		loader_type: ('gitbook', 'web_base', 'yt', 'polygon', 'ethereum', 'sitemap', 'website', 'urls', 'copy', 'txt', 'html', 'md', 'directory', 'csv', 'pdf'),
		body
	):
		if loader_type == 'gitbook':
			urls = body.get('urls', [])
			logger.info('[DocumentLoaderFactory.create_loader] Gitbook Link: %s', urls[0])
			return GitbookLoader(urls[0], load_all_paths=True)

		if loader_type == 'web_base':
			urls = body.get('urls', [])
			logger.info('[DocumentLoaderFactory.create_loader] Web Base: %s', urls[0])
			return WebBaseLoader(urls[0])

		if loader_type == 'yt':
			yt_id = body.get('ytId')
			logger.info('[DocumentLoaderFactory.create_loader] Youtube: https://youtube.com/watch?v=%s', yt_id)
			return YoutubeLoader(yt_id)

		if loader_type == 'polygon':
			contract_address = body.get('contract_address', '')
			logger.info('[DocumentLoaderFactory.create_loader] Polygon Contract Address: %s', contract_address)
			return BlockchainDocumentLoader(
				contract_address=contract_address,
				blockchainType=BlockchainType.POLYGON_MAINNET,
				api_key=ALCHEMY_API_KEY,
			)

		if loader_type == 'ethereum':
			contract_address = body.get('contract_address', '')
			logger.info('[DocumentLoaderFactory.create_loader] Ethereum Contract Address: %s', contract_address)
			return BlockchainDocumentLoader(
				contract_address=contract_address,
				api_key=ALCHEMY_API_KEY,
			)

		if loader_type == 'sitemap':
			urls = body.get('urls', [])
			logger.info('[DocumentLoaderFactory.create_loader] Sitemap: %s', urls)
			return SitemapLoader(web_path=urls[0])

		if loader_type == 'website':
			urls = body.get('urls', [])
			unique_links = get_links(urls[0])
			logger.info('[DocumentLoaderFactory.create_loader] Website: %s', unique_links)
			return UnstructuredURLLoader(urls=unique_links)

		if loader_type == 'urls':
			urls = body.get('urls', [])
			logger.info('[DocumentLoaderFactory.create_loader] URLs: %s', urls)
			return UnstructuredURLLoader(urls=urls)

		if loader_type == 'copy':
			logger.info('[DocumentLoaderFactory.create_loader] Copy %s', body.get("text")[:500] + '...')
			return CopyPasteLoader(text=body.get('text'))

		if loader_type == 'txt':
			logger.info('[DocumentLoaderFactory.create_loader] Text: %s', body.get("file_path"))
			return TextLoader(body.get('file_path'))

		if loader_type == 'html':
			logger.info('[DocumentLoaderFactory.create_loader] HTML: %s', body.get("file_path"))
			return UnstructuredHTMLLoader(body.get('file_path'))

		if loader_type == 'md':
			logger.info('[DocumentLoaderFactory.create_loader] Markdown: %s', body.get("file_path"))
			return UnstructuredMarkdownLoader(body.get('file_path'))

		if loader_type == 'directory':
			logger.info('[DocumentLoaderFactory.create_loader] Directory: %s', body.get("file_path"))
			return DirectoryLoader(body.get('file_path'), glob="**/*")

		if loader_type == 'csv':
			logger.info('[DocumentLoaderFactory.create_loader] CSV: %s', body.get("file_path"))
			return CSVLoader(body.get('file_path'))

		if loader_type == 'pdf':
			logger.info('[DocumentLoaderFactory.create_loader] PDF: %s', body.get("file_path"))
			return PyPDFLoader(body.get('file_path'))

		raise ValueError(f'Unsupported document loader type: {loader_type}')

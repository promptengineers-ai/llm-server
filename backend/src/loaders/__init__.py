import os
import tempfile
import base64
from pypdf import PdfReader
from langchain.document_loaders.base import BaseLoader
from langchain.docstore.document import Document

class CopyPasteLoader(BaseLoader):
	def __init__(self, text):
		self.text = text

	def load(self):
		return [Document(page_content=self.text)]

class Base64Loader(BaseLoader):
    def __init__(self, files):
        self.files = files
        
    def process_pdf(self, pdf_bytes, filename):
        # Create a temporary directory to handle PDF processing
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, filename)
            with open(file_path, 'wb') as f:
                f.write(pdf_bytes)
            # Reading the PDF file using PyPDF2
            return self.read_pdf(file_path, filename)

    def read_pdf(self, file_path, filename):
        reader = PdfReader(file_path)
        full_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:  # Only add text if it exists
                full_text.append(text)
        return Document(page_content="".join(full_text), metadata={'source': filename})

    def load(self):
        documents = []
        for file in self.files:
            base64_string = file['src'].split('base64,')[-1]
            content_bytes = base64.b64decode(base64_string)

            if file['type'] == 'application/pdf':
                # Process PDF using a temporary file
                document = self.process_pdf(content_bytes, file['name'])
            else:
                try:
                    content = content_bytes.decode('utf-8')
                except UnicodeDecodeError:
                    content = "Error decoding data: Data is not valid UTF-8."
                document = Document(page_content=content, metadata={'source': file['name']})

            documents.append(document)
        return documents

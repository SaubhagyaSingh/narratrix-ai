# app/services/document_service.py
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import os

# Initialize text splitter with overlapping chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", " ", ""]
)

def load_pdf(file_path: str) -> list[Document]:
    """Load PDF and return LangChain documents"""
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        print(f"✅ Loaded PDF with {len(documents)} pages")
        return documents
    except Exception as e:
        print(f"❌ PDF Loading Error: {str(e)}")
        raise

def split_documents(documents: list[Document]) -> list[Document]:
    """Split documents into chunks using LangChain splitter"""
    try:
        chunks = text_splitter.split_documents(documents)
        print(f"✅ Split into {len(chunks)} chunks")
        return chunks
    except Exception as e:
        print(f"❌ Document Splitting Error: {str(e)}")
        raise

def process_pdf(file_path: str) -> list[Document]:
    """Full pipeline: load PDF and split into chunks"""
    documents = load_pdf(file_path)
    chunks = split_documents(documents)
    return chunks
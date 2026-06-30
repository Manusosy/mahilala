import PyPDF2
import sys

def extract_pdf_text(filepath):
    try:
        with open(filepath, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                text = reader.pages[page_num].extract_text()
                if "Procurement" in text or "Financial" in text or "Risk" in text or "24." in text or "25." in text:
                    print(f"--- PAGE {page_num+1} ---")
                    print(text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_pdf_text(sys.argv[1])

# services/gemini_service.py
import google.generativeai as genai
from config import GEMINI_API_KEY
import re, json, markdown, os, tempfile
from weasyprint import HTML

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


def call_gemini(note_prompt: str) -> str:
    response = model.generate_content(note_prompt)
    return response.text


def parse_response(text: str):
    json_match = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", text)
    if not json_match:
        raise ValueError("Gemini response missing JSON metadata")

    metadata = json.loads(json_match.group(1))

    pdf_filename = metadata.get("pdf_filename")
    if not pdf_filename:
        raise ValueError("pdf_filename missing in metadata")

    markdown_content = re.sub(r"```json[\s\S]*?```", "", text).strip()
    markdown_content = re.sub(r"PDF:\s*.+$", "", markdown_content).strip()

    return metadata, markdown_content, pdf_filename


def create_pdf_from_markdown(markdown_data: str, pdf_filename: str) -> str:
    html = markdown.markdown(markdown_data, extensions=["fenced_code"])

    html_doc = f"""
    <html>
      <body style="font-family: Arial; padding: 24px;">
        {html}
      </body>
    </html>
    """

    temp_dir = tempfile.gettempdir()  
    pdf_path = os.path.join(temp_dir, pdf_filename)

    HTML(string=html_doc).write_pdf(pdf_path)

    return pdf_path

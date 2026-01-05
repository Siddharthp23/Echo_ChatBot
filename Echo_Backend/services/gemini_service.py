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
    """
    Safely parse Gemini response.
    Never crash if JSON metadata is missing.
    """

    metadata = {}
    pdf_filename = None

    # 1️⃣ Try to extract JSON metadata (optional)
    json_match = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", text)
    if json_match:
        try:
            metadata = json.loads(json_match.group(1))
            pdf_filename = metadata.get("pdf_filename")
        except Exception:
            metadata = {}

    # 2️⃣ Fallback: generate filename if missing
    if not pdf_filename:
        safe_name = re.sub(r"[^\w]+", "_", text[:40]).strip("_")
        pdf_filename = f"{safe_name or 'Echo_Notes'}.pdf"

    # 3️⃣ Remove JSON block from markdown if present
    markdown_content = re.sub(r"```json[\s\S]*?```", "", text).strip()

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

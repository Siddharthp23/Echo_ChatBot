import google.generativeai as genai
from config import GEMINI_API_KEY
import re, json, os, markdown
from weasyprint import HTML

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

def call_gemini(note_prompt: str):
    response = model.generate_content(note_prompt)
    return response.text


def parse_response(text):
    # Extract JSON metadata
    json_match = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", text)
    metadata = json.loads(json_match.group(1))

    # Extract PDF filename
    pdf_filename = metadata["pdf_filename"]

    # Extract markdown
    markdown_content = re.sub(r"```json[\s\S]*?```", "", text).strip()
    markdown_content = re.sub(r"PDF:\s*.+$", "", markdown_content).strip()

    return metadata, markdown_content, pdf_filename


def create_pdf_from_markdown(markdown_data, pdf_filename):
    html = markdown.markdown(markdown_data, extensions=['fenced_code'])
    html_doc = f"""
    <html>
    <body style="font-family: Arial; padding:20px;">
        {html}
    </body>
    </html>
    """

    output_path = f"./storage/{pdf_filename}"
    HTML(string=html_doc).write_pdf(output_path)

    return output_path

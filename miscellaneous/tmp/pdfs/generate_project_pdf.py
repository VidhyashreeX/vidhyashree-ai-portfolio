from pathlib import Path
import textwrap

SRC = Path('README.md')
OUT = Path('output/pdf/Project_Workflow_Documentation.pdf')

raw = SRC.read_text(encoding='utf-8')

lines = []
for ln in raw.splitlines():
    if ln.startswith('#'):
        title = ln.lstrip('#').strip()
        lines.append('')
        lines.append(title.upper())
        lines.append('-' * min(len(title), 90))
        lines.append('')
        continue
    if ln.startswith('- '):
        ln = '• ' + ln[2:]
    elif ln.startswith('1. '):
        pass
    elif ln.startswith('```'):
        lines.append('')
        continue
    lines.append(ln)

wrapped = []
for ln in lines:
    if not ln.strip():
        wrapped.append('')
        continue
    for seg in textwrap.wrap(ln, width=95, break_long_words=False, break_on_hyphens=False):
        wrapped.append(seg)

# PDF primitives
PAGE_W, PAGE_H = 612, 792
MARGIN_X = 50
MARGIN_TOP = 64
MARGIN_BOTTOM = 56
LINE_H = 14

max_lines = int((PAGE_H - MARGIN_TOP - MARGIN_BOTTOM) // LINE_H)
pages = [wrapped[i:i+max_lines] for i in range(0, len(wrapped), max_lines)]

objects = []

def add_obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)

font_id = add_obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

content_ids = []
page_ids = []
for pno, page_lines in enumerate(pages, start=1):
    y_start = PAGE_H - MARGIN_TOP
    text_parts = [b"BT", b"/F1 10 Tf", b"14 TL", f"{MARGIN_X} {y_start} Td".encode()]
    first = True
    for ln in page_lines:
        safe = ln.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')
        if first:
            text_parts.append(f"({safe}) Tj".encode('latin-1', errors='replace'))
            first = False
        else:
            text_parts.append(b"T*")
            text_parts.append(f"({safe}) Tj".encode('latin-1', errors='replace'))

    text_parts.append(b"ET")

    footer = f"BT /F1 9 Tf {MARGIN_X} 30 Td (Page {pno} of {len(pages)}) Tj ET".encode()
    stream = b"\n".join(text_parts + [footer])
    content_obj = f"<< /Length {len(stream)} >>\nstream\n".encode() + stream + b"\nendstream"
    cid = add_obj(content_obj)
    content_ids.append(cid)

# Pages tree placeholder first
pages_tree_id = add_obj(b"<< /Type /Pages /Kids [] /Count 0 >>")

for cid in content_ids:
    page_obj = (
        f"<< /Type /Page /Parent {pages_tree_id} 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] "
        f"/Resources << /Font << /F1 {font_id} 0 R >> >> /Contents {cid} 0 R >>"
    ).encode()
    pid = add_obj(page_obj)
    page_ids.append(pid)

# Replace pages tree with real kids
kids = ' '.join(f"{pid} 0 R" for pid in page_ids)
objects[pages_tree_id-1] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode()

catalog_id = add_obj(f"<< /Type /Catalog /Pages {pages_tree_id} 0 R >>".encode())

# Write file
pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
offsets = [0]
for i, obj in enumerate(objects, start=1):
    offsets.append(len(pdf))
    pdf.extend(f"{i} 0 obj\n".encode())
    pdf.extend(obj)
    pdf.extend(b"\nendobj\n")

xref_pos = len(pdf)
pdf.extend(f"xref\n0 {len(objects)+1}\n".encode())
pdf.extend(b"0000000000 65535 f \n")
for off in offsets[1:]:
    pdf.extend(f"{off:010d} 00000 n \n".encode())

pdf.extend(
    f"trailer\n<< /Size {len(objects)+1} /Root {catalog_id} 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode()
)

OUT.write_bytes(pdf)
print(f'Wrote {OUT} ({OUT.stat().st_size} bytes)')

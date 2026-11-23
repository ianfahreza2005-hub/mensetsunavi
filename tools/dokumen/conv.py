"""Claude Docs XML (or light markdown) -> academic Word document (python-docx)."""
import json, re, sys, xml.etree.ElementTree as ET
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import docx.opc.constants

BODY = 'Times New Roman'; EA = 'MS Mincho'; MONO = 'Consolas'
MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

def set_font(run, size=None, bold=None, italic=None, mono=False, color=None):
    run.font.name = MONO if mono else BODY
    rpr = run._element.get_or_add_rPr()
    rf = rpr.find(qn('w:rFonts'))
    if rf is None:
        rf = OxmlElement('w:rFonts'); rpr.insert(0, rf)
    for a in ('w:ascii', 'w:hAnsi', 'w:cs'):
        rf.set(qn(a), MONO if mono else BODY)
    rf.set(qn('w:eastAsia'), EA)
    if size: run.font.size = Pt(size)
    if bold is not None: run.bold = bold
    if italic is not None: run.italic = italic
    if color: run.font.color.rgb = RGBColor.from_string(color)

def shade(cell, hexcol):
    tcPr = cell._tc.get_or_add_tcPr()
    sh = OxmlElement('w:shd'); sh.set(qn('w:val'), 'clear'); sh.set(qn('w:color'), 'auto'); sh.set(qn('w:fill'), hexcol)
    tcPr.append(sh)

def add_hyperlink(par, url, text, size):
    part = par.part
    rid = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    h = OxmlElement('w:hyperlink'); h.set(qn('r:id'), rid)
    r = OxmlElement('w:r'); rpr = OxmlElement('w:rPr')
    rf = OxmlElement('w:rFonts')
    for a in ('w:ascii', 'w:hAnsi', 'w:cs'): rf.set(qn(a), BODY)
    rf.set(qn('w:eastAsia'), EA); rpr.append(rf)
    c = OxmlElement('w:color'); c.set(qn('w:val'), '1F4E9A'); rpr.append(c)
    u = OxmlElement('w:u'); u.set(qn('w:val'), 'single'); rpr.append(u)
    sz = OxmlElement('w:sz'); sz.set(qn('w:val'), str(int(size * 2))); rpr.append(sz)
    r.append(rpr); t = OxmlElement('w:t'); t.text = text; t.set(qn('xml:space'), 'preserve'); r.append(t)
    h.append(r); par._p.append(h)

def fix_grid(t, widths):
    tbl = t._tbl; tblPr = tbl.tblPr
    tw = tblPr.find(qn('w:tblW'))
    if tw is None: tw = OxmlElement('w:tblW'); tblPr.append(tw)
    tw.set(qn('w:w'), str(int(sum(widths) * 567))); tw.set(qn('w:type'), 'dxa')
    lay = OxmlElement('w:tblLayout'); lay.set(qn('w:type'), 'fixed'); tblPr.append(lay)
    grid = tbl.tblGrid
    for j, gc in enumerate(grid.findall(qn('w:gridCol'))):
        gc.set(qn('w:w'), str(int(widths[j] * 567)))

# ---------------------------------------------------------------- inline runs
def runs_of(el):
    """Yield (text, bold, italic, code, href) from a <paragraph>."""
    out = []
    def walk(node, b=False, i=False, c=False, href=None):
        tag = node.tag
        if tag == 'bold': b = True
        elif tag == 'italic': i = True
        elif tag == 'code': c = True
        elif tag == 'link': href = node.get('href')
        if tag == 'date':
            y, m, d = node.get('value').split('-'); out.append((f'{int(d)} {MONTHS[int(m) - 1]} {y}', b, i, c, None)); return
        if tag == 'mention':
            return
        if node.text: out.append((node.text, b, i, c, href))
        for ch in node:
            walk(ch, b, i, c, href)
            if ch.tail: out.append((ch.tail, b, i, c, href))
    for ch in el:
        walk(ch)
    return out

def fill_par(par, el, size, force_bold=False):
    for t, b, i, c, href in runs_of(el):
        if href and href.startswith('http') and 'claude.ai/' not in href:
            add_hyperlink(par, href, t, size); continue
        r = par.add_run(t); set_font(r, size, bold=(b or force_bold) or None, italic=i or None, mono=c)

def para_fmt(par, before=0, after=6, line=1.15, align=None, indent=None, hanging=None):
    pf = par.paragraph_format
    pf.space_before = Pt(before); pf.space_after = Pt(after); pf.line_spacing = line
    if align is not None: par.alignment = align
    if indent is not None: pf.left_indent = Cm(indent)
    if hanging is not None: pf.first_line_indent = Cm(-hanging)

# ---------------------------------------------------------------- blocks
class W:
    def __init__(self, landscape=False):
        self.doc = Document()
        s = self.doc.sections[0]
        s.page_height, s.page_width = Cm(29.7), Cm(21.0)
        if landscape:
            s.orientation = WD_ORIENT.LANDSCAPE; s.page_width, s.page_height = Cm(29.7), Cm(21.0)
        s.left_margin = s.right_margin = Cm(2.5); s.top_margin = s.bottom_margin = Cm(2.5)
        self.width_cm = (29.7 if landscape else 21.0) - 5.0
        st = self.doc.styles['Normal']; st.font.name = BODY; st.font.size = Pt(12)
        st.element.rPr.rFonts.set(qn('w:eastAsia'), EA)
        # page number footer
        fp = s.footer.paragraphs[0]; fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = fp.add_run(); set_font(r, 10)
        for kind, txt in (('begin', None), (None, 'PAGE'), ('end', None)):
            if kind:
                f = OxmlElement('w:fldChar'); f.set(qn('w:fldCharType'), kind); r._r.append(f)
            else:
                it = OxmlElement('w:instrText'); it.set(qn('xml:space'), 'preserve'); it.text = txt; r._r.append(it)
        self.first_h1 = True

    def heading(self, el, level):
        p = self.doc.add_paragraph()
        if level == 1 and self.first_h1:
            self.first_h1 = False
            fill_par(p, el, 16, True); para_fmt(p, 0, 4, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
            p.style = self.doc.styles['Title'] if False else p.style
            return
        size = {1: 15, 2: 13, 3: 12}.get(level, 12)
        fill_par(p, el, size, True)
        para_fmt(p, 14 if level <= 2 else 10, 6, 1.0)
        p.paragraph_format.keep_with_next = True
        # outline level for navigation pane
        pPr = p._p.get_or_add_pPr(); ol = OxmlElement('w:outlineLvl'); ol.set(qn('w:val'), str(level - 1)); pPr.append(ol)

    def byline(self, el):
        texts = [t for t, *_ in runs_of(el)]
        date = ''.join(texts).replace('·', '').strip()
        p = self.doc.add_paragraph()
        r = p.add_run(f'Kelompok 2 · Kelas A · Pengembangan Multimedia Pembelajaran · {date}')
        set_font(r, 11, italic=True, color='444444'); para_fmt(p, 0, 14, 1.0, WD_ALIGN_PARAGRAPH.CENTER)

    def paragraph(self, el, container=None, size=12, after=6, indent=None):
        p = (container.add_paragraph() if container is not None else self.doc.add_paragraph())
        fill_par(p, el, size); para_fmt(p, 0, after, 1.15, None, indent)
        return p

    def lst(self, el, container=None, size=12, depth=0):
        ordered = el.get('kind') == 'ordered'
        n = 0
        for li in el.findall('listItem'):
            n += 1
            first = True
            for ch in li:
                if ch.tag == 'paragraph':
                    p = container.add_paragraph() if container is not None else self.doc.add_paragraph()
                    ind = 0.75 + depth * 0.65
                    if first:
                        mark = f'{n}.' if ordered else ('•' if depth == 0 else '–')
                        r = p.add_run(mark + '\t'); set_font(r, size)
                        para_fmt(p, 0, 3, 1.15, None, ind, 0.6)
                        tabs = p.paragraph_format.tab_stops; tabs.add_tab_stop(Cm(ind))
                        first = False
                    else:
                        para_fmt(p, 0, 3, 1.15, None, ind)
                    fill_par(p, ch, size)
                elif ch.tag == 'list':
                    self.lst(ch, container, size, depth + 1)
        # small gap after a top-level list
        if depth == 0 and container is None:
            self.doc.paragraphs[-1].paragraph_format.space_after = Pt(8)

    def table(self, el):
        rows = el.findall('row')
        ncol = max(len(r.findall('cell')) for r in rows)
        # widths from content length
        lens = [0] * ncol
        for r in rows:
            for j, c in enumerate(r.findall('cell')):
                L = len(''.join(c.itertext()))
                lens[j] = max(lens[j], min(L, 400))
        longest = [0] * ncol
        for r in rows:
            for j, c in enumerate(r.findall('cell')):
                for wd in ''.join(c.itertext()).split():
                    longest[j] = max(longest[j], min(len(wd), 18))
        mins = [min(4.0, max(1.3, lw * 0.19 + 0.45)) for lw in longest]
        w = [max(2.0, (l ** 0.62)) for l in lens]
        tot = sum(w); widths = [self.width_cm * x / tot for x in w]
        for _ in range(6):
            short = [j for j in range(ncol) if widths[j] < mins[j]]
            if not short: break
            for j in short: widths[j] = mins[j]
            fixed = sum(widths[j] for j in range(ncol) if widths[j] <= mins[j] + 1e-9)
            free = [j for j in range(ncol) if widths[j] > mins[j] + 1e-9]
            ftot = sum(w[j] for j in free)
            for j in free: widths[j] = (self.width_cm - fixed) * w[j] / ftot
        t = self.doc.add_table(rows=0, cols=ncol); t.style = 'Table Grid'; t.alignment = WD_TABLE_ALIGNMENT.CENTER
        t.autofit = False
        header_rows = 0
        for ri, r in enumerate(rows):
            cells = r.findall('cell')
            is_head = all(c.get('header') == 'true' for c in cells) and cells
            if is_head and all(not ''.join(c.itertext()).strip() for c in cells):
                continue  # empty header row (key–value tables)
            row = t.add_row()
            if is_head and ri == header_rows:
                header_rows += 1
                trPr = row._tr.get_or_add_trPr(); th = OxmlElement('w:tblHeader'); th.set(qn('w:val'), 'true'); trPr.append(th)
            for j in range(ncol):
                cell = row.cells[j]; cell.width = Cm(widths[j])
                cell.paragraphs[0].text = ''
                if j >= len(cells): continue
                c = cells[j]
                first = True
                for ch in c:
                    if ch.tag == 'paragraph':
                        p = cell.paragraphs[0] if first else cell.add_paragraph()
                        first = False
                        fill_par(p, ch, 10, bool(is_head)); para_fmt(p, 0, 2, 1.0)
                    elif ch.tag == 'list':
                        self.lst(ch, cell, 10, 0)
                        if first:
                            first = False
                if first is False and not cell.paragraphs[0].text and len(cell.paragraphs) > 1:
                    cell._tc.remove(cell.paragraphs[0]._p)
                if is_head: shade(cell, 'D9E2F3')
        for row in t.rows:
            for j, cell in enumerate(row.cells):
                cell.width = Cm(widths[j])
        fix_grid(t, widths)
        sp = self.doc.add_paragraph(); para_fmt(sp, 0, 4, 1.0)

    def code(self, el):
        txt = ''.join(el.itertext())
        t = self.doc.add_table(rows=1, cols=1); t.style = 'Table Grid'
        cell = t.rows[0].cells[0]; shade(cell, 'F2F2F2'); cell.width = Cm(self.width_cm); fix_grid(t, [self.width_cm])
        lines = txt.split('\n')
        p = cell.paragraphs[0]
        for k, ln in enumerate(lines):
            if k: p = cell.add_paragraph()
            r = p.add_run(ln); set_font(r, 9, mono=True); para_fmt(p, 0, 0, 1.0)
        sp = self.doc.add_paragraph(); para_fmt(sp, 0, 4, 1.0)

    def build(self, root):
        kids = list(root)
        for k, el in enumerate(kids):
            if el.tag == 'paragraph':
                lv = el.get('heading')
                if lv: self.heading(el, int(lv)); continue
                if el.find('date') is not None and k <= 2:
                    self.byline(el); continue
                if not ''.join(el.itertext()).strip(): continue
                self.paragraph(el)
            elif el.tag == 'list': self.lst(el)
            elif el.tag == 'table': self.table(el)
            elif el.tag == 'codeBlock': self.code(el)

def convert(xml, out, landscape=False):
    root = ET.fromstring(xml)
    w = W(landscape); w.build(root)
    w.doc.core_properties.author = 'Kelompok 2 Kelas A'
    w.doc.save(out)

# ---------------------------------------------------------------- light markdown -> same XML
def md_inline(s):
    from xml.sax.saxutils import escape
    out = ''
    for part in re.split(r'(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)', s):
        if part.startswith('`') and len(part) > 1: out += f'<text><code>{escape(part[1:-1])}</code></text>'
        elif part.startswith('**'): out += f'<text><bold>{escape(part[2:-2])}</bold></text>'
        elif part.startswith('*') and len(part) > 2: out += f'<text><italic>{escape(part[1:-1])}</italic></text>'
        elif part: out += f'<text>{escape(part)}</text>'
    return out

def md_to_xml(md):
    lines = md.split('\n'); i = 0; out = ['<doc>']
    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln: i += 1; continue
        m = re.match(r'(#{1,3}) (.*)', ln)
        if m:
            out.append(f"<paragraph heading='{len(m.group(1))}'>{md_inline(m.group(2))}</paragraph>"); i += 1; continue
        if ln.startswith('```'):
            from xml.sax.saxutils import escape
            i += 1; buf = []
            while i < len(lines) and not lines[i].startswith('```'):
                buf.append(lines[i]); i += 1
            i += 1
            out.append('<codeBlock><text>' + escape('\n'.join(buf)) + '</text></codeBlock>'); continue
        if ln.startswith('@date '):
            out.append(f"<paragraph><date value='{ln[6:].strip()}'/></paragraph>"); i += 1; continue
        if ln.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append(lines[i]); i += 1
            x = ['<table>']
            hdr = len(rows) > 1 and re.match(r'^\|[\s\-:|]+\|$', rows[1])
            for k, r in enumerate(rows):
                if hdr and k == 1: continue
                cells = [c.strip() for c in r.strip().strip('|').split('|')]
                h = " header='true'" if hdr and k == 0 else ''
                x.append('<row>' + ''.join(f"<cell{h}><paragraph>{md_inline(c)}</paragraph></cell>" for c in cells) + '</row>')
            out.append(''.join(x) + '</table>'); continue
        if re.match(r'(- |\d+\. )', ln):
            kind = 'bullet' if ln.startswith('- ') else 'ordered'
            items = []
            while i < len(lines) and re.match(r'(- |\d+\. )', lines[i]):
                items.append(re.sub(r'^(- |\d+\. )', '', lines[i])); i += 1
            out.append(f"<list kind='{kind}'>" + ''.join(f'<listItem><paragraph>{md_inline(t)}</paragraph></listItem>' for t in items) + '</list>'); continue
        out.append(f'<paragraph>{md_inline(ln)}</paragraph>'); i += 1
    out.append('</doc>')
    return ''.join(out)

if __name__ == '__main__':
    pass

import json, os, datetime
import os
ROOT = os.path.dirname(os.path.abspath(__file__))
os.makedirs(ROOT, exist_ok=True)

C = dict(ink='#16213E', ink2='#4A5670', pri='#2A4B8D', priD='#1C3566', priL='#E4EBF8', ground='#F7F3EC', card='#FFFFFF',
         line='#E4DED2', sakura='#E07A93', sakuraD='#A83A5A', sakuraL='#FCE8EE', good='#23784A', goodL='#E1F3E8',
         warn='#8F5600', warnL='#FCEFD6', bad='#B3261E', badL='#FBE6E4', hanko='#C0392B', gold='#F2B84B')
BAB = {1: ('#2A4B8D', '#E4EBF8', 'Mengenal Mensetsu'), 2: ('#0E7470', '#DDF2F0', 'Hou-Ren-Sou'), 3: ('#B0436A', '#FBE6EE', 'Nyuushitsu & Ojigi'),
       4: ('#A8650F', '#FBEEDA', 'Jikoshoukai'), 5: ('#5B46A8', '#ECE7FA', 'Menjawab Pertanyaan'), 6: ('#23784A', '#E1F3E8', 'Taishitsu')}
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">'
         '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">')
FF = "'Plus Jakarta Sans','Noto Sans JP',system-ui,sans-serif"
JP = "'Noto Sans JP','Plus Jakarta Sans',sans-serif"
SH = '0 10px 28px rgba(22,33,62,.10)'
SH2 = '0 4px 12px rgba(22,33,62,.08)'

# ---------------------------------------------------------------- icons
P = {
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'speaker': '<path d="M5 9v6h4l5 4V5L9 9H5z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
    'back': '<path d="M15 5l-7 7 7 7"/>', 'next': '<path d="M9 5l7 7-7 7"/>',
    'mic': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    'lock': '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    'star': '<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/>',
    'book': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
    'chat': '<path d="M4 5h16v11H9l-5 4z"/>', 'bulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    'gear': '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    'home': '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>', 'x': '<path d="M6 6l12 12M18 6L6 18"/>',
    'eye': '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'download': '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    'flip': '<path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2"/><path d="M20 4v4h-4M4 20v-4h4"/>',
    'repeat': '<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5"/>',
    'full': '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', 'pause': '<path d="M8 5v14M16 5v14"/>',
    'map': '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', 'trophy': '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/>',
}
def ic(name, size=22, color=None, sw=2):
    col = color or 'currentColor'
    if name == 'play':
        return f'<svg aria-hidden="true" width="{size}" height="{size}" viewBox="0 0 24 24" fill="{col}"><path d="M8 5v14l11-7z"/></svg>'
    return (f'<svg aria-hidden="true" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round">{P[name]}</svg>')

def jp(t, size=22, w=700, color=None):
    return f'<span lang="ja" style="font-family: {JP}; font-size: {size}px; font-weight: {w}{"; color: " + color if color else ""}">{t}</span>'

# ---------------------------------------------------------------- decor
def seigaiha(w, h, color, op=.18, pid='sg'):
    return (f'<svg aria-hidden="true" width="{w}" height="{h}" style="position: absolute; left: 0; top: 0" viewBox="0 0 {w} {h}">'
            f'<defs><pattern id="{pid}" width="40" height="20" patternUnits="userSpaceOnUse">'
            f'<g fill="none" stroke="{color}" stroke-width="1.4" opacity="{op}">'
            + ''.join(f'<circle cx="20" cy="20" r="{r}"/><circle cx="0" cy="10" r="{r}"/><circle cx="40" cy="10" r="{r}"/>' for r in (18, 13, 8, 3)) +
            f'</g></pattern></defs><rect width="{w}" height="{h}" fill="url(#{pid})"/></svg>')

def petals(positions, color=C['sakura']):
    out = ''
    for x, y, s, r in positions:
        out += (f'<svg aria-hidden="true" width="{s}" height="{s}" viewBox="0 0 20 20" style="position: absolute; left: {x}px; top: {y}px; transform: rotate({r}deg)">'
                f'<path d="M10 2c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z" fill="{color}" opacity=".75"/><path d="M10 6v8" stroke="#FFFFFF" stroke-width="1" opacity=".6"/></svg>')
    return out

def mascot(size, mood='senang'):
    return f'<dc-import name="Mascot" size="{size}" mood="{mood}" hint-size="{size}px,{size}px"></dc-import>'

def person(fill, skin='#F2C9A5', hair='#2A211C', tie=None, w=80, h=120, female=False):
    hairp = '<path d="M26 26c0-14 28-14 28 0v8c-4-6-24-6-28 0z" fill="%s"/>' % hair if not female else '<path d="M24 30c0-18 32-18 32 0v14c-3-4-3-10-6-12-6 4-14 4-20 0-3 2-3 8-6 12z" fill="%s"/>' % hair
    t = f'<path d="M40 58l-4 10 4 22 4-22z" fill="{tie}"/>' if tie else ''
    return (f'<svg aria-hidden="true" width="{w}" height="{h}" viewBox="0 0 80 120"><circle cx="40" cy="32" r="15" fill="{skin}"/>{hairp}'
            f'<path d="M14 120V80a26 26 0 0 1 52 0v40z" fill="{fill}"/><path d="M32 56l8 12 8-12z" fill="#FFFFFF"/>{t}</svg>')

# ---------------------------------------------------------------- page shell
def page(title, body, w, h, props_extra=''):
    return f'''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONTS}
<style>body{{margin:0}}a{{color:{C["pri"]}}}a:hover{{color:{C["priD"]}}}</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''

def dframe(inner, bg=None):
    return (f'<div style="width: 100%; min-height: 900px; box-sizing: border-box; background: {bg or C["ground"]}; font-family: {FF}; color: {C["ink"]}; '
            f'display: flex; flex-direction: column; overflow: hidden; position: relative">{inner}</div>')

def frame(inner, w, h, bg=None, extra=''):
    return (f'<div style="width: {w}px; height: {h}px; box-sizing: border-box; background: {bg or C["ground"]}; font-family: {FF}; color: {C["ink"]}; '
            f'display: flex; flex-direction: column; overflow: hidden; position: relative; {extra}">{inner}</div>')

def btn(label, kind='pri', icon=None, full=False, small=False, color=None, href=None):
    pc = color or C['pri']
    styles = {'pri': f'background: {pc}; color: #FFFFFF; border: 0; box-shadow: 0 6px 14px rgba(22,33,62,.18)',
              'ghost': f'background: #FFFFFF; color: {pc}; border: 1.5px solid {pc}',
              'off': f'background: {C["line"]}; color: {C["ink2"]}; border: 0',
              'soft': f'background: {C["priL"]}; color: {C["priD"]}; border: 0',
              'light': 'background: #FFFFFF; color: %s; border: 0; box-shadow: 0 6px 14px rgba(0,0,0,.15)' % pc}[kind]
    pad = '10px 16px' if small else '14px 22px'
    tag_open = f'<a href="{href}" style="text-decoration: none; ' if href else '<button type="button" style="'
    tag_close = '</a>' if href else '</button>'
    return (f'{tag_open}{styles}; border-radius: 16px; padding: {pad}; min-height: 48px; box-sizing: border-box; font-family: {FF}; font-size: {14 if small else 16}px; font-weight: 800; '
            f'display: inline-flex; align-items: center; justify-content: center; gap: 8px; {"width: 100%;" if full else ""} cursor: pointer">{ic(icon, 18) if icon else ""}{label}{tag_close}')

def iconbtn(name, label, bg='#FFFFFF', fg=None, border=True, size=44):
    return (f'<button type="button" aria-label="{label}" style="width: {size}px; height: {size}px; flex: none; border-radius: 14px; '
            f'border: {"1px solid " + C["line"] if border else "0"}; background: {bg}; color: {fg or C["ink"]}; display: flex; align-items: center; justify-content: center">{ic(name, 20)}</button>')

def chip(t, bg, fg, size=12):
    return f'<span style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; background: {bg}; color: {fg}; font-size: {size}px; font-weight: 800; white-space: nowrap">{t}</span>'

def toggles():
    t = lambda s: f'<span style="font-size: 11px; font-weight: 800; padding: 6px 9px; border-radius: 999px; background: {C["ink"]}; color: #FFFFFF">{s}</span>'
    return f'<div style="display: flex; gap: 4px">{t("Romaji")}{t("Arti")}</div>'

def topbar(title, sub, col):
    return (f'<div style="display: flex; align-items: center; gap: 10px; padding: 14px 16px 12px; background: #FFFFFF">'
            f'{iconbtn("menu", "Menu")}'
            f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 11px; font-weight: 800; color: {col}; letter-spacing: .04em">{sub}</span>'
            f'<span style="font-size: 15px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{title}</span></div>'
            f'{toggles()}{iconbtn("speaker", "Suara", C["priL"], C["pri"], False)}</div>')

def progress(pct, col, label=None):
    return (f'<div style="padding: 0 16px 10px; background: #FFFFFF; border-bottom: 1px solid {C["line"]}"><div style="display: flex; align-items: center; gap: 10px">'
            f'<div style="flex: 1; height: 8px; border-radius: 999px; background: {C["line"]}"><div style="width: {pct}%; height: 8px; background: {col}; border-radius: 999px"></div></div>'
            f'<span style="font-size: 11px; color: {C["ink2"]}; font-weight: 800">{label or ""}</span></div></div>')

def bottombar(num, col, nxt='Lanjut', on=True):
    return (f'<div style="margin-top: auto; display: flex; align-items: center; gap: 10px; padding: 12px 16px 22px; background: #FFFFFF; border-top: 1px solid {C["line"]}">'
            f'<button type="button" style="min-height: 48px; padding: 0 14px; border-radius: 16px; border: 1.5px solid {C["line"]}; background: #FFFFFF; color: {C["ink"]}; font-family: {FF}; font-size: 15px; font-weight: 800; display: flex; align-items: center; gap: 4px">{ic("back", 18)}<span>Kembali</span></button>'
            f'<span style="flex: 1; text-align: center; font-size: 13px; font-weight: 800; color: {C["ink2"]}">{num}</span>'
            f'<button type="button" style="min-height: 48px; padding: 0 18px; border-radius: 16px; border: 0; background: {col if on else C["line"]}; color: {"#FFFFFF" if on else C["ink2"]}; font-family: {FF}; font-size: 15px; font-weight: 800; display: flex; align-items: center; gap: 4px; box-shadow: 0 6px 14px rgba(22,33,62,.18)">{nxt}{ic("next", 18)}</button></div>')

def bubble(text, size=48, mood='senang', tail='left', bg='#FFFFFF'):
    return (f'<div style="display: flex; gap: 10px; align-items: flex-end">{mascot(size, mood)}'
            f'<div style="flex: 1; background: {bg}; border-radius: 18px 18px 18px 4px; padding: 11px 13px; font-size: 13px; line-height: 1.5; box-shadow: {SH2}">{text}</div></div>')

def card(inner, pad=16, extra=''):
    return f'<div style="background: #FFFFFF; border-radius: 22px; padding: {pad}px; box-shadow: {SH}; {extra}">{inner}</div>'

# ---------------------------------------------------------------- reusable illustrations
def office_scene(w, h, pid, door=True, tanaka=False, dark=False):
    wall = '#EFE6D6' if not dark else '#D9CDB6'
    s = (f'<svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" style="position: absolute; left: 0; top: 0">'
         f'<rect width="400" height="260" fill="{wall}"/><rect y="196" width="400" height="64" fill="#C9B38F"/><rect y="192" width="400" height="6" fill="#B49C76"/>'
         f'<rect x="250" y="38" width="120" height="86" rx="4" fill="#BFD7EA"/><path d="M250 98l34-26 26 20 22-14 38 26v20H250z" fill="#9FC2DD"/><rect x="250" y="38" width="120" height="86" rx="4" fill="none" stroke="#FFFFFF" stroke-width="6"/><path d="M310 38v86" stroke="#FFFFFF" stroke-width="4"/>'
         f'<rect x="24" y="150" width="26" height="46" rx="4" fill="#7D5A3C"/><circle cx="37" cy="134" r="22" fill="#4E9A6B"/><circle cx="24" cy="146" r="14" fill="#5FAE7C"/><circle cx="50" cy="146" r="14" fill="#3F8A5C"/>')
    if door:
        s += '<rect x="80" y="54" width="86" height="142" rx="3" fill="#8A5E3B"/><rect x="88" y="62" width="70" height="126" rx="2" fill="#A57149"/><circle cx="148" cy="128" r="5" fill="#E9C46A"/>'
    if tanaka:
        s += ('<rect x="210" y="150" width="170" height="14" rx="4" fill="#6E4A2D"/><rect x="222" y="164" width="8" height="32" fill="#5A3B23"/><rect x="360" y="164" width="8" height="32" fill="#5A3B23"/>'
              '<circle cx="296" cy="98" r="20" fill="#F0C8A2"/><path d="M276 92c2-16 38-16 40 0-8-6-30-6-40 0z" fill="#2E2A27"/><path d="M262 150v-12a34 34 0 0 1 68 0v12z" fill="#2A3550"/><path d="M290 118l6 10 6-10z" fill="#FFFFFF"/><path d="M296 124l-3 8 3 14 3-14z" fill="#B0436A"/>'
              '<circle cx="289" cy="98" r="2.4" fill="#2E2A27"/><circle cx="303" cy="98" r="2.4" fill="#2E2A27"/><path d="M290 108q6 4 12 0" fill="none" stroke="#2E2A27" stroke-width="2" stroke-linecap="round"/>'
              '<rect x="236" y="138" width="34" height="12" rx="2" fill="#F4F1EA"/>')
    return s + '</svg>'

FILES = {}

# ================================================================ MASCOT (placeholder, swap with team mascot)
def mascot_svg(mood):
    eyes = ('<ellipse cx="47" cy="58" rx="6" ry="7.5" fill="#16213E"/><ellipse cx="73" cy="58" rx="6" ry="7.5" fill="#16213E"/><circle cx="49" cy="55" r="2.2" fill="#FFFFFF"/><circle cx="75" cy="55" r="2.2" fill="#FFFFFF"/>'
            if mood != 'tenang' else '<path d="M41 59q6-6 12 0M67 59q6-6 12 0" fill="none" stroke="#16213E" stroke-width="3.5" stroke-linecap="round"/>')
    mouth = '<path d="M52 72q8 8 16 0" fill="#B0436A" stroke="#16213E" stroke-width="2.5" stroke-linejoin="round"/>' if mood != 'tenang' else '<path d="M54 73q6 4 12 0" fill="none" stroke="#16213E" stroke-width="3" stroke-linecap="round"/>'
    arm = ('<path d="M98 78q16-10 14-32" fill="none" stroke="#2A4B8D" stroke-width="10" stroke-linecap="round"/><circle cx="112" cy="44" r="7" fill="#FFFFFF" stroke="#2A4B8D" stroke-width="3"/>'
           if mood == 'menyapa' else '<path d="M98 82q10 8 8 18" fill="none" stroke="#2A4B8D" stroke-width="10" stroke-linecap="round"/>')
    return ('<svg role="img" aria-label="Maskot Mensetsu Navi" width="100%" height="100%" viewBox="0 0 120 120">'
            '<ellipse cx="60" cy="114" rx="30" ry="4" fill="#16213E" opacity=".12"/>'
            '<path d="M60 6l6 12h-12z" fill="#E07A93"/><circle cx="60" cy="6" r="4" fill="#F2B84B"/>'
            '<path d="M22 82q-12 6-10 18" fill="none" stroke="#2A4B8D" stroke-width="10" stroke-linecap="round"/>' + arm +
            '<rect x="16" y="18" width="88" height="92" rx="40" fill="#2A4B8D"/>'
            '<path d="M16 84q44 22 88 0v6a40 40 0 0 1-40 20h-8a40 40 0 0 1-40-20z" fill="#1C3566"/>'
            '<rect x="26" y="32" width="68" height="56" rx="28" fill="#FFFFFF"/>' + eyes + mouth +
            '<ellipse cx="36" cy="70" rx="6" ry="4" fill="#E07A93" opacity=".6"/><ellipse cx="84" cy="70" rx="6" ry="4" fill="#E07A93" opacity=".6"/>'
            '<path d="M56 96h8l-4 8z" fill="#F2B84B"/></svg>')

FILES['Mascot.dc.html'] = f'''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Maskot (sementara)</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>body{{margin:0}}</style>
</helmet>
<div style="width: {{{{px}}}}; height: {{{{px}}}}; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif">
<sc-if value="{{{{senang}}}}" hint-placeholder-val="{{{{ true }}}}">{mascot_svg("senang")}</sc-if>
<sc-if value="{{{{tenang}}}}" hint-placeholder-val="{{{{ false }}}}">{mascot_svg("tenang")}</sc-if>
<sc-if value="{{{{menyapa}}}}" hint-placeholder-val="{{{{ false }}}}">{mascot_svg("menyapa")}</sc-if>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"size":{{"editor":"int","default":240,"min":24,"max":600}},"mood":{{"editor":"enum","options":["senang","tenang","menyapa"],"default":"senang"}},"$preview":{{"width":240,"height":240}}}}'>
class Component extends DCLogic {{
renderVals() {{
const s = parseInt(this.props.size, 10) || 240;
const m = this.props.mood || 'senang';
return {{ px: s + 'px', senang: m === 'senang', tenang: m === 'tenang', menyapa: m === 'menyapa' }};
}}
}}
</script>
</body>
</html>
'''

# ================================================================ STYLE GUIDE
def sw(name, hexv, use):
    return (f'<div style="display: flex; flex-direction: column; gap: 6px; width: 128px"><div style="height: 72px; border-radius: 16px; background: {hexv}; box-shadow: inset 0 0 0 1px rgba(22,33,62,.08)"></div>'
            f'<span style="font-size: 13px; font-weight: 800">{name}</span><span style="font-size: 11px; color: {C["ink2"]}">{hexv} · {use}</span></div>')
babsw = ''.join(f'<div style="flex: 1; border-radius: 16px; overflow: hidden; box-shadow: {SH2}"><div style="height: 56px; background: {c}; position: relative; overflow: hidden">{seigaiha(200, 56, "#FFFFFF", .25, "sgb%d" % n)}</div>'
                f'<div style="background: {l}; padding: 8px 10px"><div style="font-size: 12px; font-weight: 800; color: {c}">Bab {n}</div><div style="font-size: 11px; color: {C["ink"]}">{t}</div></div></div>'
                for n, (c, l, t) in BAB.items())
icons = ''.join(f'<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; width: 58px; font-size: 10px; color: {C["ink2"]}"><div style="width: 42px; height: 42px; border-radius: 12px; background: {C["ground"]}; display: flex; align-items: center; justify-content: center; color: {C["ink"]}">{ic(n, 20)}</div>{lab}</div>'
                for n, lab in [('menu', 'Menu'), ('speaker', 'Suara'), ('mic', 'Rekam'), ('back', 'Kembali'), ('next', 'Lanjut'), ('lock', 'Kunci'), ('check', 'Selesai'), ('clock', 'Waktu'), ('book', 'Kosakata'), ('chat', 'Latihan'), ('bulb', 'Tips'), ('gear', 'Atur'), ('map', 'Peta'), ('repeat', 'Ulang'), ('download', 'Unduh'), ('trophy', 'Rapor')])
sg = f'''<div style="width: 1440px; height: 1240px; box-sizing: border-box; background: {C["ground"]}; font-family: {FF}; color: {C["ink"]}; display: flex; flex-direction: column; overflow: hidden">
<div style="height: 300px; position: relative; background: {C["pri"]}; color: #FFFFFF; overflow: hidden; display: flex; align-items: center; padding: 0 72px; gap: 40px">
{seigaiha(1440, 300, "#FFFFFF", .16, "sgh")}{petals([(980, 40, 22, 20), (1080, 210, 16, -30), (1300, 70, 26, 60), (720, 230, 14, 10)])}
<div style="position: relative; display: flex; flex-direction: column; gap: 10px; flex: 1"><span style="font-size: 13px; font-weight: 800; letter-spacing: .14em; color: #F9C9D6">PANDUAN GAYA INTERFACE · VERSI 2</span>
<span style="font-size: 54px; font-weight: 800; line-height: 1.05">Mensetsu Navi {jp("面接ナビ", 40, 900, "#FFFFFF")}</span>
<span style="font-size: 17px; max-width: 640px; line-height: 1.55; color: #DCE5F6">Hangat dan bersemangat, tetap rapi seperti kantor Jepang. Setiap bab punya warna sendiri supaya peserta tahu sedang di mana; pola ombak seigaiha dan kelopak sakura jadi ciri khas.</span></div>
<div style="position: relative; width: 240px; height: 240px; border-radius: 50%; background: rgba(255,255,255,.12); display: flex; align-items: center; justify-content: center">{mascot(200, "menyapa")}</div></div>
<div style="padding: 40px 72px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px">
<section style="grid-column: span 2; background: #FFFFFF; border-radius: 24px; padding: 24px; box-shadow: {SH}; display: flex; flex-direction: column; gap: 16px"><h2 style="margin: 0; font-size: 18px">Warna dasar</h2>
<div style="display: flex; flex-wrap: wrap; gap: 14px">{sw("Indigo 藍", C["pri"], "tombol, aktif")}{sw("Tinta", C["ink"], "teks")}{sw("Washi", C["ground"], "latar")}{sw("Sakura", C["sakura"], "aksen")}{sw("Emas", C["gold"], "bintang, prestasi")}{sw("Hijau", C["good"], "tepat")}{sw("Kuning tua", C["warn"], "kurang tepat")}{sw("Merah", C["bad"], "salah")}</div>
<h2 style="margin: 8px 0 0; font-size: 18px">Warna per bab</h2><div style="display: flex; gap: 12px">{babsw}</div></section>
<section style="background: #FFFFFF; border-radius: 24px; padding: 24px; box-shadow: {SH}; display: flex; flex-direction: column; gap: 12px"><h2 style="margin: 0; font-size: 18px">Maskot</h2>
<div style="display: flex; justify-content: space-around; align-items: flex-end; background: {C["ground"]}; border-radius: 18px; padding: 14px 6px">{mascot(96, "senang")}{mascot(80, "tenang")}{mascot(96, "menyapa")}</div>
<div style="font-size: 13px; color: {C["ink2"]}; line-height: 1.5"><b style="color: {C["sakuraD"]}">Sementara.</b> Semua layar memanggil satu komponen maskot (senang, tenang, menyapa). Begitu gambar maskot tim dikirim, cukup komponen ini yang diganti dan semua layar ikut berubah.</div></section>
<section style="background: #FFFFFF; border-radius: 24px; padding: 24px; box-shadow: {SH}; display: flex; flex-direction: column; gap: 10px"><h2 style="margin: 0; font-size: 18px">Tipografi</h2>
<div style="font-size: 34px; font-weight: 800; line-height: 1.1">Judul bab 800</div><div style="font-size: 20px; font-weight: 800">Judul slide 800 · 20 px</div>
<div style="font-size: 15px; line-height: 1.6">Teks isi 400 · 15–16 px, tinggi baris 1,6. Plus Jakarta Sans, huruf buatan Jakarta.</div>
<div style="display: flex; flex-direction: column">{jp("失礼します。", 28, 700)}<span style="font-size: 14px; font-style: italic; color: {C["ink2"]}">shitsurei shimasu</span><span style="font-size: 14px">"Permisi."</span></div></section>
<section style="background: #FFFFFF; border-radius: 24px; padding: 24px; box-shadow: {SH}; display: flex; flex-direction: column; gap: 14px"><h2 style="margin: 0; font-size: 18px">Tombol dan label</h2>
<div style="display: flex; flex-wrap: wrap; gap: 10px">{btn("Lanjut", "pri", "next")}{btn("Lihat contoh", "ghost")}{btn("Lanjut", "off")}</div>
<div style="display: flex; flex-wrap: wrap; gap: 8px">{chip("Tepat +10", C["goodL"], C["good"])}{chip("Kurang tepat 0", C["warnL"], C["warn"])}{chip("Salah −10", C["badL"], C["bad"])}{chip("Bab 3", BAB[3][1], BAB[3][0])}</div>
<div style="font-size: 12px; color: {C["ink2"]}">Tinggi tombol ≥ 48 px, sudut 16 px, bayangan lembut. Abu-abu = syarat slide belum selesai.</div></section>
<section style="background: #FFFFFF; border-radius: 24px; padding: 24px; box-shadow: {SH}; display: flex; flex-direction: column; gap: 12px"><h2 style="margin: 0; font-size: 18px">Ikon garis 2 px</h2><div style="display: flex; flex-wrap: wrap; gap: 6px">{icons}</div></section>
<section style="grid-column: span 3; background: #FFFFFF; border-radius: 24px; padding: 24px 28px; box-shadow: {SH}; display: flex; gap: 36px; align-items: center">
<div style="width: 100px; height: 100px; border-radius: 50%; border: 5px solid {C["hanko"]}; color: {C["hanko"]}; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-12deg); flex: none">{jp("済", 40, 900)}<span style="font-size: 11px; font-weight: 800">BAB 3</span></div>
<div style="font-size: 13px; color: {C["ink2"]}; width: 220px">Stempel bab bergaya hanko, muncul dengan animasi cap saat kuis ≥ 80.</div>
<div style="width: 300px; display: flex; flex-direction: column; gap: 8px"><div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 800">{jp("信頼度", 13, 700)}<span>Trust Meter 60</span></div><div style="height: 14px; border-radius: 999px; background: {C["line"]}"><div style="width: 60%; height: 14px; border-radius: 999px; background: {C["good"]}"></div></div><span style="font-size: 12px; color: {C["ink2"]}">Hanya umpan balik visual di Simulasi.</span></div>
<div style="flex: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; font-size: 12px; color: {C["ink2"]}">
<div style="display: flex; flex-direction: column; gap: 6px; align-items: center"><div style="width: 54px; height: 96px; border-radius: 10px; border: 3px solid {C["ink"]}"></div>HP tegak 390 × 844</div>
<div style="display: flex; flex-direction: column; gap: 6px; align-items: center"><div style="width: 96px; height: 54px; border-radius: 10px; border: 3px solid {C["ink"]}"></div>HP landscape 844 × 390</div>
<div style="display: flex; flex-direction: column; gap: 6px; align-items: center"><div style="width: 120px; height: 76px; border-radius: 8px; border: 3px solid {C["ink"]}"></div>Laptop 1440 × 900</div></div></section>
</div></div>'''
FILES['StyleGuide.dc.html'] = page('Panduan gaya Mensetsu Navi', sg, 1440, 1240)

# ================================================================ PHONE PORTRAIT
PW, PH = 390, 844

# 01 Pembuka
b = (f'<div style="height: 400px; position: relative; background: {C["pri"]}; color: #FFFFFF; overflow: hidden">{seigaiha(390, 400, "#FFFFFF", .14, "sg1")}'
     f'{petals([(30, 70, 18, 20), (320, 40, 22, -20), (300, 250, 14, 50), (60, 290, 12, -40)])}'
     f'<div style="position: absolute; left: 0; right: 0; top: 54px; display: flex; flex-direction: column; align-items: center; gap: 6px">'
     f'<span style="font-size: 11px; font-weight: 800; letter-spacing: .2em; color: #F9C9D6">PEMANDU WAWANCARA KERJA</span>'
     f'<span style="font-size: 40px; font-weight: 800">Mensetsu Navi</span>{jp("面接ナビ", 22, 500, "#DCE5F6")}</div>'
     f'<div style="position: absolute; left: 0; right: 0; bottom: 10px; display: flex; justify-content: center">{mascot(190, "menyapa")}</div></div>'
     f'<div style="flex: 1; margin-top: -26px; position: relative; background: {C["ground"]}; border-radius: 28px 28px 0 0; padding: 22px 20px 26px; display: flex; flex-direction: column; gap: 14px">'
     f'<div style="font-size: 20px; font-weight: 800; line-height: 1.3">Halo! Wawancara di Jepang bukan hanya soal bahasa, tapi juga sikap.</div>'
     f'<label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 800">Nama panggilanmu<input type="text" value="Rani" style="min-height: 50px; border-radius: 16px; border: 2px solid {C["line"]}; padding: 0 16px; font-family: {FF}; font-size: 16px; color: {C["ink"]}; background: #FFFFFF"></label>'
     + card(f'<div style="display: flex; gap: 12px; align-items: center"><div style="width: 54px; height: 54px; border-radius: 16px; background: {BAB[3][1]}; display: flex; align-items: center; justify-content: center">{jp("田中", 16, 900, BAB[3][0])}</div>'
            f'<div style="flex: 1; font-size: 13px; line-height: 1.5"><b>Misimu:</b> kumpulkan 6 stempel, lalu yakinkan 田中さん dari さくら食品 di Simulasi.</div></div>', 14)
     + f'<div style="margin-top: auto">{btn("Mulai Pre-test", "pri", "next", full=True)}</div></div>')
FILES['Main.dc.html'] = page('01 Layar pembuka', frame(b, PW, PH), PW, PH)

# 02 Pre-test
def opt(L, t, sel=False, col=C['pri']):
    return (f'<button type="button" style="text-align: left; display: flex; gap: 12px; align-items: center; padding: 14px; border-radius: 18px; '
            f'border: {"2.5px solid " + col if sel else "2px solid transparent"}; background: {"#FFFFFF"}; box-shadow: {SH2}; font-family: {FF}; font-size: 15px; color: {C["ink"]}; line-height: 1.45; min-height: 56px">'
            f'<span style="width: 32px; height: 32px; flex: none; border-radius: 10px; background: {col if sel else C["ground"]}; color: {"#FFFFFF" if sel else C["ink"]}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">{L}</span><span>{t}</span></button>')
b = (f'<div style="position: relative; background: {C["ink"]}; color: #FFFFFF; padding: 18px 16px 22px; overflow: hidden">{seigaiha(390, 150, "#FFFFFF", .10, "sg2")}'
     f'<div style="position: relative; display: flex; align-items: center; gap: 10px"><div style="flex: 1"><div style="font-size: 11px; font-weight: 800; letter-spacing: .08em; color: #F9C9D6">PRE-TEST · BELUM DINILAI</div><div style="font-size: 22px; font-weight: 800">Soal 7 <span style="color: #9FB3D9">/ 20</span></div></div>'
     f'<span style="display: flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 999px; background: rgba(255,255,255,.14); font-size: 14px; font-weight: 800">{ic("clock", 16)}09:42</span></div>'
     f'<div style="position: relative; margin-top: 14px; display: flex; gap: 4px">' + ''.join(f'<span style="flex: 1; height: 6px; border-radius: 999px; background: {C["sakura"] if i < 7 else "rgba(255,255,255,.2)"}"></span>' for i in range(20)) + '</div></div>'
     f'<div style="flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; margin-top: -10px; background: {C["ground"]}; border-radius: 22px 22px 0 0; position: relative">'
     f'{chip("Bab 3 · Nyuushitsu", BAB[3][1], BAB[3][0])}'
     f'<div style="font-size: 18px; font-weight: 800; line-height: 1.45">Pewawancara berkata {jp("「どうぞおかけください」", 18)} (douzo okake kudasai). Apa yang kamu lakukan?</div>'
     + opt('A', 'Langsung duduk tanpa berkata apa-apa.') + opt('B', 'Mengucapkan 「失礼します」, ojigi ringan, lalu duduk.', True)
     + opt('C', 'Menjawab 「はい、どうぞ」 lalu duduk.') + opt('D', 'Tetap berdiri sampai pewawancara duduk lagi.')
     + f'<div style="font-size: 12px; color: {C["ink2"]}; text-align: center">Belum ada benar/salah di pre-test.</div></div>' + bottombar('7 / 20', C['pri']))
FILES['PreTest.dc.html'] = page('02 Soal pre-test', frame(b, PW, PH), PW, PH)

# 03 Beranda
def babtile(n, status, pct=0, saran=False):
    c, l, t = BAB[n]
    st = {'done': f'<span style="width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid {C["hanko"]}; color: {C["hanko"]}; display: flex; align-items: center; justify-content: center; transform: rotate(-12deg); background: #FFFFFF">{jp("済", 15, 900)}</span>',
          'now': f'<span style="font-size: 11px; font-weight: 800; color: #FFFFFF; background: {c}; padding: 4px 8px; border-radius: 999px">{pct}%</span>',
          'open': (f'<span style="font-size: 10px; font-weight: 800; color: {C["warn"]}; background: {C["warnL"]}; padding: 4px 7px; border-radius: 999px">Disarankan</span>' if saran else '')}[status]
    bar = f'<div style="height: 5px; border-radius: 999px; background: rgba(255,255,255,.6)"><div style="width: {pct}%; height: 5px; border-radius: 999px; background: {c}"></div></div>' if status == 'now' else ''
    return (f'<a href="BabCover.dc.html" style="text-decoration: none; color: {C["ink"]}; border-radius: 20px; background: {l}; padding: 12px; display: flex; flex-direction: column; gap: 8px; min-height: 104px; position: relative; overflow: hidden; '
            f'{"box-shadow: 0 0 0 2.5px " + c + ";" if status == "now" else ""}">'
            f'<div style="display: flex; justify-content: space-between; align-items: flex-start"><span style="width: 34px; height: 34px; border-radius: 12px; background: {c}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800">{n}</span>{st}</div>'
            f'<span style="font-size: 13px; font-weight: 800; line-height: 1.25">{t}</span>{bar}</a>')
eval_row = lambda icn, t, s: (f'<div style="flex: 1; border-radius: 16px; background: #FFFFFF; box-shadow: {SH2}; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: {C["ink2"]}">'
                              f'<span style="width: 32px; height: 32px; border-radius: 10px; background: {C["ground"]}; color: {C["ink2"]}; display: flex; align-items: center; justify-content: center">{ic(icn, 16)}</span>{t}<span style="font-weight: 600">{s}</span></div>')
b = (f'<div style="position: relative; background: {C["pri"]}; color: #FFFFFF; padding: 16px 16px 58px; overflow: hidden">{seigaiha(390, 260, "#FFFFFF", .14, "sg3")}'
     f'<div style="position: relative; display: flex; align-items: center; gap: 10px">{iconbtn("menu", "Menu", "rgba(255,255,255,.14)", "#FFFFFF", False)}<span style="flex: 1"></span>{iconbtn("speaker", "Suara", "rgba(255,255,255,.14)", "#FFFFFF", False)}</div>'
     f'<div style="position: relative; display: flex; align-items: center; gap: 6px; margin-top: 8px"><div style="flex: 1"><div style="font-size: 13px; color: #DCE5F6">Okaeri, selamat datang lagi</div><div style="font-size: 28px; font-weight: 800">Rani</div>'
     f'<div style="margin-top: 10px; display: flex; align-items: center; gap: 8px"><div style="width: 150px; height: 8px; border-radius: 999px; background: rgba(255,255,255,.2)"><div style="width: 40%; height: 8px; border-radius: 999px; background: {C["sakura"]}"></div></div><span style="font-size: 12px; font-weight: 800">4/10 bagian</span></div></div>'
     f'<div style="width: 118px; height: 118px">{mascot(118, "senang")}</div></div></div>'
     f'<div style="position: relative; margin: -42px 16px 0">' + card(f'<a href="Materi.dc.html" style="text-decoration: none; color: {C["ink"]}; display: flex; align-items: center; gap: 12px">'
            f'<span style="width: 48px; height: 48px; border-radius: 16px; background: {BAB[3][0]}; color: #FFFFFF; display: flex; align-items: center; justify-content: center">{ic("play", 20, "#FFFFFF")}</span>'
            f'<span style="flex: 1; display: flex; flex-direction: column"><span style="font-size: 11px; font-weight: 800; color: {BAB[3][0]}">LANJUTKAN · BAB 3</span><span style="font-size: 15px; font-weight: 800">B3-07 Dengar dan Tirukan</span></span>{ic("next", 20, C["ink2"])}</a>', 14) + '</div>'
     f'<div style="flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden"><div style="display: flex; justify-content: space-between; align-items: center"><span style="font-size: 16px; font-weight: 800">Perjalanan belajarmu</span>{chip("Pre-test selesai", C["goodL"], C["good"], 11)}</div>'
     f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">' + babtile(1, 'done') + babtile(2, 'done') + babtile(3, 'now', 54) + babtile(4, 'open', saran=True) + babtile(5, 'open') + babtile(6, 'open') + '</div>'
     f'<div style="display: flex; gap: 8px">' + eval_row('lock', 'Simulasi', '6 stempel') + eval_row('lock', 'Post-test', 'setelah Simulasi') + eval_row('trophy', 'Rapor', 'terakhir') + '</div></div>')
FILES['Beranda.dc.html'] = page('03 Beranda dan peta belajar', frame(b, PW, PH), PW, PH)

# 04 Sampul bab
c3, l3 = BAB[3][0], BAB[3][1]
les = lambda n, t, d, st: (f'<div style="display: flex; gap: 12px; align-items: center; padding: 12px 14px; background: #FFFFFF; border-radius: 18px; box-shadow: {SH2}">'
                           f'<span style="width: 34px; height: 34px; border-radius: 12px; background: {l3}; color: {c3}; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center">{n}</span>'
                           f'<span style="flex: 1; display: flex; flex-direction: column"><span style="font-size: 14px; font-weight: 800">{t}</span><span style="font-size: 12px; color: {C["ink2"]}">{d}</span></span>{st}</div>')
b = (f'<div style="height: 380px; position: relative; overflow: hidden; background: {c3}">{office_scene(390, 380, "sc4")}'
     f'<div style="position: absolute; left: 150px; bottom: 56px">{person("#2A3550", hair="#1F1A17", tie="#B0436A", w=86, h=130, female=True)}</div>'
     f'<div style="position: absolute; left: 16px; right: 16px; top: 14px; display: flex; gap: 8px">{iconbtn("back", "Kembali ke Beranda", "rgba(255,255,255,.9)", C["ink"], False)}<span style="flex: 1"></span>{chip("±12 menit · 13 slide", "rgba(255,255,255,.92)", c3)}</div>'
     f'<div style="position: absolute; right: 10px; bottom: 30px">{mascot(96, "menyapa")}</div></div>'
     f'<div style="flex: 1; margin-top: -26px; position: relative; background: {C["ground"]}; border-radius: 28px 28px 0 0; padding: 22px 18px 24px; display: flex; flex-direction: column; gap: 12px">'
     f'<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 12px; font-weight: 800; color: {c3}; letter-spacing: .08em">BAB 3</span><span style="font-size: 28px; font-weight: 800; line-height: 1.1">Nyuushitsu &amp; Ojigi</span>'
     f'<span>{jp("入室・お辞儀", 16, 500, C["ink2"])} <span style="font-size: 13px; color: {C["ink2"]}">· masuk ruangan &amp; membungkuk</span></span></div>'
     + les('P1', 'Langkah Masuk Ruangan', '6 slide · video peragaan', ic('check', 18, C['good'], 2.6)) + les('P2', 'Ojigi', '3 slide · slider sudut', '') + les('P3', 'Duduk dan Latihan', '2 slide', '')
     + f'<div style="margin-top: auto">{btn("Mulai Bab 3", "pri", "next", full=True, color=c3)}</div></div>')
FILES['BabCover.dc.html'] = page('04 Sampul bab', frame(b, PW, PH), PW, PH)

# 05 Materi kartu ungkapan
def phrase_card(w_style='', big=24):
    return (f'<div style="background: #FFFFFF; border-radius: 26px; box-shadow: {SH}; overflow: hidden; {w_style}">'
            f'<div style="background: {l3}; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between">{chip("Kamu · kartu 3 dari 5", "#FFFFFF", c3)}'
            f'<button type="button" aria-label="Putar audio" style="width: 52px; height: 52px; border-radius: 50%; border: 0; background: {c3}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(176,67,106,.35)">{ic("play", 20, "#FFFFFF")}</button></div>'
            f'<div style="padding: 18px 18px 20px; display: flex; flex-direction: column; gap: 10px"><div style="line-height: 1.55">{jp("〇〇と申します。<br>本日はよろしくお願いいたします。", big)}</div>'
            f'<div style="font-size: 14px; font-style: italic; color: {C["ink2"]}">… to moushimasu. Honjitsu wa yoroshiku onegai itashimasu.</div>'
            f'<div style="font-size: 15px; padding: 10px 12px; border-radius: 14px; background: {C["ground"]}; font-weight: 600">"Nama saya …. Mohon kerja samanya hari ini."</div></div></div>')
dots = lambda col: f'<div style="display: flex; justify-content: center; gap: 6px">' + ''.join(f'<span style="width: {22 if i == 2 else 8}px; height: 8px; border-radius: 999px; background: {col if i == 2 else C["line"]}"></span>' for i in range(5)) + '</div>'
def rec_row():
    return (f'<div style="background: #FFFFFF; border-radius: 22px; box-shadow: {SH2}; padding: 12px 14px; display: flex; align-items: center; gap: 12px">'
            f'<button type="button" aria-label="Rekam suaramu" style="width: 56px; height: 56px; flex: none; border-radius: 50%; border: 5px solid {C["sakuraL"]}; background: {C["sakura"]}; color: #FFFFFF; display: flex; align-items: center; justify-content: center">{ic("mic", 22, "#FFFFFF")}</button>'
            f'<div style="flex: 1; font-size: 13px; line-height: 1.45"><b>Tirukan!</b> Rekamanmu diputar berdampingan dengan contoh. Tidak dinilai.</div></div>')
b = (topbar('Dengar dan Tirukan', 'BAB 3 · P1 LANGKAH MASUK RUANGAN', c3) + progress(54, c3, '7/13')
     + f'<div style="flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; overflow: hidden">'
     + bubble('Dengarkan setiap ungkapan, lalu tirukan dengan suara jelas, ya!', 52)
     + phrase_card() + dots(c3) + rec_row() + '</div>' + bottombar('7 / 13', c3))
FILES['Materi.dc.html'] = page('05 Kartu ungkapan audio', frame(b, PW, PH), PW, PH)

# 06 Latihan komik
c2, l2 = BAB[2][0], BAB[2][1]
def panel(txt, scene):
    return (f'<div style="flex: 1; min-width: 0; border-radius: 16px; background: #FFFFFF; border: 2.5px solid {C["ink"]}; overflow: hidden; display: flex; flex-direction: column">'
            f'<div style="height: 86px; background: {scene}; position: relative; display: flex; align-items: flex-end; justify-content: center">{person(c2, w=50, h=74, female=True)}</div>'
            f'<div style="padding: 6px 7px; font-size: 11px; line-height: 1.35; font-weight: 600">{txt}</div></div>')
choice = lambda t, k: (f'<button type="button" style="text-align: left; padding: 13px 14px; min-height: 52px; border-radius: 18px; font-family: {FF}; font-size: 14px; line-height: 1.4; color: {C["ink"]}; display: flex; gap: 10px; align-items: center; '
                       + (f'border: 2.5px solid {C["good"]}; background: {C["goodL"]}' if k else f'border: 2px solid transparent; background: #FFFFFF; box-shadow: {SH2}') + f'">{ic("check", 18, C["good"], 2.6) if k else ""}{t}</button>')
b = (topbar('Komik Kasus', 'BAB 2 · P3 HOU-REN-SOU DI WAWANCARA', c2) + progress(85, c2, 'Kasus 1/4')
     + f'<div style="flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden">'
     f'<div style="display: flex; align-items: center; justify-content: space-between">{chip("Kasus 1 · di tempat kerja", l2, c2)}<span style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800">{jp("信頼", 12, 700)}<span style="width: 70px; height: 10px; border-radius: 999px; background: {C["line"]}"><span style="display: block; width: 72%; height: 10px; border-radius: 999px; background: {C["good"]}"></span></span></span></div>'
     f'<div style="display: flex; gap: 8px">' + panel('Hari ketiga di pabrik.', '#DDF2F0') + panel('Ups, label 20 produk tertempel salah!', '#FCEFD6') + panel('Belum ada yang tahu… Apa yang kamu lakukan?', '#FCE8EE') + '</div>'
     + choice('Segera melapor ke atasan, menjelaskan yang terjadi, dan meminta maaf.', True) + choice('Diam-diam memperbaiki 20 label itu sendiri.', False) + choice('Diam saja karena tidak ada yang tahu.', False)
     + bubble(f'<b style="color: {C["good"]}">Tepat! Ini houkoku.</b> Atasan bisa segera memeriksa produk lain yang mungkin sudah terkirim.', 46, 'senang', bg=C['goodL'])
     + '</div>' + bottombar('11 / 13', c2))
FILES['Latihan.dc.html'] = page('06 Latihan komik kasus', frame(b, PW, PH), PW, PH)

# 07 Rekam
c4, l4 = BAB[4][0], BAB[4][1]
HB = [10, 18, 26, 14, 30, 22, 8, 4, 4, 16, 28, 34, 20, 12, 26, 18, 6, 4, 4, 22, 30, 24, 16, 28, 12, 6, 4, 18, 26, 20, 14, 10, 6, 4, 4, 8, 14, 22, 18, 10]
def wave(n=36, col=None, gap=3, wd=4):
    return ''.join(f'<span style="width: {wd}px; height: {h}px; border-radius: 2px; background: {(col or C["pri"]) if i < n else C["line"]}"></span>' for i, h in enumerate(HB))
metric = lambda lab, val, note, col, bg: (f'<div style="flex: 1; border-radius: 18px; background: {bg}; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 11px; font-weight: 800; color: {C["ink2"]}">{lab}</span><span style="font-size: 18px; font-weight: 800; color: {col}">{val}</span><span style="font-size: 11px; color: {C["ink2"]}">{note}</span></div>')
chk = lambda t, on: (f'<label style="display: flex; gap: 10px; align-items: center; font-size: 13px; min-height: 34px"><input type="checkbox" {"checked" if on else ""} style="width: 20px; height: 20px; accent-color: {c4}">{t}</label>')
b = (topbar('Rekam Jikoshoukai-mu', 'BAB 4 · P4 JIKOSHOUKAI-KU', c4) + progress(88, c4, '15/17')
     + f'<div style="flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; overflow: hidden">'
     f'<div style="border-radius: 26px; background: {c4}; color: #FFFFFF; padding: 16px; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 10px">{seigaiha(358, 230, "#FFFFFF", .14, "sg7")}'
     f'<div style="position: relative; display: flex; gap: 3px; align-items: center; height: 40px">{wave(30, "#FFFFFF")}</div>'
     f'<div style="position: relative; font-size: 34px; font-weight: 800">0:42</div><span style="position: relative; font-size: 12px; font-weight: 700; color: #FCE3C2">zona ideal 30–60 detik</span>'
     f'<button type="button" aria-label="Rekam ulang" style="position: relative; width: 74px; height: 74px; border-radius: 50%; border: 6px solid rgba(255,255,255,.35); background: #FFFFFF; color: {c4}; display: flex; align-items: center; justify-content: center">{ic("mic", 28, c4)}</button></div>'
     f'<div style="display: flex; gap: 8px">' + metric('Durasi', '42 dtk', 'pas', C['good'], C['goodL']) + metric('Jeda', '5 jeda', 'antarblok', C['good'], C['goodL']) + metric('Volume', 'Pelan', 'naikkan', C['warn'], C['warnL']) + '</div>'
     + card(f'<div style="font-size: 12px; font-weight: 800; color: {C["ink2"]}; margin-bottom: 2px">CEK DIRI · bandingkan dengan contoh Rani</div>' + chk('Lima blok lengkap', True) + chk('Memakai と申します', True) + chk('Intonasi turun di akhir kalimat', False), 12)
     + f'<div style="display: flex; gap: 8px">{btn("Unduh rekaman", "ghost", "download", small=True, color=c4)}{btn("Unduh rubrik", "ghost", "download", small=True, color=c4)}</div></div>' + bottombar('15 / 17', c4))
FILES['Rekam.dc.html'] = page('07 Rekam suara', frame(b, PW, PH), PW, PH)

# 08 Hasil kuis
b = (f'<div style="height: 470px; position: relative; overflow: hidden; background: {c3}; color: #FFFFFF; display: flex; flex-direction: column; align-items: center">{seigaiha(390, 470, "#FFFFFF", .14, "sg8")}'
     f'{petals([(30, 90, 20, 10), (330, 60, 24, -30), (300, 300, 16, 40), (50, 330, 14, -10), (190, 40, 12, 70)], "#FFFFFF")}'
     f'<div style="position: relative; align-self: stretch; display: flex; padding: 14px 16px">{iconbtn("x", "Tutup", "rgba(255,255,255,.16)", "#FFFFFF", False)}</div>'
     f'<span style="position: relative; font-size: 12px; font-weight: 800; letter-spacing: .14em; color: #FBD5E2">KUIS BAB 3 SELESAI</span>'
     f'<div style="position: relative; margin-top: 14px; width: 200px; height: 200px; border-radius: 50%; background: #FFFFFF; color: {C["ink"]}; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 18px 40px rgba(0,0,0,.25)">'
     f'<span style="font-size: 64px; font-weight: 800; color: {C["good"]}; line-height: 1">80</span><span style="font-size: 13px; font-weight: 800; color: {C["ink2"]}">4 dari 5 benar</span>'
     f'<div style="position: absolute; right: -30px; top: -14px; width: 96px; height: 96px; border-radius: 50%; border: 5px solid {C["hanko"]}; background: #FFF8F4; color: {C["hanko"]}; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-14deg); box-shadow: 0 8px 18px rgba(0,0,0,.2)">{jp("済", 36, 900)}<span style="font-size: 10px; font-weight: 800">BAB 3</span></div></div>'
     f'<span style="position: relative; margin-top: 18px; font-size: 26px; font-weight: 800">Kamu lulus Bab 3!</span>'
     f'<div style="position: absolute; left: 6px; bottom: -6px">{mascot(110, "menyapa")}</div></div>'
     f'<div style="flex: 1; padding: 18px 16px 22px; display: flex; flex-direction: column; gap: 12px">'
     f'<div style="display: flex; gap: 8px">' + ''.join(f'<span style="flex: 1; height: 48px; border-radius: 14px; background: {"#FFFFFF" if i < 3 else C["line"]}; box-shadow: {SH2 if i < 3 else "none"}; display: flex; align-items: center; justify-content: center">{jp("済", 18, 900, C["hanko"]) if i < 3 else ic("lock", 16, C["ink2"])}</span>' for i in range(6)) + '</div>'
     f'<span style="font-size: 13px; color: {C["ink2"]}; text-align: center">Tiga stempel lagi sebelum Simulasi terbuka.</span>'
     f'<a href="Materi.dc.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: {C["ink"]}; min-height: 52px; padding: 0 14px; border-radius: 16px; background: {C["warnL"]}"><span style="flex: 1; font-size: 13px"><b>Ulas soal 4</b> · ungkapan masuk ruangan → B3-06</span>{ic("next", 18, C["warn"])}</a>'
     f'<div style="margin-top: auto; display: flex; gap: 10px">{btn("Menu", "ghost", "home", color=c3)}<div style="flex: 1">{btn("Lanjut ke Bab 4", "pri", "next", full=True, color=BAB[4][0])}</div></div></div>')
FILES['HasilKuis.dc.html'] = page('08 Hasil kuis dan stempel', frame(b, PW, PH), PW, PH)

# 09 Simulasi
def hud(dark_bg='rgba(22,33,62,.88)', trust=60, t=12):
    return (f'<div style="display: flex; align-items: center; gap: 8px">{chip("Momen 4/13 · Fase B", dark_bg, "#FFFFFF")}<span style="flex: 1"></span>'
            f'<div style="display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; background: {dark_bg}; color: #FFFFFF; font-size: 12px; font-weight: 800">{jp("信頼度", 12, 700)}'
            f'<span style="width: 60px; height: 8px; border-radius: 999px; background: #4A5F8C"><span style="display: block; width: {trust}%; height: 8px; border-radius: 999px; background: #7FD3A0"></span></span>{trust}</div>'
            f'<div style="width: 52px; height: 52px; border-radius: 50%; background: conic-gradient({C["sakura"]} 0 60%, {dark_bg} 60% 100%); display: flex; align-items: center; justify-content: center"><span style="width: 42px; height: 42px; border-radius: 50%; background: {C["ink"]}; color: #FFFFFF; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center">{t}</span></div></div>')
def speech(size=20):
    return (f'<div style="background: #FFFFFF; border-radius: 18px 18px 4px 18px; padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 8px 20px rgba(0,0,0,.18)">'
            f'{jp("「どうぞ。」", size)}<span style="font-size: 12px; font-style: italic; color: {C["ink2"]}">Douzo.</span></div>')
simopt = lambda t, sel=False, fs=14: (f'<button type="button" style="text-align: left; padding: 12px 14px; min-height: 52px; border-radius: 18px; font-family: {FF}; font-size: {fs}px; line-height: 1.4; color: #FFFFFF; display: flex; gap: 10px; align-items: center; '
                                     f'border: {"2.5px solid " + C["sakura"] if sel else "1.5px solid #3D5280"}; background: {"#2C4479" if sel else "#1E2D50"}"><span style="width: 10px; height: 10px; flex: none; border-radius: 50%; border: 2px solid {C["sakura"] if sel else "#7D8FB8"}; background: {C["sakura"] if sel else "transparent"}"></span>{t}</button>')
SIMQ = 'Terdengar 「どうぞ」. Apa yang kamu lakukan?'
SIMO = ['Masuk sambil mengucapkan 「失礼します」, menutup pintu pelan, menghadap Tanaka-san, lalu ojigi ±30°.', 'Masuk dan menutup pintu tanpa salam, lalu ojigi.', 'Masuk, membiarkan pintu terbuka, dan langsung berjalan ke kursi.']
b = (f'<div style="height: 360px; position: relative; overflow: hidden">{office_scene(390, 360, "sc9", door=False, tanaka=True)}'
     f'<div style="position: absolute; left: 12px; right: 12px; top: 14px">{hud()}</div>'
     f'<div style="position: absolute; left: 24px; top: 120px; width: 150px">{speech()}</div>'
     f'{chip("田中さん · さくら食品", "rgba(255,255,255,.92)", C["ink"], 11).replace("display: inline-flex", "position: absolute; right: 22px; bottom: 132px; display: inline-flex")}</div>'
     f'<div style="flex: 1; background: {C["ink"]}; color: #FFFFFF; padding: 18px 16px 22px; display: flex; flex-direction: column; gap: 10px; margin-top: -20px; border-radius: 24px 24px 0 0; position: relative">'
     f'<span style="font-size: 16px; font-weight: 800; line-height: 1.45">{SIMQ}</span>' + simopt(SIMO[0], True) + simopt(SIMO[1]) + simopt(SIMO[2])
     + f'<span style="font-size: 12px; color: #B9C4DA; margin-top: auto; text-align: center">Ucapan Tanaka-san tanpa arti. Pembahasan muncul di akhir.</span></div>')
FILES['Simulasi.dc.html'] = page('09 Momen simulasi', frame(b, PW, PH, C['ink']), PW, PH)

# 10 Rapor
def gauge(lab, v, col, d=92):
    inner = d - 20
    return (f'<div style="flex: 1; background: #FFFFFF; border-radius: 22px; box-shadow: {SH2}; padding: 14px 10px; display: flex; flex-direction: column; align-items: center; gap: 8px">'
            f'<div style="width: {d}px; height: {d}px; border-radius: 50%; background: conic-gradient({col} 0 {v}%, {C["line"]} {v}% 100%); display: flex; align-items: center; justify-content: center"><span style="width: {inner}px; height: {inner}px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800">{v}</span></div>'
            f'<span style="font-size: 12px; font-weight: 800; text-align: center; line-height: 1.3">{lab}</span></div>')
stamps = lambda s=40: ''.join(f'<span style="width: {s}px; height: {s}px; border-radius: 50%; border: 2.5px solid {C["hanko"]}; background: #FFFFFF; color: {C["hanko"]}; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-10deg); font-size: 9px; font-weight: 800">{jp("済", int(s * .36), 900)}{n}</span>' for n in range(1, 7))
b = (f'<div style="position: relative; background: {C["pri"]}; color: #FFFFFF; padding: 16px 16px 70px; overflow: hidden">{seigaiha(390, 300, "#FFFFFF", .14, "sg10")}{petals([(300, 30, 20, 20), (40, 200, 14, -30)])}'
     f'<div style="position: relative; display: flex; align-items: center">{iconbtn("menu", "Menu", "rgba(255,255,255,.14)", "#FFFFFF", False)}<span style="flex: 1; text-align: center; font-size: 15px; font-weight: 800">Rapor Kesiapan</span>{iconbtn("download", "Unduh rapor", "rgba(255,255,255,.14)", "#FFFFFF", False)}</div>'
     f'<div style="position: relative; display: flex; align-items: flex-end; gap: 6px; margin-top: 16px"><div style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 12px; font-weight: 800; color: #DCE5F6; letter-spacing: .08em">NILAI SUMATIF</span>'
     f'<span style="font-size: 72px; font-weight: 800; line-height: .95">86</span><span style="font-size: 12px; color: #DCE5F6">50% Simulasi + 50% Post-test</span>'
     f'<div style="display: flex; gap: 6px; margin-top: 6px">{chip(ic("check", 14, C["good"], 2.6) + "Lulus", C["goodL"], C["good"])}{chip("Siap Wawancara", "#FFFFFF", C["priD"])}</div></div>'
     f'<div style="width: 120px; height: 120px">{mascot(120, "menyapa")}</div></div></div>'
     f'<div style="flex: 1; margin-top: -48px; position: relative; padding: 0 16px 20px; display: flex; flex-direction: column; gap: 12px">'
     f'<div style="display: flex; gap: 10px">' + gauge('Skor Komunikasi', 83, C['pri']) + gauge('Skor Etika dan Budaya Kerja', 86, C['good']) + '</div>'
     + card(f'<div style="display: flex; align-items: center; gap: 12px"><div style="width: 48px; height: 48px; border-radius: 16px; background: {C["goodL"]}; display: flex; align-items: center; justify-content: center">{jp("田中", 15, 900, C["good"])}</div>'
            f'<div style="flex: 1; display: flex; flex-direction: column; gap: 6px"><div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 800"><span>Trust Meter akhir</span><span>80 · tersenyum</span></div><div style="height: 10px; border-radius: 999px; background: {C["line"]}"><div style="width: 80%; height: 10px; border-radius: 999px; background: {C["good"]}"></div></div></div></div>', 14)
     + card(f'<div style="font-size: 12px; font-weight: 800; color: {C["ink2"]}; margin-bottom: 10px">STEMPEL BAB</div><div style="display: flex; justify-content: space-between">{stamps(42)}</div>', 14)
     + f'<div style="margin-top: auto">{btn("Lihat rincian dan rekomendasi", "pri", "next", full=True)}</div></div>')
FILES['Rapor.dc.html'] = page('10 Rapor kesiapan', frame(b, PW, PH), PW, PH)

# 11 Menu
mi = lambda icn, t, sub, col, bg: (f'<a href="Kosakata.dc.html" style="text-decoration: none; color: {C["ink"]}; display: flex; align-items: center; gap: 12px; min-height: 58px; padding: 0 12px; border-radius: 18px">'
                                   f'<span style="width: 44px; height: 44px; border-radius: 14px; background: {bg}; color: {col}; display: flex; align-items: center; justify-content: center">{ic(icn, 20)}</span>'
                                   f'<span style="flex: 1; display: flex; flex-direction: column"><span style="font-size: 15px; font-weight: 800">{t}</span><span style="font-size: 12px; color: {C["ink2"]}">{sub}</span></span>{ic("next", 16, C["ink2"])}</a>')
b = (f'<div style="position: absolute; inset: 0; background: rgba(22,33,62,.5)"></div>'
     f'<div style="position: absolute; left: 0; top: 0; bottom: 0; width: 326px; background: #FFFFFF; display: flex; flex-direction: column; box-shadow: 8px 0 28px rgba(0,0,0,.18); border-radius: 0 28px 28px 0; overflow: hidden">'
     f'<div style="position: relative; background: {C["pri"]}; color: #FFFFFF; padding: 16px 14px 18px; overflow: hidden">{seigaiha(326, 160, "#FFFFFF", .14, "sg11")}'
     f'<div style="position: relative; display: flex; align-items: center; gap: 10px">{mascot(56, "senang")}<div style="flex: 1"><div style="font-size: 17px; font-weight: 800">Rani</div><div style="font-size: 12px; color: #DCE5F6">4 dari 10 bagian · 3 stempel</div></div>{iconbtn("x", "Tutup menu", "rgba(255,255,255,.14)", "#FFFFFF", False)}</div></div>'
     f'<div style="padding: 10px 6px; display: flex; flex-direction: column; gap: 2px">'
     + mi('home', 'Beranda', 'Peta belajar dan progres', C['pri'], C['priL']) + mi('book', 'Bank Kosakata', '±75 istilah · kartu hafalan', BAB[2][0], BAB[2][1])
     + mi('chat', 'Latihan Pertanyaan Acak', '25 pertanyaan wawancara', BAB[5][0], BAB[5][1]) + mi('bulb', 'Tips dan Trik', 'Sebelum, saat, sesudah', BAB[4][0], BAB[4][1])
     + mi('gear', 'Pengaturan', 'Romaji/Arti, audio, data', C['ink2'], C['ground'])
     + f'</div><div style="margin: 4px 14px; padding-top: 12px; border-top: 1px solid {C["line"]}; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 11px; font-weight: 800; color: {c3}; letter-spacing: .06em">BAB 3 · DAFTAR SLIDE</span>'
     + ''.join(f'<span style="font-size: 13px; padding: 8px 10px; border-radius: 10px; {"background: " + l3 + "; font-weight: 800; color: " + c3 + ";" if i == 7 else ""}">B3-{i:02d} · {t}</span>' for i, t in [(5, 'Masuk dan Menutup Pintu'), (6, 'Perkenalan Singkat dan Duduk'), (7, 'Dengar dan Tirukan'), (8, 'Tiga Jenis Ojigi'), (9, 'Cara Ojigi yang Benar')])
     + '</div></div>')
FILES['Menu.dc.html'] = page('11 Menu', frame(b, PW, PH), PW, PH)

# 12 Kosakata
c1, l1 = BAB[1][0], BAB[1][1]
b = (f'<div style="display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #FFFFFF">{iconbtn("back", "Kembali ke slide")}<span style="flex: 1; font-size: 18px; font-weight: 800">Bank Kosakata</span>{iconbtn("eye", "Daftar")}</div>'
     f'<div style="display: flex; gap: 6px; padding: 0 16px 12px; background: #FFFFFF; border-bottom: 1px solid {C["line"]}"><span style="flex: 1; text-align: center; padding: 10px; border-radius: 14px; background: {C["ground"]}; font-size: 14px; font-weight: 800; color: {C["ink2"]}">Daftar</span><span style="flex: 1; text-align: center; padding: 10px; border-radius: 14px; background: {C["ink"]}; color: #FFFFFF; font-size: 14px; font-weight: 800">Kartu hafalan</span></div>'
     f'<div style="flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 14px; overflow: hidden">'
     f'<div style="display: flex; justify-content: space-between; align-items: center"><span style="font-size: 13px; color: {C["ink2"]}; font-weight: 800">Sesi hari ini</span><span style="font-size: 13px; font-weight: 800">4 / 10</span></div>'
     f'<div style="position: relative; height: 330px"><div style="position: absolute; left: 22px; right: 22px; top: 18px; bottom: -10px; border-radius: 28px; background: {l1}"></div><div style="position: absolute; left: 10px; right: 10px; top: 8px; bottom: -2px; border-radius: 28px; background: #FFFFFF; box-shadow: {SH2}"></div>'
     f'<div style="position: absolute; inset: 0 0 6px; border-radius: 28px; background: #FFFFFF; box-shadow: {SH}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; overflow: hidden">'
     f'<div style="position: absolute; left: 0; right: 0; top: 0; height: 80px; background: {c1}; overflow: hidden">{seigaiha(358, 80, "#FFFFFF", .2, "sg12")}</div>'
     f'<span style="position: absolute; top: 14px; left: 14px">{chip("Bab 1 · istilah wawancara", "#FFFFFF", c1, 11)}</span>'
     f'<div style="margin-top: 40px">{jp("第一印象", 48, 900)}</div><span style="font-size: 16px; font-style: italic; color: {C["ink2"]}">daiichi inshou</span>'
     f'<button type="button" aria-label="Putar pelafalan" style="width: 56px; height: 56px; border-radius: 50%; border: 0; background: {c1}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(42,75,141,.35)">{ic("speaker", 22, "#FFFFFF")}</button>'
     f'<span style="font-size: 12px; color: {C["ink2"]}; display: flex; gap: 6px; align-items: center">{ic("flip", 16)}Ketuk untuk membalik</span></div></div>'
     f'<div style="display: flex; gap: 10px; margin-top: 8px">{btn("Belum tahu", "ghost", "repeat", color=C["bad"])}<div style="flex: 1">{btn("Sudah tahu", "pri", "check", full=True, color=C["good"])}</div></div>'
     f'<div style="display: flex; gap: 8px">' + ''.join(f'<div style="flex: 1; border-radius: 16px; background: {bg}; padding: 10px; display: flex; flex-direction: column"><span style="font-size: 11px; font-weight: 800; color: {C["ink2"]}">{lab}</span><span style="font-size: 22px; font-weight: 800; color: {fg}">{n}</span></div>'
                                                     for lab, n, bg, fg in [('Kotak 1 · belum', 23, C['badL'], C['bad']), ('Kotak 2 · hampir', 31, C['warnL'], C['warn']), ('Kotak 3 · hafal', 21, C['goodL'], C['good'])]) + '</div></div>')
FILES['Kosakata.dc.html'] = page('12 Bank kosakata', frame(b, PW, PH), PW, PH)

# ================================================================ PHONE LANDSCAPE 844x390
LW, LH = 844, 390
def ltop(title, sub, col):
    return (f'<div style="display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: #FFFFFF; border-bottom: 1px solid {C["line"]}">{iconbtn("menu", "Menu", size=40)}'
            f'<div style="display: flex; flex-direction: column"><span style="font-size: 10px; font-weight: 800; color: {col}; letter-spacing: .04em">{sub}</span><span style="font-size: 14px; font-weight: 800">{title}</span></div>'
            f'<div style="flex: 1; height: 6px; border-radius: 999px; background: {C["line"]}; margin: 0 12px"><div style="width: 54%; height: 6px; border-radius: 999px; background: {col}"></div></div>'
            f'{toggles()}{iconbtn("speaker", "Suara", C["priL"], C["pri"], False, 40)}</div>')
lnav = lambda col, num: (f'<div style="display: flex; flex-direction: column; gap: 8px; justify-content: center; align-items: center; width: 78px; background: #FFFFFF; border-left: 1px solid {C["line"]}">'
                         f'<button type="button" aria-label="Lanjut" style="width: 56px; height: 56px; border-radius: 18px; border: 0; background: {col}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(22,33,62,.18)">{ic("next", 22)}</button>'
                         f'<span style="font-size: 12px; font-weight: 800; color: {C["ink2"]}">{num}</span>'
                         f'<button type="button" aria-label="Kembali" style="width: 56px; height: 56px; border-radius: 18px; border: 1.5px solid {C["line"]}; background: #FFFFFF; color: {C["ink"]}; display: flex; align-items: center; justify-content: center">{ic("back", 22)}</button></div>')
b = (ltop('Dengar dan Tirukan', 'BAB 3 · P1', c3)
     + f'<div style="flex: 1; display: flex; min-height: 0"><div style="flex: 1; display: flex; gap: 16px; padding: 14px 16px; min-width: 0">'
     + phrase_card('flex: 1.4; min-width: 0', 22)
     + f'<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0">{bubble("Tirukan dengan suara jelas!", 44)}{rec_row()}{dots(c3)}</div></div>'
     + lnav(c3, '7/13') + '</div>')
FILES['L_Materi.dc.html'] = page('L1 Kartu ungkapan landscape', frame(b, LW, LH), LW, LH)

# landscape video peragaan B3-04
b = (f'<div style="flex: 1; display: flex; min-height: 0; background: #0D1526">'
     f'<div style="flex: 1; position: relative; overflow: hidden">{office_scene(600, 390, "lv", door=True)}'
     f'<div style="position: absolute; left: 190px; top: 120px">{person("#2A3550", hair="#1F1A17", tie=c3, w=110, h=165)}</div>'
     f'<div style="position: absolute; left: 230px; top: 70px; display: flex; gap: 6px">' + ''.join(f'<span style="font-size: 16px; font-weight: 900; color: {c3}; background: #FFFFFF; padding: 4px 8px; border-radius: 10px; box-shadow: {SH2}">tok</span>' for _ in range(3)) + '</div>'
     f'<div style="position: absolute; left: 14px; top: 12px; display: flex; gap: 8px">{iconbtn("back", "Keluar dari video", "rgba(13,21,38,.7)", "#FFFFFF", False, 40)}{chip("B3-04 · video peragaan", "rgba(13,21,38,.75)", "#FFFFFF")}</div>'
     f'<div style="position: absolute; left: 14px; right: 14px; bottom: 12px; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 16px; background: rgba(13,21,38,.75); color: #FFFFFF">'
     f'{ic("pause", 20)}<span style="font-size: 12px; font-weight: 700">0:06</span><div style="flex: 1; height: 6px; border-radius: 999px; background: rgba(255,255,255,.25)"><div style="width: 34%; height: 6px; border-radius: 999px; background: {C["sakura"]}"></div></div><span style="font-size: 12px; font-weight: 700">0:18</span>{ic("full", 18)}</div></div>'
     f'<div style="width: 260px; background: #FFFFFF; display: flex; flex-direction: column; padding: 16px; gap: 10px">'
     f'<span style="font-size: 11px; font-weight: 800; color: {c3}; letter-spacing: .06em">LANGKAH 1–2</span><span style="font-size: 17px; font-weight: 800; line-height: 1.3">Mengetuk dan menunggu</span>'
     f'<div style="display: flex; gap: 10px; align-items: flex-start"><span style="width: 26px; height: 26px; flex: none; border-radius: 8px; background: {c3}; color: #FFFFFF; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center">1</span><span style="font-size: 13px; line-height: 1.45">Ketuk pintu <b>tiga kali</b> dengan tempo tenang.</span></div>'
     f'<div style="display: flex; gap: 10px; align-items: flex-start"><span style="width: 26px; height: 26px; flex: none; border-radius: 8px; background: {l3}; color: {c3}; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center">2</span><span style="font-size: 13px; line-height: 1.45">Tunggu {jp("「どうぞ」", 13)}, baru masuk.</span></div>'
     f'<div style="margin-top: auto; display: flex; gap: 8px">{btn("Ulangi", "ghost", "repeat", small=True, color=c3)}<div style="flex: 1">{btn("Lanjut", "pri", "next", full=True, small=True, color=c3)}</div></div></div></div>')
FILES['L_Video.dc.html'] = page('L2 Video peragaan landscape', frame(b, LW, LH, '#0D1526'), LW, LH)

# landscape simulasi
b = (f'<div style="flex: 1; display: flex; min-height: 0">'
     f'<div style="width: 470px; position: relative; overflow: hidden">{office_scene(470, 390, "ls", door=False, tanaka=True)}'
     f'<div style="position: absolute; left: 22px; top: 70px; width: 160px">{speech(18)}</div>'
     f'<div style="position: absolute; left: 14px; top: 12px">{chip("Momen 4/13 · Fase B", "rgba(22,33,62,.88)", "#FFFFFF")}</div></div>'
     f'<div style="flex: 1; background: {C["ink"]}; color: #FFFFFF; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px">'
     f'<div style="display: flex; align-items: center; gap: 8px"><div style="flex: 1; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800">{jp("信頼度", 12, 700)}<span style="flex: 1; height: 8px; border-radius: 999px; background: #4A5F8C"><span style="display: block; width: 60%; height: 8px; border-radius: 999px; background: #7FD3A0"></span></span>60</div>'
     f'<div style="width: 44px; height: 44px; border-radius: 50%; background: conic-gradient({C["sakura"]} 0 60%, #2C3E66 60% 100%); display: flex; align-items: center; justify-content: center"><span style="width: 34px; height: 34px; border-radius: 50%; background: {C["ink"]}; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center">12</span></div></div>'
     f'<span style="font-size: 14px; font-weight: 800; line-height: 1.4">{SIMQ}</span>' + simopt(SIMO[0], True, 13) + simopt(SIMO[1], False, 13) + simopt(SIMO[2], False, 13) + '</div></div>')
FILES['L_Simulasi.dc.html'] = page('L3 Momen simulasi landscape', frame(b, LW, LH, C['ink']), LW, LH)

# ================================================================ DESKTOP 1440x900
DW, DH = 1440, 900
def dtop(col, crumb):
    return (f'<div style="min-height: 72px; flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding: 12px 24px; box-sizing: border-box; background: #FFFFFF; border-bottom: 1px solid {C["line"]}">'
            f'<div style="display: flex; align-items: center; gap: 10px; width: 276px">{mascot(44, "senang")}<div style="display: flex; flex-direction: column"><span style="font-size: 17px; font-weight: 800">Mensetsu Navi</span>{jp("面接ナビ", 11, 500, C["ink2"])}</div></div>'
            f'<span style="flex: 1; font-size: 14px; color: {C["ink2"]}">{crumb}</span>'
            f'<div style="display: flex; align-items: center; gap: 8px; width: 220px"><div style="flex: 1; height: 8px; border-radius: 999px; background: {C["line"]}"><div style="width: 40%; height: 8px; border-radius: 999px; background: {C["sakura"]}"></div></div><span style="font-size: 12px; font-weight: 800">4/10</span></div>'
            f'{toggles()}{iconbtn("speaker", "Suara", C["priL"], C["pri"], False)}'
            f'<div style="display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 999px; background: {C["ground"]}"><span style="width: 36px; height: 36px; border-radius: 50%; background: {col}; color: #FFFFFF; font-weight: 800; display: flex; align-items: center; justify-content: center">R</span><span style="font-size: 14px; font-weight: 800">Rani</span></div></div>')
def sidebar(active_bab=3, active_slide=7):
    out = f'<nav aria-label="Daftar isi kursus" style="flex: 1 1 280px; box-sizing: border-box; background: #FFFFFF; border-right: 1px solid {C["line"]}; padding: 18px 14px; display: flex; flex-direction: column; gap: 6px; overflow: hidden">'
    out += f'<a href="D_Beranda.dc.html" style="text-decoration: none; color: {C["ink"]}; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; font-size: 14px; font-weight: 800">{ic("home", 18)}Beranda</a>'
    for n, (c, l, t) in BAB.items():
        st = jp('済', 13, 900, C['hanko']) if n < 3 else ('' if n > 3 else f'<span style="font-size: 11px; font-weight: 800; color: {c}">54%</span>')
        act = n == active_bab
        out += (f'<div style="border-radius: 16px; {"background: " + l + ";" if act else ""} padding: 4px">'
                f'<div style="display: flex; align-items: center; gap: 10px; padding: 8px 8px; font-size: 14px; font-weight: 800"><span style="width: 28px; height: 28px; border-radius: 9px; background: {c}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 13px">{n}</span><span style="flex: 1">{t}</span>{st}</div>')
        if act:
            for p, items in [('P1 · Langkah Masuk Ruangan', [(2, 'Temukan 3 Kesalahan'), (3, 'Tujuh Langkah'), (4, 'Mengetuk dan Menunggu'), (5, 'Masuk dan Menutup Pintu'), (6, 'Perkenalan dan Duduk'), (7, 'Dengar dan Tirukan')]), ('P2 · Ojigi', [(8, 'Tiga Jenis Ojigi')])]:
                out += f'<div style="font-size: 11px; font-weight: 800; color: {c}; padding: 6px 10px 2px 46px">{p}</div>'
                for i, tt in items:
                    done = i < active_slide
                    out += (f'<div style="display: flex; align-items: center; gap: 8px; padding: 6px 10px 6px 46px; font-size: 13px; border-radius: 10px; {"background: #FFFFFF; font-weight: 800; box-shadow: " + SH2 + ";" if i == active_slide else ""}">'
                            f'<span style="width: 16px; display: flex">{ic("check", 14, C["good"], 2.6) if done else ""}</span>B3-{i:02d} {tt}</div>')
        out += '</div>'
    out += (f'<div style="margin-top: auto; display: flex; flex-direction: column; gap: 4px; padding-top: 10px; border-top: 1px solid {C["line"]}">'
            + ''.join(f'<div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 13px; font-weight: 700; color: {C["ink2"]}">{ic(i, 18)}{t}</div>' for i, t in [('book', 'Bank Kosakata'), ('chat', 'Latihan Pertanyaan Acak'), ('bulb', 'Tips dan Trik')]) + '</div></nav>')
    return out

# D1 Beranda
def dbab(n, status, pct=0, saran=False):
    c, l, t = BAB[n]
    tag = {'done': f'<span style="width: 40px; height: 40px; border-radius: 50%; border: 3px solid {C["hanko"]}; background: #FFFFFF; color: {C["hanko"]}; display: flex; align-items: center; justify-content: center; transform: rotate(-12deg)">{jp("済", 17, 900)}</span>',
           'now': chip(f'{pct}% · sedang dipelajari', '#FFFFFF', c), 'open': chip('Disarankan dari pre-test', C['warnL'], C['warn']) if saran else ''}[status]
    return (f'<a href="D_Materi.dc.html" style="text-decoration: none; color: {C["ink"]}; border-radius: 24px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden; display: flex; flex-direction: column; {"outline: 3px solid " + c + ";" if status == "now" else ""}">'
            f'<div style="height: 96px; background: {c}; position: relative; overflow: hidden; padding: 14px; display: flex; justify-content: space-between; align-items: flex-start">{seigaiha(400, 96, "#FFFFFF", .2, "dsg%d" % n)}'
            f'<span style="position: relative; font-size: 40px; font-weight: 800; color: #FFFFFF; line-height: 1">{n}</span><span style="position: relative">{tag}</span></div>'
            f'<div style="padding: 14px 16px; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 17px; font-weight: 800">{t}</span>'
            f'<div style="height: 6px; border-radius: 999px; background: {l}"><div style="width: {100 if status == "done" else pct}%; height: 6px; border-radius: 999px; background: {c}"></div></div></div></a>')
main = (f'<div style="flex: 999 1 560px; min-width: 0; box-sizing: border-box; overflow: hidden; padding: 28px 36px; display: flex; flex-direction: column; gap: 22px">'
        f'<div style="border-radius: 30px; background: {C["pri"]}; color: #FFFFFF; position: relative; overflow: hidden; padding: 28px 32px; display: flex; align-items: center; gap: 24px">{seigaiha(1100, 240, "#FFFFFF", .14, "dsgh")}{petals([(700, 30, 22, 20), (820, 170, 16, -30), (560, 160, 12, 50)])}'
        f'<div style="position: relative; flex: 1; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: #DCE5F6">Okaeri, selamat datang lagi</span><span style="font-size: 38px; font-weight: 800">Rani, tiga bab lagi menuju Simulasi!</span>'
        f'<div style="display: flex; gap: 12px; margin-top: 8px">{btn("Lanjutkan Bab 3 · B3-07", "light", "play", href="D_Materi.dc.html", color=BAB[3][0])}{btn("Lihat peta kemampuan awal", "ghost", "map", color="#FFFFFF").replace("background: #FFFFFF", "background: transparent")}</div></div>'
        f'<div style="position: relative; width: 190px; height: 190px">{mascot(190, "menyapa")}</div></div>'
        f'<div style="display: flex; align-items: center; justify-content: space-between"><span style="font-size: 22px; font-weight: 800">Perjalanan belajarmu</span><div style="display: flex; gap: 8px">{chip(ic("check", 14, C["good"], 2.6) + "Pre-test selesai", C["goodL"], C["good"])}{chip("3 stempel", C["sakuraL"], C["sakuraD"])}</div></div>'
        f'<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px">' + dbab(1, 'done') + dbab(2, 'done') + dbab(3, 'now', 54) + dbab(4, 'open', saran=True) + dbab(5, 'open') + dbab(6, 'open') + '</div>'
        f'<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px">'
        + ''.join(f'<div style="border-radius: 20px; background: #FFFFFF; border: 2px dashed {C["line"]}; padding: 14px 18px; display: flex; align-items: center; gap: 12px"><span style="width: 44px; height: 44px; border-radius: 14px; background: {C["ground"]}; color: {C["ink2"]}; display: flex; align-items: center; justify-content: center">{ic(i, 20)}</span><div style="display: flex; flex-direction: column"><span style="font-size: 15px; font-weight: 800">{t}</span><span style="font-size: 12px; color: {C["ink2"]}">{s}</span></div></div>'
                  for i, t, s in [('lock', 'Simulasi Mensetsu', 'Terbuka setelah 6 stempel'), ('lock', 'Post-test', 'Setelah Simulasi'), ('trophy', 'Rapor Kesiapan', 'Langkah terakhir')]) + '</div></div>')
b = dtop(C['pri'], 'Beranda') + f'<div style="flex: 1; display: flex; flex-wrap: wrap; min-height: 0">{sidebar(0)}{main}</div>'
FILES['D_Beranda.dc.html'] = page('D1 Beranda laptop', dframe(b), DW, DH)

# D2 Materi
right = (f'<aside style="flex: 1 1 260px; box-sizing: border-box; padding: 24px 20px; display: flex; flex-direction: column; gap: 14px; border-left: 1px solid {C["line"]}; background: #FFFFFF">'
         f'<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; background: {C["ground"]}; border-radius: 22px; padding: 16px">{mascot(110, "senang")}<span style="font-size: 13px; line-height: 1.5; text-align: center"><b>Tips Navi:</b> ucapkan と申します dengan tempo pelan, lalu ojigi setelah kalimat selesai (語先後礼).</span></div>'
         f'<span style="font-size: 12px; font-weight: 800; color: {C["ink2"]}; letter-spacing: .06em">KOSAKATA DI SLIDE INI</span>'
         + ''.join(f'<div style="display: flex; flex-direction: column; padding: 10px 12px; border-radius: 14px; background: {C["ground"]}">{jp(j, 16)}<span style="font-size: 12px; color: {C["ink2"]}">{r} · {a}</span></div>'
                   for j, r, a in [('申します', 'moushimasu', 'nama saya (sopan)'), ('本日', 'honjitsu', 'hari ini'), ('失礼します', 'shitsurei shimasu', 'permisi')]) + '</aside>')
center = (f'<main style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column">'
          f'<div style="padding: 20px 40px 0; display: flex; flex-wrap: wrap; align-items: center; gap: 12px">{chip("Bab 3 · P1 Langkah Masuk Ruangan", l3, c3)}<span style="font-size: 13px; color: {C["ink2"]}">Slide 7 dari 13</span>'
          f'<div style="flex: 1; height: 8px; border-radius: 999px; background: {C["line"]}"><div style="width: 54%; height: 8px; border-radius: 999px; background: {c3}"></div></div></div>'
          f'<div style="flex: 1; padding: 20px 40px; display: flex; flex-direction: column; gap: 16px; overflow: hidden"><span style="font-size: 30px; font-weight: 800">Dengar dan Tirukan</span>'
          f'<span style="font-size: 15px; color: {C["ink2"]}">Dengarkan lima ungkapan masuk ruangan sesuai urutan kejadian, lalu tirukan dengan suara jelas.</span>'
          f'<div style="display: flex; flex-wrap: wrap; gap: 18px">' + phrase_card('flex: 1.3 1 340px', 30)
          + f'<div style="flex: 1 1 260px; display: flex; flex-direction: column; gap: 10px">'
          + ''.join(f'<div style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 16px; background: {"#FFFFFF" if i != 2 else l3}; box-shadow: {SH2 if i != 2 else "none"}"><span style="width: 26px; height: 26px; border-radius: 8px; background: {c3 if i <= 2 else C["line"]}; color: {"#FFFFFF" if i <= 2 else C["ink2"]}; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center">{i + 1}</span><span style="flex: 1; display: flex; flex-direction: column">{jp(j, 15)}<span style="font-size: 11px; color: {C["ink2"]}">{w}</span></span>{ic("speaker", 16, c3)}</div>'
                    for i, (j, w) in enumerate([('どうぞ。', 'Pewawancara'), ('失礼します。', 'Kamu'), ('〇〇と申します…', 'Kamu'), ('どうぞおかけください。', 'Pewawancara'), ('失礼します。', 'Kamu, lalu duduk')]))
          + '</div></div>' + rec_row() + '</div>'
          f'<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px 40px 22px; border-top: 1px solid {C["line"]}; background: #FFFFFF">'
          f'{btn("Kembali", "ghost", "back", color=C["ink"])}<span style="flex: 1; text-align: center; font-size: 13px; font-weight: 800; color: {C["ink2"]}">Pintasan keyboard: ← sebelumnya · → berikutnya · spasi putar audio</span>{btn("Lanjut", "pri", "next", color=c3)}</div></main>')
b = dtop(c3, 'Beranda / Bab 3 · Nyuushitsu &amp; Ojigi / B3-07') + f'<div style="flex: 1; display: flex; flex-wrap: wrap; min-height: 0">{sidebar(3, 7)}{center}{right}</div>'
FILES['D_Materi.dc.html'] = page('D2 Slide materi laptop', dframe(b), DW, DH)

# D3 Simulasi
b = (f'<div style="flex: 1; display: flex; flex-wrap: wrap; min-height: 0; background: {C["ink"]}">'
     f'<div style="flex: 999 1 560px; min-height: 560px; position: relative; overflow: hidden">{office_scene(900, 900, "ds", door=False, tanaka=True)}'
     f'<div style="position: absolute; left: 24px; top: 20px; display: flex; gap: 10px">{chip("Simulasi Mensetsu · さくら食品", "rgba(22,33,62,.88)", "#FFFFFF", 13)}{chip("Fase B · Masuk ruangan", "rgba(22,33,62,.88)", "#FFFFFF", 13)}</div>'
     f'<div style="position: absolute; left: 70px; top: 230px; width: 240px">{speech(28)}</div></div>'
     f'<div style="flex: 1 1 440px; box-sizing: border-box; color: #FFFFFF; padding: 32px 36px; display: flex; flex-direction: column; gap: 16px">'
     f'<div style="display: flex; align-items: center; gap: 14px"><span style="font-size: 14px; font-weight: 800; color: #B9C4DA">Momen 4 dari 13</span><span style="flex: 1"></span>'
     f'<div style="width: 72px; height: 72px; border-radius: 50%; background: conic-gradient({C["sakura"]} 0 60%, #2C3E66 60% 100%); display: flex; align-items: center; justify-content: center"><span style="width: 58px; height: 58px; border-radius: 50%; background: {C["ink"]}; font-weight: 800; font-size: 22px; display: flex; align-items: center; justify-content: center">12</span></div></div>'
     f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 18px; background: #1E2D50"><div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 800">{jp("信頼度 · Trust Meter", 13, 700)}<span>60</span></div><div style="height: 12px; border-radius: 999px; background: #3D5280"><div style="width: 60%; height: 12px; border-radius: 999px; background: #7FD3A0"></div></div></div>'
     f'<div style="display: flex; gap: 4px">' + ''.join(f'<span style="flex: 1; height: 6px; border-radius: 999px; background: {C["sakura"] if i < 3 else ("#FFFFFF" if i == 3 else "#3D5280")}"></span>' for i in range(13)) + '</div>'
     f'<span style="font-size: 24px; font-weight: 800; line-height: 1.35; margin-top: 8px">{SIMQ}</span>' + simopt(SIMO[0], True, 16) + simopt(SIMO[1], False, 16) + simopt(SIMO[2], False, 16)
     + f'<span style="margin-top: auto; font-size: 13px; color: #B9C4DA">Pilih dalam 20 detik. Tekan 1, 2, atau 3 di keyboard. Pembahasan semua momen muncul setelah simulasi selesai.</span></div></div>')
FILES['D_Simulasi.dc.html'] = page('D3 Momen simulasi laptop', dframe(b, C['ink']), DW, DH)

# D4 Rapor
rows = [('SIM-01', 'Tiba di depan gedung', 'tepat'), ('SIM-02', 'Di meja resepsionis', 'tepat'), ('SIM-03', 'Di depan pintu', 'tepat'), ('SIM-04', 'Masuk dan menutup pintu', 'tepat'),
        ('SIM-05', 'Di samping kursi', 'kurang'), ('SIM-06', 'Jikoshoukai', 'tepat'), ('SIM-07', 'Alasan memilih perusahaan', 'tepat'), ('SIM-08', 'Kesulitan bahasa Jepang', 'tepat'),
        ('SIM-09', 'Mesin tiba-tiba berhenti', 'tepat'), ('SIM-10', 'Kata yang tidak dipahami', 'kurang'), ('SIM-11', 'Pertanyaan tak terduga', 'tepat'), ('SIM-12', 'Pertanyaan balik', 'tepat'), ('SIM-13', 'Menutup wawancara', 'tepat')]
tag = {'tepat': chip('Tepat', C['goodL'], C['good'], 11), 'kurang': chip('Kurang tepat', C['warnL'], C['warn'], 11)}
bar_bab = ''.join(f'<div style="display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1"><div style="height: 140px; width: 34px; border-radius: 10px; background: {BAB[n][1]}; display: flex; align-items: flex-end"><div style="width: 34px; height: {v * 1.4:.0f}px; border-radius: 10px; background: {BAB[n][0]}"></div></div><span style="font-size: 12px; font-weight: 800">{v}%</span><span style="font-size: 11px; color: {C["ink2"]}">Bab {n}</span></div>'
                  for n, v in zip(range(1, 7), [100, 67, 100, 75, 75, 100]))
main = (f'<div style="flex: 999 1 560px; min-width: 0; box-sizing: border-box; overflow: hidden; padding: 28px 36px; display: flex; flex-wrap: wrap; gap: 20px; align-content: flex-start; align-items: flex-start">'
        f'<div style="flex: 2 1 620px; flex-wrap: wrap; border-radius: 28px; background: {C["pri"]}; color: #FFFFFF; position: relative; overflow: hidden; padding: 26px 30px; display: flex; align-items: center; gap: 24px">{seigaiha(800, 240, "#FFFFFF", .14, "dsr")}'
        f'<div style="position: relative; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; font-weight: 800; color: #DCE5F6; letter-spacing: .08em">NILAI SUMATIF</span><span style="font-size: 96px; font-weight: 800; line-height: .9">86</span><span style="font-size: 13px; color: #DCE5F6">50% Simulasi (85) + 50% Post-test (87)</span></div>'
        f'<div style="position: relative; flex: 1; display: flex; flex-direction: column; gap: 10px; align-items: flex-start">{chip(ic("check", 16, C["good"], 2.6) + "Lulus", C["goodL"], C["good"], 15)}{chip("Siap Wawancara", "#FFFFFF", C["priD"], 15)}'
        f'<span style="font-size: 14px; line-height: 1.5; color: #DCE5F6">Mensetsu Navi adalah persiapan. Lanjutkan dengan praktik wawancara langsung bersama instruktur LPK.</span></div>'
        f'<div style="position: relative; width: 170px; height: 170px">{mascot(170, "menyapa")}</div></div>'
        f'<div style="flex: 1 1 320px; display: flex; flex-direction: column; gap: 14px">' + f'<div style="display: flex; gap: 12px">{gauge("Komunikasi", 83, C["pri"], 100)}{gauge("Etika dan Budaya Kerja", 86, C["good"], 100)}</div>'
        + card(f'<div style="font-size: 12px; font-weight: 800; color: {C["ink2"]}; margin-bottom: 10px">STEMPEL BAB</div><div style="display: flex; justify-content: space-between">{stamps(44)}</div>', 16) + '</div>'
        + card(f'<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px"><span style="font-size: 16px; font-weight: 800">Post-test per bab</span>{chip("N-gain 0,72 · tinggi", C["goodL"], C["good"], 11)}</div><div style="display: flex; gap: 8px">{bar_bab}</div>'
               f'<div style="display: flex; gap: 14px; margin-top: 16px; font-size: 13px"><span><b>Pre-test</b> 55</span><span><b>Post-test</b> 87</span></div>', 20, 'flex: 1 1 320px')
        + card(f'<div style="font-size: 16px; font-weight: 800; margin-bottom: 10px">Simulasi per momen</div><div style="display: flex; flex-direction: column; gap: 4px">'
               + ''.join(f'<div style="display: flex; align-items: center; gap: 10px; font-size: 13px; padding: 4px 0"><span style="width: 56px; font-weight: 800; color: {C["ink2"]}">{c}</span><span style="flex: 1">{t}</span>{tag[k]}</div>' for c, t, k in rows) + '</div>', 18, 'flex: 1 1 320px')
        + card(f'<div style="font-size: 16px; font-weight: 800; margin-bottom: 10px">Rekomendasi</div>'
               f'<div style="display: flex; flex-direction: column; gap: 10px"><div style="padding: 12px 14px; border-radius: 16px; background: {C["warnL"]}; font-size: 13px; line-height: 1.5"><b>Duduk dan barang bawaan.</b> Tas diletakkan di lantai, punggung tegak. <a href="D_Materi.dc.html">Buka B3-11</a></div>'
               f'<div style="padding: 12px 14px; border-radius: 16px; background: {C["warnL"]}; font-size: 13px; line-height: 1.5"><b>Kata yang tidak dipahami.</b> Tanyakan artinya dengan sopan. <a href="D_Materi.dc.html">Buka B5-09</a></div>'
               f'<div style="display: flex; gap: 8px">{btn("Unduh rapor PDF", "pri", "download", small=True)}{btn("Unduh rekaman", "ghost", "download", small=True)}</div></div>', 18, 'flex: 1 1 320px') + '</div>')
b = dtop(C['pri'], 'Rapor Kesiapan') + f'<div style="flex: 1; display: flex; flex-wrap: wrap; min-height: 0">{sidebar(0)}{main}</div>'
FILES['D_Rapor.dc.html'] = page('D4 Rapor laptop', dframe(b), DW, DH)

# D5 Pembuka
b = (f'<div style="flex: 1; display: flex; flex-wrap: wrap; min-height: 900px">'
     f'<div style="flex: 1.1 1 520px; box-sizing: border-box; min-height: 640px; position: relative; overflow: hidden; background: {C["pri"]}; color: #FFFFFF; display: flex; flex-direction: column; justify-content: center; padding: 0 80px; gap: 14px">{seigaiha(800, 900, "#FFFFFF", .14, "dsp")}'
     f'{petals([(80, 90, 26, 20), (620, 120, 30, -20), (560, 700, 22, 40), (120, 760, 18, -30), (400, 60, 16, 60)])}'
     f'<span style="position: relative; font-size: 14px; font-weight: 800; letter-spacing: .2em; color: #F9C9D6">PEMANDU WAWANCARA KERJA</span>'
     f'<span style="position: relative; font-size: 76px; font-weight: 800; line-height: 1">Mensetsu Navi</span>{jp("面接ナビ", 36, 500, "#DCE5F6")}'
     f'<span style="position: relative; font-size: 18px; line-height: 1.6; max-width: 520px; color: #DCE5F6">Latihan mandiri wawancara kerja bahasa Jepang untuk peserta LPK tingkat N4: dari mengetuk pintu sampai menutup wawancara.</span>'
     f'<div style="position: relative; display: flex; gap: 10px; margin-top: 10px">{chip("6 bab · ±75 menit", "rgba(255,255,255,.16)", "#FFFFFF", 13)}{chip("Simulasi 13 momen", "rgba(255,255,255,.16)", "#FFFFFF", 13)}{chip("Bisa offline", "rgba(255,255,255,.16)", "#FFFFFF", 13)}</div></div>'
     f'<div style="flex: 1 1 520px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; padding: 60px 80px; gap: 18px; position: relative">'
     f'<div style="position: absolute; right: 60px; top: 70px">{mascot(200, "menyapa")}</div>'
     f'<span style="font-size: 34px; font-weight: 800; line-height: 1.2; max-width: 420px">Halo! Aku pemandumu.</span><span style="font-size: 16px; color: {C["ink2"]}; line-height: 1.6; max-width: 460px">Wawancara di Jepang bukan hanya soal bahasa, tetapi juga sikap. Kita mulai dengan pre-test singkat untuk melihat kemampuan awalmu.</span>'
     f'<label style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 800; max-width: 460px">Nama panggilanmu<input type="text" value="Rani" style="min-height: 54px; border-radius: 16px; border: 2px solid {C["line"]}; padding: 0 16px; font-family: {FF}; font-size: 17px; color: {C["ink"]}; background: #FFFFFF"></label>'
     + card(f'<div style="display: flex; gap: 14px; align-items: center"><div style="width: 60px; height: 60px; border-radius: 18px; background: {l3}; display: flex; align-items: center; justify-content: center">{jp("田中", 18, 900, c3)}</div>'
            f'<div style="flex: 1; font-size: 14px; line-height: 1.55"><b>Misimu:</b> kumpulkan enam stempel bab, lalu yakinkan 田中さん (Tanaka-san) dari さくら食品 (Sakura Foods) di Simulasi.</div></div>', 16, 'max-width: 460px; box-sizing: border-box')
     + f'<div style="max-width: 460px">{btn("Mulai Pre-test", "pri", "next", full=True)}</div></div></div>')
FILES['D_Pembuka.dc.html'] = page('D0 Layar pembuka laptop', dframe(b), DW, DH)

# ================================================================ INDEX
port = ['Main.dc.html', 'PreTest.dc.html', 'Beranda.dc.html', 'BabCover.dc.html', 'Materi.dc.html', 'Latihan.dc.html',
        'Rekam.dc.html', 'HasilKuis.dc.html', 'Simulasi.dc.html', 'Rapor.dc.html', 'Menu.dc.html', 'Kosakata.dc.html']
titles = {'Main.dc.html': '01 Layar Pembuka · GLB-00', 'PreTest.dc.html': '02 Soal Pre-test · PRE-07', 'Beranda.dc.html': '03 Beranda · GLB-01',
          'BabCover.dc.html': '04 Sampul Bab · B3-01 (T01)', 'Materi.dc.html': '05 Kartu Ungkapan · B3-07 (T05)', 'Latihan.dc.html': '06 Komik Kasus · B2-11 (T13)',
          'Rekam.dc.html': '07 Rekam Suara · B4-15 (T15)', 'HasilKuis.dc.html': '08 Hasil Kuis · T19', 'Simulasi.dc.html': '09 Momen Simulasi · SIM-04 (T20)',
          'Rapor.dc.html': '10 Rapor · RAP-01 (T21)', 'Menu.dc.html': '11 Menu ☰ · GLB-01', 'Kosakata.dc.html': '12 Bank Kosakata · GLB-03',
          'L_Materi.dc.html': 'L1 Kartu Ungkapan · landscape', 'L_Video.dc.html': 'L2 Video Peragaan B3-04 · landscape', 'L_Simulasi.dc.html': 'L3 Momen Simulasi · landscape',
          'D_Pembuka.dc.html': 'D0 Layar Pembuka · laptop', 'D_Beranda.dc.html': 'D1 Beranda · laptop', 'D_Materi.dc.html': 'D2 Slide Materi B3-07 · laptop',
          'D_Simulasi.dc.html': 'D3 Momen Simulasi · laptop', 'D_Rapor.dc.html': 'D4 Rapor · laptop', 'StyleGuide.dc.html': 'Panduan gaya', 'Mascot.dc.html': 'Komponen maskot (sementara)'}
boards = {}
boards['StyleGuide.dc.html'] = {'x': 0, 'y': 0, 'w': 1440, 'h': 1240}
boards['Mascot.dc.html'] = {'x': 1560, 'y': 0, 'w': 240, 'h': 240}
notes = {'t1': {'x': 0, 'y': -300, 'text': 'Panduan gaya dan maskot', 'kind': 'title1', 'maxW': 1800, 'w': 240},
         't2': {'x': 0, 'y': 1300, 'text': 'Layar HP: alur peserta (1)', 'kind': 'title1', 'maxW': 2740, 'w': 240},
         't3': {'x': 0, 'y': 2487, 'text': 'Layar HP: alur peserta (2)', 'kind': 'title1', 'maxW': 2740, 'w': 240}}
for i, f in enumerate(port):
    r, c = divmod(i, 6)
    boards[f] = {'x': c * 470, 'y': [1600, 2787][r]}
notes['t4'] = {'x': 0, 'y': 3750, 'text': 'HP landscape (844 × 390)', 'kind': 'title1', 'maxW': 2692, 'w': 240}
for i, f in enumerate(['L_Materi.dc.html', 'L_Video.dc.html', 'L_Simulasi.dc.html']):
    boards[f] = {'x': i * (844 + 80), 'y': 4050, 'w': 844, 'h': 390}
notes['t5'] = {'x': 0, 'y': 4560, 'text': 'Laptop: Windows / Mac (1440 × 900)', 'kind': 'title1', 'maxW': 4480, 'w': 240}
for i, f in enumerate(['D_Pembuka.dc.html', 'D_Beranda.dc.html', 'D_Materi.dc.html']):
    boards[f] = {'x': i * (1440 + 80), 'y': 4860, 'w': 1440, 'h': 900, 'expand': 'fill'}
for i, f in enumerate(['D_Simulasi.dc.html', 'D_Rapor.dc.html']):
    boards[f] = {'x': i * (1440 + 80), 'y': 5880, 'w': 1440, 'h': 900, 'expand': 'fill'}
for f in port:
    boards[f].update({'w': 390, 'h': 844})
for f, v in boards.items():
    v['title'] = titles[f]
order = ['StyleGuide.dc.html', 'Mascot.dc.html'] + port + ['L_Materi.dc.html', 'L_Video.dc.html', 'L_Simulasi.dc.html', 'D_Pembuka.dc.html', 'D_Beranda.dc.html', 'D_Materi.dc.html', 'D_Simulasi.dc.html', 'D_Rapor.dc.html']
assert set(order) == set(FILES) == set(boards)
old = json.load(open(os.path.join(ROOT, 'canvas.json')))
old['boards'] = boards
old['order'] = order
old['notes'] = notes
json.dump(old, open(ROOT + '/canvas.json', 'w'), ensure_ascii=False, indent=1)
for k, v in FILES.items():
    open(ROOT + '/' + k, 'w').write(v)
print(len(FILES), 'files')

#!/usr/bin/env node
// Build-to-Learn hub generator.
// Scans each project's docs/learning/ folder and renders one browsable HTML page:
// glossary, questions, architecture diagrams (Mermaid), and (optionally) coaching notes.
// Re-run after any project's learning pass and the hub updates itself. No dependencies.
//
//   node generate.mjs                              full hub (incl. coaching) -> index.html
//   node generate.mjs --no-coaching                shareable hub             -> index-shareable.html
//   node generate.mjs --only iris --no-coaching --out docs/index.html   one project, for GitHub Pages
//
// Markdown + Mermaid render client-side from CDN, so the output is a single portable file.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const INCLUDE_COACHING = !process.argv.includes('--no-coaching');
const argVal = (flag) => { const i = process.argv.indexOf(flag); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : null; };
const ONLY = argVal('--only') ? argVal('--only').split(',').map((s) => s.trim().toLowerCase()) : null;
const OUT = argVal('--out')
  ? path.resolve(argVal('--out'))
  : path.join(import.meta.dirname, INCLUDE_COACHING ? 'index.html' : 'index-shareable.html');

// ---- config: where to look ----
// By default, scan ~/Projects for any folder containing docs/learning/.
const SCAN_ROOTS = [path.join(os.homedir(), 'Projects')];
// Add absolute paths to repos that live elsewhere:
const EXTRA_PATHS = [
  // '/Users/you/work/some-repo',
];
// Optional pretty display names (falls back to a title-cased folder name):
const NAME_MAP = {
  // 'my-repo': 'My Project',
};

// Which docs to surface, in order. Filenames match case-insensitively.
const DOC_ORDER = [
  { files: ['architecture-map.md', 'architecture.md'], title: 'Architecture' },
  { files: ['glossary.md'], title: 'Glossary' },
  { files: ['questions.md'], title: 'Questions' },
];

// ---- discover projects ----
function learningDirs() {
  const found = [];
  for (const root of SCAN_ROOTS) {
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const ld = path.join(root, entry.name, 'docs', 'learning');
      if (fs.existsSync(ld)) found.push({ name: entry.name, dir: ld, root: path.join(root, entry.name) });
    }
  }
  for (const p of EXTRA_PATHS) {
    const ld = path.join(p, 'docs', 'learning');
    if (fs.existsSync(ld)) found.push({ name: path.basename(p), dir: ld, root: p });
  }
  return found;
}

const pretty = (name) => NAME_MAP[name] || name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---- pull fenced mermaid blocks out of markdown, leave a token ----
const mermaidMap = {};
let mCounter = 0;
function extractMermaid(md) {
  return md.replace(/```mermaid\s*\n([\s\S]*?)```/g, (_, code) => {
    const key = 'MERMAID_' + mCounter++;
    mermaidMap[key] = code.replace(/\s+$/, '');
    return `\n\n@@${key}@@\n\n`;
  });
}
const safeForScript = (text) => text.replace(/<\/script/gi, '<\\/script');

// ---- build ----
const projects = learningDirs().filter((p) => !ONLY || ONLY.includes(p.name.toLowerCase()));
const mdBlocks = [];
const navItems = [];
const sections = [];

for (const proj of projects) {
  const pslug = 'proj-' + slugify(proj.name);
  const docLinks = [];
  const docSections = [];

  const files = fs.readdirSync(proj.dir, { withFileTypes: true }).filter((e) => e.isFile());
  const byLower = {};
  files.forEach((e) => { byLower[e.name.toLowerCase()] = e.name; });

  const coachingDir = path.join(proj.dir, 'coaching');
  const coachingFiles = INCLUDE_COACHING && fs.existsSync(coachingDir)
    ? fs.readdirSync(coachingDir).filter((f) => f.endsWith('.md')).sort()
    : [];

  for (const d of DOC_ORDER) {
    const actual = d.files.map((f) => byLower[f]).find(Boolean);
    if (!actual) continue;
    const fp = path.join(proj.dir, actual);
    const id = pslug + '-' + slugify(d.title);
    mdBlocks.push({ target: id, text: extractMermaid(fs.readFileSync(fp, 'utf8')) });
    docLinks.push(`<a href="#${id}">${d.title}</a>`);
    docSections.push(`<section class="doc" id="${id}"><h3>${d.title}</h3><div class="rendered" data-target="${id}"></div></section>`);
  }
  for (const cf of coachingFiles) {
    const id = pslug + '-coach-' + slugify(cf.replace(/\.md$/, ''));
    mdBlocks.push({ target: id, text: extractMermaid(fs.readFileSync(path.join(coachingDir, cf), 'utf8')) });
    docLinks.push(`<a href="#${id}">Coaching: ${cf.replace(/\.md$/, '')}</a>`);
    docSections.push(`<section class="doc coaching" id="${id}"><h3>Coaching <span class="badge">private · local only</span></h3><p class="src">${cf}</p><div class="rendered" data-target="${id}"></div></section>`);
  }

  if (!docSections.length) continue;
  navItems.push(`<li><a class="nav-proj" href="#${pslug}">${pretty(proj.name)}</a><ul>${docLinks.map((l) => `<li>${l}</li>`).join('')}</ul></li>`);
  sections.push(`<div class="project" id="${pslug}"><h2>${pretty(proj.name)}</h2><p class="path">${proj.root}</p>${docSections.join('\n')}</div>`);
}

const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
const mdScripts = mdBlocks
  .map((b) => `<script type="text/markdown" data-target="${b.target}">\n${safeForScript(b.text)}\n</script>`)
  .join('\n');
const mermaidJson = JSON.stringify(mermaidMap).replace(/</g, '\\u003c');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Build to Learn — hub</title>
<style>
  :root{ --bg:#f4efe6; --surface:#fbf8f2; --text:#2b2622; --muted:#6b6259; --line:#e2d9ca; --accent:#2f7d78; --code:#efe8db; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:var(--bg); color:var(--text); font-family:Georgia, serif; line-height:1.6; }
  a{ color:var(--accent); }
  .wrap{ display:grid; grid-template-columns:280px 1fr; min-height:100vh; }
  nav{ position:sticky; top:0; align-self:start; height:100vh; overflow:auto; background:var(--surface); border-right:1px solid var(--line); padding:20px 16px; }
  nav h1{ font-size:18px; margin:0 0 2px; }
  nav .sub{ color:var(--muted); font-size:12px; margin:0 0 18px; }
  nav ul{ list-style:none; margin:0; padding:0; }
  nav > ul > li{ margin-bottom:12px; }
  nav .nav-proj{ display:block; font-weight:800; text-decoration:none; padding:4px 0; }
  nav ul ul{ margin:2px 0 0 10px; border-left:2px solid var(--line); padding-left:10px; }
  nav ul ul a{ display:block; font-size:14px; color:var(--muted); text-decoration:none; padding:3px 0; }
  nav ul ul a:hover{ color:var(--accent); }
  main{ padding:32px 40px 120px; max-width:900px; }
  .project{ margin-bottom:48px; }
  .project > h2{ font-size:26px; border-bottom:3px solid var(--accent); padding-bottom:8px; margin:0 0 2px; }
  .project .path{ color:var(--muted); font-size:12px; font-family:ui-monospace, Menlo, monospace; margin:0 0 20px; }
  .doc{ background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:20px 24px; margin-bottom:18px; }
  .doc > h3{ margin:0 0 10px; font-size:19px; }
  .doc.coaching{ border-left:4px solid var(--accent); }
  .badge{ font-size:11px; font-weight:700; color:var(--accent); border:1px solid var(--accent); border-radius:999px; padding:2px 8px; vertical-align:middle; }
  .src{ color:var(--muted); font-size:12px; font-family:ui-monospace, Menlo, monospace; margin:-4px 0 12px; }
  .rendered h1{ font-size:22px; } .rendered h2{ font-size:19px; margin-top:22px; } .rendered h3{ font-size:16px; }
  .rendered code{ background:var(--code); padding:1px 5px; border-radius:5px; font-size:.9em; }
  .rendered pre{ background:var(--code); padding:14px; border-radius:10px; overflow:auto; }
  .rendered pre code{ background:none; padding:0; }
  .rendered table{ border-collapse:collapse; width:100%; }
  .rendered th,.rendered td{ border:1px solid var(--line); padding:7px 10px; text-align:left; }
  .rendered blockquote{ border-left:3px solid var(--accent); margin:0; padding-left:14px; color:var(--muted); }
  .mermaid{ background:var(--surface); text-align:center; margin:14px 0; }
  .empty{ color:var(--muted); font-style:italic; }
  @media (max-width:760px){ .wrap{ grid-template-columns:1fr; } nav{ position:static; height:auto; } main{ padding:20px; } }
</style>
</head>
<body>
<div class="wrap">
  <nav>
    <h1>Build to Learn</h1>
    <p class="sub">${projects.length} project${projects.length === 1 ? '' : 's'} · generated ${now}${INCLUDE_COACHING ? '' : ' · shareable'}</p>
    <ul>${navItems.join('') || '<li class="empty">No docs/learning folders found yet.</li>'}</ul>
  </nav>
  <main>${sections.join('\n') || '<p class="empty">Nothing to show yet. Run a learning pass in a project, then re-run this generator.</p>'}</main>
</div>

<script id="mermaidData" type="application/json">${mermaidJson}</script>
${mdScripts}

<script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad:false, theme:'neutral' });
  const esc = (s)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const mmap = JSON.parse(document.getElementById('mermaidData').textContent || '{}');
  document.querySelectorAll('script[type="text/markdown"]').forEach((s)=>{
    let html = marked.parse(s.textContent.trim());
    for (const [k, code] of Object.entries(mmap)) {
      const pre = '<pre class="mermaid">' + esc(code) + '</pre>';
      html = html.split('<p>@@'+k+'@@</p>').join(pre).split('@@'+k+'@@').join(pre);
    }
    const t = document.querySelector('[data-target="'+s.dataset.target+'"]');
    if (t) t.innerHTML = html;
  });
  try { await mermaid.run({ querySelector: '.mermaid' }); } catch (e) { console.warn('mermaid', e); }
</script>
</body>
</html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log('Hub written: ' + OUT);
console.log('Projects: ' + (projects.map((p) => pretty(p.name)).join(', ') || 'none'));
console.log('Mermaid diagrams: ' + Object.keys(mermaidMap).length);

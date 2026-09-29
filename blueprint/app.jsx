/* eslint-disable */
// Martin Molet — Lead Design System portfolio
// Blueprint aesthetic, dark only, EN/FR

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Defaults that the host can rewrite via __edit_mode_set_keys ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "coral",
  "density": "comfortable",
  "grid": false,
  "crosshair": true,
  "typePair": "mono-only"
}/*EDITMODE-END*/;

const ACCENTS = {
  cyan:    { hex: '#7DE2D1', label: 'Cyan',    oklch: '88% 0.10 180' },
  amber:   { hex: '#F4C76B', label: 'Amber',   oklch: '85% 0.12 80'  },
  iris:    { hex: '#A5A8FF', label: 'Iris',    oklch: '74% 0.10 280' },
  coral:   { hex: '#FF9E80', label: 'Coral',   oklch: '78% 0.12 30'  },
  white:   { hex: '#EDEDED', label: 'Bone',    oklch: '92% 0.005 90' },
};

// ---------- helpers ----------
function useTweaksLocal() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const setTweak = useCallback((keyOrObj, val) => {
    const patch = typeof keyOrObj === 'string' ? { [keyOrObj]: val } : keyOrObj;
    setTweaks(prev => ({ ...prev, ...patch }));
    try {
      window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    } catch (e) {}
  }, []);
  return [tweaks, setTweak];
}

function useCountUp(target, start, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return v;
}

function useInView(ref, opts = { threshold: 0.3 }) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

// ---------- chrome ----------
function TopBar({ lang, setLang, content, onJump, mouse, sectionId }) {
  return (
    <header className="topbar">
      <div className="tb-l">
        <div className="logo">
          <span className="logo-mark">◢◣</span>
          <span className="logo-name">MARTIN.MOLET</span>
          <span className="logo-role">// {content.meta.role}</span>
        </div>
      </div>
      <nav className="tb-c">
        {content.nav.map((n, i) => {
          const ids = ['home', 'work', 'cases', 'experience', 'about', 'contact'];
          const id = ids[i];
          return (
            <button key={n} className={`navlink ${sectionId === id ? 'is-active' : ''}`} onClick={() => onJump(id)}>
              <span className="navnum">{String(i + 1).padStart(2, '0')}</span>
              <span>{n}</span>
            </button>
          );
        })}
      </nav>
      <div className="tb-r">
        <div className="lang-toggle" role="tablist">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <span>·</span>
          <button className={lang === 'fr' ? 'on' : ''} onClick={() => setLang('fr')}>FR</button>
        </div>
      </div>
    </header>
  );
}

function StatusBar({ content, sectionId }) {
  const sections = ['home', 'work', 'cases', 'experience', 'about', 'contact'];
  const idx = Math.max(0, sections.indexOf(sectionId));
  return (
    <footer className="statusbar">
      <div className="sb-cell"><span className="sb-k">FILE</span><span>{content.meta.filename}</span></div>
      <div className="sb-cell"><span className="sb-k">SHEET</span><span>{String(idx + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span></div>
      <div className="sb-cell"><span className="sb-k">SCALE</span><span>1:1</span></div>
      <div className="sb-cell"><span className="sb-k">REV</span><span>{content.meta.lastUpdated}</span></div>
      <div className="sb-cell flex-1 right">
        <span className="sb-k">STATUS</span>
        <span className="status-pill"><span className="dot" /> {content.meta.status}</span>
      </div>
    </footer>
  );
}

// ---------- HOME ----------
function HomeSheet({ content, onJump, accent }) {
  const ref = useRef();
  const seen = useInView(ref);
  return (
    <section className="sheet" id="home" data-screen-label="01 Home" ref={ref}>
      <SheetHeader kicker={content.home.kicker} />

      <div className="hero">
        <div className="hero-l">
          <h1 className="hero-title">
            {content.home.title.split('\n').map((l, i) => (
              <span key={i} className="hero-line">{l}</span>
            ))}
          </h1>
          <p className="hero-sub">{content.home.sub}</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => onJump('cases')}>
              <span>{content.home.cta1}</span>
              <span className="btn-arrow">↗</span>
            </button>
            <button className="btn btn-ghost" onClick={() => onJump('contact')}>
              <span>{content.home.cta2}</span>
            </button>
          </div>

          <div className="hero-meta">
            <div><span className="k">ROLE</span><span>{(() => { const idx = content.meta.role.lastIndexOf(' & '); return idx > 0 ? (<>{content.meta.role.slice(0, idx)}<br/>{content.meta.role.slice(idx + 1)}</>) : content.meta.role; })()}</span></div>
            <div><span className="k">LOC</span><span>{content.meta.location}</span></div>
            <div><span className="k">AVAIL</span><span>{content.meta.status}</span></div>
          </div>
        </div>

        <div className="hero-r">
          <div className="portrait">
            <div className="portrait-frame">
              <img src="assets/martin.jpg" alt="Martin Molet" />
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
              <div className="dim-h"><span>720</span></div>
              <div className="dim-v"><span>1080</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics">
        {content.home.metrics.map((m, i) => (
          <MetricCard key={i} m={m} index={i} start={seen} />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ m, index, start }) {
  const v = useCountUp(m.value, start, 1200 + index * 200);
  return (
    <article className="metric">
      <div className="metric-id">M.{String(index + 1).padStart(2, '0')}</div>
      <div className="metric-value">
        <span className="mv-num">{v}</span>
        <span className="mv-suffix">{m.suffix}</span>
      </div>
      <div className="metric-label">{m.label}</div>
      <div className="metric-note">{m.note}</div>
    </article>
  );
}

// ---------- WORK ----------
function WorkSheet({ content }) {
  const [active, setActive] = useState('ds');
  const sec = content.work.sections.find(s => s.id === active);
  return (
    <section className="sheet" id="work" data-screen-label="02 Work">
      <SheetHeader kicker={content.work.kicker} title={content.work.title} sub={content.work.sub} />

      <div className="practice-wrap">
        <aside className="practice-tabs" role="tablist">
          {content.work.sections.map(s => (
            <button
              key={s.id}
              className={`practice-tab ${active === s.id ? 'on' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="pt-tag">{s.tag}</span>
              <span className="pt-title">{s.title}</span>
              <span className="pt-arrow">{active === s.id ? '●' : '○'}</span>
            </button>
          ))}
        </aside>

        <div className="practice-pane" key={active}>
          <div className="pp-head">
            <span className="pp-tag">PRACTICE / {sec.tag}</span>
            <h3 className="pp-title">{sec.title}</h3>
            <p className="pp-one">{sec.oneLiner}</p>
          </div>

          <div className="pp-grid">
            <div className="pp-col">
              <div className="col-h"><span>Method</span><span className="col-rule" /></div>
              <ol className="method">
                {sec.method.map((step, i) => (
                  <li key={i}>
                    <span className="m-num">{String(i + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="pp-col">
              <div className="col-h"><span>Proof</span><span className="col-rule" /></div>
              <ul className="proof">
                {sec.proof.map((p, i) => (
                  <li key={i}>
                    <div className="proof-k">{p.k}</div>
                    <div className="proof-v">{p.v}</div>
                  </li>
                ))}
              </ul>

              {sec.id === 'ds' && <TokenSwitcher />}
              {sec.id === 'ops' && <OpsDashboard />}
              {sec.id === 'ai' && <AIDocPreview />}
              {sec.id === 'teach' && <WorkshopBoard />}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

// ---------- Live token switcher ----------
function TokenSwitcher() {
  const [theme, setTheme] = useState('dark');
  const [density, setDensity] = useState('comfy');
  const [contrast, setContrast] = useState(false);

  const surface = theme === 'dark' ? '#0E1213' : '#F7F6F2';
  const ink = theme === 'dark' ? '#E6E6E1' : '#13171A';
  const muted = theme === 'dark' ? '#6F7A7A' : '#7A7A6F';
  const accent = contrast ? '#FFFFFF' : 'var(--accent)';
  const pad = density === 'comfy' ? 14 : density === 'cozy' ? 10 : 6;
  const radius = 2;

  return (
    <div className="ts">
      <div className="ts-h">
        <span>Live token switcher</span>
        <span className="ts-h-r">live</span>
      </div>
      <div className="ts-controls">
        <SegSmall label="Theme" opts={['dark', 'light']} val={theme} onChange={setTheme} />
        <SegSmall label="Density" opts={['comfy', 'cozy', 'tight']} val={density} onChange={setDensity} />
        <SegSmall label="Contrast" opts={['default', 'AAA']} val={contrast ? 'AAA' : 'default'} onChange={(v) => setContrast(v === 'AAA')} />
      </div>
      <div className="ts-preview" style={{ background: surface, color: ink, '--pad': pad + 'px' }}>
        <div className="ts-card">
          <div className="ts-row" style={{ color: muted }}>
            <span>card.title</span>
            <span>·</span>
            <span>v2.4</span>
          </div>
          <div className="ts-h-card" style={{ color: ink }}>Themed component</div>
          <div className="ts-body" style={{ color: muted }}>The same JSON tokens drive every render target — web, iOS, Android. Switching theme is one variable change.</div>
          <div className="ts-actions">
            <button className="ts-btn" style={{ borderColor: accent, color: accent }}>Action</button>
            <button className="ts-btn ghost" style={{ color: ink, borderColor: muted }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SegSmall({ label, opts, val, onChange }) {
  return (
    <div className="seg">
      <span className="seg-l">{label}</span>
      <div className="seg-r">
        {opts.map(o => (
          <button key={o} className={val === o ? 'on' : ''} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function OpsDashboard() {
  const bars = [
    { l: 'Adoption', v: 0.92 },
    { l: 'Reuse', v: 0.78 },
    { l: 'Drift', v: 0.08, bad: true },
    { l: 'Debt', v: 0.21, bad: true },
  ];
  return (
    <div className="ts">
      <div className="ts-h"><span>Ops dashboard — wave 4</span><span className="ts-h-r">read-only</span></div>
      <div className="ops-grid">
        {bars.map(b => (
          <div key={b.l} className="ops-row">
            <div className="ops-l">{b.l}</div>
            <div className="ops-track">
              <div className={`ops-fill ${b.bad ? 'bad' : ''}`} style={{ width: (b.v * 100) + '%' }} />
            </div>
            <div className="ops-v">{Math.round(b.v * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIDocPreview() {
  return (
    <div className="ts">
      <div className="ts-h"><span>component / Button.mdx</span><span className="ts-h-r">auto-generated</span></div>
      <pre className="code">{`# Button

Primary action surface.
Tokens: \`color.action\`, \`radius.sm\`, \`space.2\`.

## Props
- variant: 'primary' | 'ghost' | 'danger'
- size: 'sm' | 'md' | 'lg'
- icon?: IconToken

## Usage
> Use one primary per view.
> Pair with ghost for cancel.`}</pre>
    </div>
  );
}

function WorkshopBoard() {
  const items = [
    'Tokens 101 — half day',
    'System governance — 90 min',
    'Figma variables clinic — 2h',
    'Component contract review — 1h',
  ];
  return (
    <div className="ts">
      <div className="ts-h"><span>Workshop catalog</span><span className="ts-h-r">2025 — 2026</span></div>
      <ul className="ws">
        {items.map((it, i) => (
          <li key={i}><span className="ws-tick">▢</span><span>{it}</span><span className="ws-id">WS.{String(i + 1).padStart(2, '0')}</span></li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Component playground ----------
function ComponentPlayground() {
  const [variant, setVariant] = useState('primary');
  const [size, setSize] = useState('md');
  const [icon, setIcon] = useState(true);
  const [label, setLabel] = useState('Save changes');
  const [loading, setLoading] = useState(false);

  const sizeMap = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' };
  const variantMap = { primary: 'btn-pp-primary', ghost: 'btn-pp-ghost', danger: 'btn-pp-danger' };

  return (
    <div className="playground">
      <div className="pg-h">
        <span className="pg-tag">FIG.07 — Component playground</span>
        <span className="pg-rule" />
        <span className="pg-r">live · Button v2.4</span>
      </div>
      <div className="pg-body">
        <div className="pg-stage">
          <div className="pg-stage-inner">
            <button className={`btn-pp ${variantMap[variant]} ${sizeMap[size]} ${loading ? 'is-loading' : ''}`}>
              {icon && <span className="btn-pp-ic">◇</span>}
              <span>{loading ? 'Working…' : label}</span>
            </button>
            <div className="pg-callout">
              <span>↑ rendered with current tokens</span>
            </div>
          </div>
        </div>
        <div className="pg-controls">
          <SegSmall label="variant" opts={['primary', 'ghost', 'danger']} val={variant} onChange={setVariant} />
          <SegSmall label="size" opts={['sm', 'md', 'lg']} val={size} onChange={setSize} />
          <SegSmall label="icon" opts={['on', 'off']} val={icon ? 'on' : 'off'} onChange={(v) => setIcon(v === 'on')} />
          <SegSmall label="loading" opts={['off', 'on']} val={loading ? 'on' : 'off'} onChange={(v) => setLoading(v === 'on')} />
          <div className="seg">
            <span className="seg-l">label</span>
            <input className="pg-input" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
          <pre className="pg-code">{`<Button
  variant="${variant}"
  size="${size}"${icon ? '\n  icon="diamond"' : ''}${loading ? '\n  loading' : ''}
>
  ${label}
</Button>`}</pre>
        </div>
      </div>
    </div>
  );
}

// ---------- CASES ----------
function CasesSheet({ content }) {
  const [open, setOpen] = useState('sg');
  return (
    <section className="sheet" id="cases" data-screen-label="03 Case studies">
      <SheetHeader kicker={content.cases.kicker} title={content.cases.title} />
      <div className="cases">
        {content.cases.items.map(c => (
          <CaseRow key={c.id} c={c} open={open === c.id} onToggle={() => setOpen(open === c.id ? '' : c.id)} />
        ))}
      </div>
    </section>
  );
}

function CaseRow({ c, open, onToggle }) {
  const ref = useRef();
  const seen = useInView(ref, { threshold: 0.2 });
  return (
    <article className={`case ${open ? 'open' : ''}`} ref={ref}>
      <button className="case-head" onClick={onToggle}>
        <div className="case-head-l">
          <div className="case-id">CASE / {c.id.toUpperCase()}</div>
          <div className="case-client">{c.client}</div>
          <div className="case-summary">{c.summary}</div>
        </div>
        <div className="case-head-r">
          <div className="case-meta-line"><span>{c.role}</span><span>·</span><span>{c.period}</span></div>
          <div className="case-toggle">{open ? '— close' : '+ open'}</div>
        </div>
      </button>

      <div className="case-body">
        <div className="case-inner">
          <CaseBlock label="Context" body={c.context} />
          <CaseBlock label="Problem" body={c.problem} />
          <div className="case-block">
            <div className="cb-l"><span>Action</span><span className="cb-rule" /></div>
            <ul className="case-actions">
              {c.action.map((a, i) => (
                <li key={i}><span className="ca-n">{String(i + 1).padStart(2, '0')}</span><span>{a}</span></li>
              ))}
            </ul>
          </div>
          <div className="case-block">
            <div className="cb-l"><span>Result</span><span className="cb-rule" /></div>
            <div className="case-results">
              {c.result.map((r, i) => (
                <CaseStat key={i} r={r} index={i} start={open && seen} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CaseBlock({ label, body }) {
  return (
    <div className="case-block">
      <div className="cb-l"><span>{label}</span><span className="cb-rule" /></div>
      <p className="case-p">{body}</p>
    </div>
  );
}

function CaseStat({ r, index, start }) {
  const num = parseInt(r.k.replace(/[^\d-]/g, ''), 10);
  const isNumeric = !isNaN(num) && /^[−-]?\d+/.test(r.k.replace(/\s/g, ''));
  const v = useCountUp(isNaN(num) ? 0 : Math.abs(num), start, 900 + index * 150);
  const display = isNumeric
    ? (r.k.startsWith('−') || r.k.startsWith('-') ? '−' : '') + v
    : r.k;
  return (
    <div className="case-stat">
      <div className="cs-num">{display}<span className="cs-suf">{r.s}</span></div>
      <div className="cs-label">{r.v}</div>
    </div>
  );
}

// ---------- EXPERIENCE ----------
function ExperienceSheet({ content }) {
  return (
    <section className="sheet" id="experience" data-screen-label="04 Experience">
      <SheetHeader kicker={content.experience.kicker} title={content.experience.title} />
      <ol className="exp">
        {content.experience.items.map((e, i) => (
          <li key={i} className="exp-row">
            <div className="exp-l">
              <div className="exp-period">{e.period}</div>
              <div className="exp-loc">{e.location}</div>
            </div>
            <div className="exp-c">
              <div className="exp-org">{e.org}</div>
              <div className="exp-role">{e.role}</div>
            </div>
            <ul className="exp-r">
              {e.impact.map((im, j) => (
                <li key={j}>{im}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <RecosBlock content={content} />
    </section>
  );
}

function RecosBlock({ content }) {
  return (
    <div className="recos">
      <SheetHeader kicker={content.recos.kicker} title={content.recos.title} small />
      <div className="recos-grid">
        {content.recos.items.map((r, i) => (
          <figure key={i} className="reco">
            <div className="reco-head">
              <div className="reco-id">REC.{String(i + 1).padStart(2, '0')}</div>
              {r.context && <div className="reco-ctx">{r.context}</div>}
            </div>
            <blockquote>"{r.quote}"</blockquote>
            <figcaption>
              <div className="reco-name">{r.name}</div>
              <div className="reco-role">{r.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// ---------- ABOUT ----------
function AboutSheet({ content }) {
  return (
    <section className="sheet" id="about" data-screen-label="05 About">
      <SheetHeader kicker={content.about.kicker} title={content.about.title} />
      <div className="about-grid">
        <div className="about-block">
          <div className="ab-l">NOW</div>
          <p>{content.about.now}</p>
        </div>
        <div className="about-block">
          <div className="ab-l">NEXT</div>
          <p>{content.about.next}</p>
        </div>
      </div>

      <div className="principles">
        <div className="col-h"><span>Principles</span><span className="col-rule" /></div>
        <ul>
          {content.about.principles.map((p, i) => (
            <li key={i}>
              <span className="p-num">P.{String(i + 1).padStart(2, '0')}</span>
              <span className="p-k">{p.k}</span>
              <span className="p-v">{p.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------- CONTACT ----------
function ContactSheet({ content }) {
  return (
    <section className="sheet" id="contact" data-screen-label="06 Contact">
      <SheetHeader kicker={content.contact.kicker} title={content.contact.title} />
      <div className="contact">
        <p className="contact-sub">{content.contact.sub}</p>
        <div className="contact-grid">
          {content.contact.links.map((l, i) => {
            const isLink = !!l.href;
            const Tag = isLink ? 'a' : 'div';
            const props = isLink ? { href: l.href, target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <Tag key={i} className={`contact-row ${isLink ? 'is-link' : ''}`} {...props}>
                <span className="cr-id">CH.{String(i + 1).padStart(2, '0')}</span>
                <span className="cr-k">{l.k}</span>
                <span className="cr-v">{l.v}</span>
                {isLink && <span className="cr-arrow">↗</span>}
              </Tag>
            );
          })}
        </div>
        <div className="contact-avail">
          <span className="ca-dot" />
          <span>{content.contact.availability}</span>
        </div>
        <div className="signoff">
          <div>— Martin Molet</div>
          <div className="so-sub">{content.meta.role}</div>
        </div>
      </div>
    </section>
  );
}

// ---------- shared ----------
function SheetHeader({ kicker, title, sub, small }) {
  return (
    <header className={`sh ${small ? 'sh-sm' : ''}`}>
      <div className="sh-kicker">{kicker}</div>
      {title && (
        <h2 className="sh-title">
          {title.split('\n').map((l, i) => <span key={i}>{l}</span>)}
        </h2>
      )}
      {sub && <p className="sh-sub">{sub}</p>}
    </header>
  );
}

// ---------- TWEAKS PANEL ----------
function PortfolioTweaks({ tweaks, setTweak }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Visual">
        <TweakSelect
          label="accent"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={Object.entries(ACCENTS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
        <TweakRadio
          label="density"
          value={tweaks.density}
          onChange={(v) => setTweak('density', v)}
          options={[
            { value: 'comfortable', label: 'Comfy' },
            { value: 'compact', label: 'Compact' },
          ]}
        />
        <TweakRadio
          label="type"
          value={tweaks.typePair}
          onChange={(v) => setTweak('typePair', v)}
          options={[
            { value: 'mono-only', label: 'Mono only' },
            { value: 'serif-mono', label: 'Serif + mono' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Blueprint">
        <TweakToggle label="grid overlay" value={tweaks.grid} onChange={(v) => setTweak('grid', v)} />
        <TweakToggle label="cursor crosshair" value={tweaks.crosshair} onChange={(v) => setTweak('crosshair', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ---------- APP ----------
function App() {
  const [lang, setLang] = useState('en');
  const [tweaks, setTweak] = useTweaksLocal();
  const content = window.CONTENT[lang];
  const [sectionId, setSectionId] = useState('home');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const stageRef = useRef();

  // accent + density variables on root
  const accent = ACCENTS[tweaks.accent] || ACCENTS.cyan;
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent.hex);
    document.documentElement.style.setProperty('--accent-soft', accent.hex + '33');
    document.documentElement.dataset.density = tweaks.density;
    document.documentElement.dataset.grid = tweaks.grid ? 'on' : 'off';
    document.documentElement.dataset.crosshair = tweaks.crosshair ? 'on' : 'off';
    document.documentElement.dataset.typepair = tweaks.typePair;
  }, [accent.hex, tweaks.density, tweaks.grid, tweaks.crosshair, tweaks.typePair]);

  // scroll spy
  useEffect(() => {
    const ids = ['home', 'work', 'cases', 'experience', 'about', 'contact'];
    const els = ids.map(i => document.getElementById(i)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setSectionId(visible.target.id);
    }, { threshold: [0.25, 0.5, 0.75] });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [lang]);

  // mouse for crosshair + coord readout
  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const onJump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="stage" ref={stageRef}>
      {tweaks.grid && <div className="grid-bg" aria-hidden />}
      {tweaks.crosshair && (
        <>
          <div className="cross-h" style={{ top: mouse.y }} aria-hidden />
          <div className="cross-v" style={{ left: mouse.x }} aria-hidden />
        </>
      )}

      <TopBar lang={lang} setLang={setLang} content={content} onJump={onJump} mouse={mouse} sectionId={sectionId} />

      <main className="sheets">
        <HomeSheet content={content} onJump={onJump} accent={accent} />
        <WorkSheet content={content} />
        <CasesSheet content={content} />
        <ExperienceSheet content={content} />
        <AboutSheet content={content} />
        <ContactSheet content={content} />
      </main>

      <StatusBar content={content} sectionId={sectionId} />

      <PortfolioTweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

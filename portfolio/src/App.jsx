import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#F8F5F0",
  surface: "#FFFFFF",
  surfaceAlt: "#F2EDE6",
  ink: "#181412",
  inkMid: "#4A403A",
  inkLight: "#8A7E78",
  accent: "#C94F2C",
  accentWarm: "#E8956D",
  accentCool: "#2C5F8A",
  border: "#E4DDD5",
  borderDark: "#C8BDB5",
};

const styles = {
  "@import":
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Syne', sans-serif;
    background: #F8F5F0;
    color: #181412;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #F8F5F0; }
  ::-webkit-scrollbar-thumb { background: #C8BDB5; border-radius: 2px; }

  .fade-up {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .stagger-1 { transition-delay: 0.05s; }
  .stagger-2 { transition-delay: 0.12s; }
  .stagger-3 { transition-delay: 0.19s; }
  .stagger-4 { transition-delay: 0.26s; }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

/* ─── HOOK ─── */
function useIntersection(ref, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div
      ref={ref}
      className={`fade-up${visible ? " visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["home", "about", "skills", "projects", "certifications", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 140) { setActive(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 3rem",
      height: "64px",
      background: scrolled ? "rgba(248,245,240,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
      transition: "all 0.35s ease",
    }}>
      <a href="#home" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.5rem", fontWeight: 700,
        color: COLORS.ink, textDecoration: "none",
        letterSpacing: "-0.01em",
      }}>
        Parin<span style={{ color: COLORS.accent }}>.</span>
      </a>

      <ul style={{ listStyle: "none", display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {links.map(l => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              style={{
                textDecoration: "none",
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: active === l.id ? COLORS.accent : COLORS.inkMid,
                transition: "color 0.2s",
                borderBottom: active === l.id ? `1.5px solid ${COLORS.accent}` : "1.5px solid transparent",
                paddingBottom: "2px",
              }}
              onMouseEnter={e => e.target.style.color = COLORS.accent}
              onMouseLeave={e => e.target.style.color = active === l.id ? COLORS.accent : COLORS.inkMid}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const [typed, setTyped] = useState("");
  const roles = ["ML Engineer", "React Developer", "Data Analyst", "Computer Vision"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    const timeout = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setTyped(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && charIdx > 0) {
        setTyped(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else if (deleting && charIdx === 0) {
        setDeleting(false);
        setRoleIdx(r => (r + 1) % roles.length);
      }
    }, deleting ? 55 : 95);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  return (
    <section id="home" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "8rem 3rem 4rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        opacity: 0.4,
      }} />

      {/* Large decorative text */}
      <div style={{
        position: "absolute", right: "-2rem", top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(8rem, 18vw, 18rem)",
        fontWeight: 700, color: "transparent",
        WebkitTextStroke: `1px ${COLORS.border}`,
        lineHeight: 1, userSelect: "none", zIndex: 0,
        letterSpacing: "-0.04em",
      }}>PS</div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "780px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem", color: COLORS.accent,
          letterSpacing: "0.18em", textTransform: "uppercase",
          marginBottom: "1.5rem",
          display: "flex", alignItems: "center", gap: "0.8rem",
          opacity: 0, animation: "fadeIn 0.6s 0.2s forwards",
        }}>
          <span style={{ display: "block", width: "2.5rem", height: "1px", background: COLORS.accent }} />
          B.Tech Computer Engineering · IITRAM Ahmedabad
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(3.5rem, 8vw, 7rem)",
          fontWeight: 700, lineHeight: 1.0,
          letterSpacing: "-0.03em", color: COLORS.ink,
          marginBottom: "1rem",
          opacity: 0, animation: "fadeIn 0.6s 0.35s forwards",
        }}>
          Parin<br />Solanki
        </h1>

        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          fontWeight: 500, color: COLORS.inkMid,
          marginBottom: "2rem", height: "2rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
          opacity: 0, animation: "fadeIn 0.6s 0.5s forwards",
        }}>
          <span style={{ color: COLORS.accent }}>//</span>
          <span style={{ color: COLORS.ink }}>{typed}</span>
          <span style={{ animation: "blink 1s infinite", color: COLORS.accent, fontSize: "1.2em" }}>|</span>
        </div>

        <p style={{
          fontSize: "1rem", color: COLORS.inkMid,
          lineHeight: 1.8, maxWidth: "520px",
          fontWeight: 400, marginBottom: "3rem",
          opacity: 0, animation: "fadeIn 0.6s 0.65s forwards",
        }}>
          Building intelligent systems at the intersection of machine learning, computer vision, and modern web development. Currently pursuing B.Tech at IITRAM, graduating May 2027.
        </p>

        <div style={{
          display: "flex", gap: "1rem", flexWrap: "wrap",
          opacity: 0, animation: "fadeIn 0.6s 0.8s forwards",
        }}>
          <a href="#projects" style={{
            padding: "0.85rem 2.2rem",
            background: COLORS.ink, color: "#fff",
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.82rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            textDecoration: "none", border: "none",
            cursor: "pointer", borderRadius: "3px",
            transition: "background 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = COLORS.accent; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = COLORS.ink; e.target.style.transform = "translateY(0)"; }}
          >View Projects</a>

          <a href="#contact" style={{
            padding: "0.85rem 2.2rem",
            background: "transparent", color: COLORS.ink,
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.82rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            textDecoration: "none",
            border: `1.5px solid ${COLORS.borderDark}`,
            cursor: "pointer", borderRadius: "3px",
            transition: "border-color 0.2s, color 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = COLORS.ink; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = COLORS.borderDark; e.target.style.transform = "translateY(0)"; }}
          >Get in Touch</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2.5rem", left: "3rem",
        display: "flex", alignItems: "center", gap: "0.8rem",
        opacity: 0, animation: "fadeIn 0.6s 1.2s forwards",
      }}>
        <div style={{
          width: "1px", height: "3rem",
          background: `linear-gradient(to bottom, transparent, ${COLORS.borderDark})`,
        }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem", color: COLORS.inkLight,
          letterSpacing: "0.15em", writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}>SCROLL</span>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}

/* ─── ABOUT ─── */
function About() {
  const infoItems = [
    { label: "Location", value: "Ahmedabad, Gujarat" },
    { label: "Phone", value: "+91 94097 19436" },
    { label: "Email", value: "Parin.Solanki.23co@iitram.ac.in" },
    { label: "Status", value: "Open to Opportunities" },
  ];

  const courses = [
    "Data Structures", "Algorithms (DAA)", "Machine Learning",
    "Computer Vision", "DBMS", "Software Engineering",
    "Distributed Systems", "Information Security",
    "OOP", "Mobile Computing",
  ];

  return (
    <section id="about" style={{ padding: "7rem 3rem", background: COLORS.surface, borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeUp>
          <SectionLabel index="01" title="About" />
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "5rem", marginTop: "3.5rem" }}>
          <div>
            {infoItems.map((item, i) => (
              <FadeUp key={item.label} delay={i * 0.07}>
                <div style={{
                  padding: "1.2rem 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.62rem", color: COLORS.accent,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    marginBottom: "0.35rem",
                  }}>{item.label}</div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "0.88rem", fontWeight: 500, color: COLORS.ink,
                    wordBreak: "break-word",
                  }}>{item.value}</div>
                </div>
              </FadeUp>
            ))}
          </div>

          <div>
            <FadeUp>
              <p style={{ fontSize: "1.05rem", color: COLORS.inkMid, lineHeight: 1.85, marginBottom: "1.4rem", fontWeight: 400 }}>
                I am a Computer Engineering student at the Institute of Infrastructure Technology Research and Management (IITRAM), Ahmedabad. My work focuses on machine learning, computer vision, and building data-driven applications that solve real problems.
              </p>
              <p style={{ fontSize: "1.05rem", color: COLORS.inkMid, lineHeight: 1.85, marginBottom: "2rem", fontWeight: 400 }}>
                From training transformer-based models for plant disease detection to engineering fraud detection pipelines with a 0.987 ROC-AUC score — I enjoy the full lifecycle of building intelligent systems, from raw data to deployed interfaces.
              </p>
            </FadeUp>

            {/* Education */}
            <FadeUp delay={0.1}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem", fontWeight: 700, color: COLORS.ink,
                marginBottom: "1.2rem", letterSpacing: "-0.01em",
              }}>Education</h3>
            </FadeUp>

            {[
              { name: "IITRAM — Institute of Infrastructure Technology", deg: "B.Tech, Computer Engineering", period: "Aug 2023 – May 2027", loc: "Ahmedabad, Gujarat" },
              { name: "Shree B.M. Patel School", deg: "12th Science — 81.33%", period: "June 2022 – March 2023", loc: "Jamnagar, Gujarat" },
            ].map((e, i) => (
              <FadeUp key={e.name} delay={0.15 + i * 0.08}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "1.2rem 1.5rem",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "6px",
                  marginBottom: "0.8rem",
                  background: COLORS.bg,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: COLORS.ink, marginBottom: "0.2rem" }}>{e.name}</div>
                    <div style={{ fontSize: "0.85rem", color: COLORS.inkMid }}>{e.deg}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: COLORS.inkLight, marginTop: "0.3rem" }}>{e.loc}</div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem", color: COLORS.accent,
                    whiteSpace: "nowrap", marginLeft: "1rem",
                  }}>{e.period}</div>
                </div>
              </FadeUp>
            ))}

            {/* Coursework */}
            <FadeUp delay={0.25}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem", fontWeight: 700, color: COLORS.ink,
                margin: "2rem 0 1rem", letterSpacing: "-0.01em",
              }}>Relevant Coursework</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {courses.map(c => (
                  <span key={c} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem", padding: "0.35rem 0.85rem",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "3px", color: COLORS.inkMid,
                    background: COLORS.surface,
                    letterSpacing: "0.02em",
                  }}>{c}</span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─── */
function Skills() {
  const groups = [
    {
      title: "Languages",
      items: ["Python", "C++", "SQL", "HTML / CSS", "JavaScript"],
    },
    {
      title: "AI & Machine Learning",
      items: ["TensorFlow", "PyTorch", "Scikit-learn", "XGBoost", "SMOTE", "ViT", "YOLO", "Swin Transformer"],
    },
    {
      title: "Web & Frameworks",
      items: ["React.js", "Recharts", "GitHub Pages", "Linux", "Git / GitHub"],
    },
    {
      title: "Data & Analytics",
      items: ["Power BI", "Pandas", "NumPy", "Matplotlib", "Seaborn", "MySQL", "Jupyter Notebook", "Kaggle"],
    },
  ];

  return (
    <section id="skills" style={{ padding: "7rem 3rem", background: COLORS.bg }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeUp><SectionLabel index="02" title="Technical Skills" /></FadeUp>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5px",
          marginTop: "3.5rem", border: `1px solid ${COLORS.border}`,
          borderRadius: "6px", overflow: "hidden",
          background: COLORS.border,
        }}>
          {groups.map((g, i) => (
            <FadeUp key={g.title} delay={i * 0.08}>
              <div style={{
                background: COLORS.surface, padding: "2.5rem",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.surface}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem", color: COLORS.accent,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}>0{i + 1}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.35rem", fontWeight: 700, color: COLORS.ink,
                  marginBottom: "1.5rem", letterSpacing: "-0.01em",
                }}>{g.title}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {g.items.map(item => (
                    <span key={item} style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "0.75rem", fontWeight: 500,
                      padding: "0.3rem 0.75rem",
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: "3px", color: COLORS.inkMid,
                      transition: "all 0.15s", cursor: "default",
                    }}
                      onMouseEnter={e => {
                        e.target.style.background = COLORS.ink;
                        e.target.style.color = "#fff";
                        e.target.style.borderColor = COLORS.ink;
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = COLORS.bg;
                        e.target.style.color = COLORS.inkMid;
                        e.target.style.borderColor = COLORS.border;
                      }}
                    >{item}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ─── */
function Projects() {
  const projects = [
    {
      index: "01",
      type: "Computer Vision · Deep Learning",
      name: "Leaf Disease Detection System",
      period: "Aug 2025 – Oct 2025",
      stack: ["Python", "TensorFlow", "PyTorch", "ViT", "YOLO", "Swin Transformer"],
      points: [
        "Developed a deep learning pipeline to detect and classify plant leaf diseases using state-of-the-art vision architectures.",
        "Trained and benchmarked Vision Transformer (ViT), YOLO, and Swin Transformer models against one another.",
        "Applied preprocessing and data augmentation on 5,000+ labeled images to improve model generalization.",
        "Achieved high classification accuracy across multiple plant disease categories.",
      ],
      metric: null,
    },
    {
      index: "02",
      type: "Full-Stack · IoT",
      name: "Anedya IoT Analytics Dashboard",
      period: "March 2026 – Apr 2026",
      stack: ["React.js", "JavaScript", "Recharts", "RBAC", "GitHub Pages"],
      points: [
        "Built a full-stack IoT monitoring dashboard for real-time temperature, humidity, relay state, and node status.",
        "Implemented token-based authentication with protected routes, session management, and a simulated backend service layer.",
        "Designed Role-Based Access Control (RBAC) with Admin, Operator, and Viewer roles with dynamic UI rendering.",
        "Integrated 24-hour historical trend charts and automated deployment via gh-pages CI/CD pipeline.",
      ],
      metric: "Live Demo Available",
    },
    {
      index: "03",
      type: "Machine Learning · FinTech",
      name: "Credit Card Fraud Detection",
      period: "Nov 2025 – Dec 2025",
      stack: ["Python", "Scikit-learn", "XGBoost", "SMOTE"],
      points: [
        "Built a fraud detection model on a severely imbalanced dataset: 199,006 legitimate vs 356 fraudulent transactions.",
        "Addressed class imbalance using SMOTE oversampling and class-weight adjustments in a Scikit-learn pipeline.",
        "Applied XGBoost with RandomizedSearchCV hyperparameter tuning for optimal classifier performance.",
        "Evaluated with ROC-AUC, Precision-Recall curves, and detailed classification metrics.",
      ],
      metric: "ROC-AUC 0.987 · Precision 91% · Recall 85%",
    },
    {
      index: "04",
      type: "Data Analytics · EDA",
      name: "Exploratory Data Analysis Suite",
      period: "Dec 2025",
      stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
      points: [
        "Performed comprehensive EDA on Flight Price, Google Play Store, and Red Wine Quality datasets.",
        "Conducted data cleaning, preprocessing, and statistical analysis using Pandas and NumPy.",
        "Generated visualizations to surface trends, feature correlations, and outliers.",
        "Derived actionable insights to support data-driven decision making.",
      ],
      metric: null,
    },
    {
      index: "05",
      type: "Business Intelligence",
      name: "Sales Data Analysis Dashboard",
      period: "Oct 2025",
      stack: ["Power BI", "Excel", "Data Visualization"],
      points: [
        "Designed an interactive Power BI dashboard analyzing sales, profit, and quantity metrics from retail data.",
        "Cleaned and transformed Excel data to build a structured analytical data model.",
        "Built visuals covering sales overview, profit comparison, and top/bottom product performance.",
        "Enabled interactive drill-down filtering for business decision support.",
      ],
      metric: null,
    },
  ];

  return (
    <section id="projects" style={{ padding: "7rem 3rem", background: COLORS.surface, borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeUp><SectionLabel index="03" title="Selected Projects" /></FadeUp>

        <div style={{ marginTop: "3.5rem" }}>
          {projects.map((p, i) => (
            <FadeUp key={p.index} delay={i * 0.06}>
              <ProjectRow project={p} last={i === projects.length - 1} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project: p, last }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderTop: `1px solid ${COLORS.border}`,
      borderBottom: last ? `1px solid ${COLORS.border}` : "none",
    }}>
      <div
        style={{
          display: "grid", gridTemplateColumns: "80px 1fr auto",
          gap: "2rem", alignItems: "center",
          padding: "1.8rem 0", cursor: "pointer",
          transition: "background 0.15s",
        }}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={e => e.currentTarget.style.paddingLeft = "0.75rem"}
        onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
      >
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem", color: COLORS.inkLight,
          letterSpacing: "0.1em",
        }}>{p.index}</div>

        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem", color: COLORS.accent,
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: "0.35rem",
          }}>{p.type}</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem", fontWeight: 700, color: COLORS.ink,
            letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>{p.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.7rem" }}>
            {p.stack.map(s => (
              <span key={s} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.63rem", padding: "0.2rem 0.6rem",
                background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: "2px", color: COLORS.inkLight,
              }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem", color: COLORS.inkLight,
          }}>{p.period}</span>
          <span style={{
            width: "28px", height: "28px",
            border: `1px solid ${COLORS.borderDark}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", color: COLORS.inkMid,
            transition: "all 0.2s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}>+</span>
        </div>
      </div>

      {open && (
        <div style={{
          padding: "0 0 2rem 80px",
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: "1.5rem",
        }}>
          <ul style={{ listStyle: "none", marginBottom: p.metric ? "1.2rem" : 0 }}>
            {p.points.map((pt, i) => (
              <li key={i} style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                padding: "0.4rem 0",
                fontSize: "0.9rem", color: COLORS.inkMid, lineHeight: 1.7,
              }}>
                <span style={{ color: COLORS.accent, marginTop: "0.5rem", fontSize: "0.5rem", flexShrink: 0 }}>◆</span>
                {pt}
              </li>
            ))}
          </ul>
          {p.metric && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem", color: COLORS.accent,
              padding: "0.6rem 1rem",
              border: `1px solid ${COLORS.accentWarm}`,
              borderRadius: "3px",
              background: "#FDF3EE",
              display: "inline-block",
              letterSpacing: "0.05em",
            }}>{p.metric}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── CERTIFICATIONS ─── */
function Certifications() {
  const certs = [
    {
      org: "NPTEL", year: "2025",
      name: "Big Data Computing",
      detail: "Elite + Silver Certificate — Score: 76%",
      desc: "Distributed data processing and large-scale analytics.",
    },
    {
      org: "NPTEL", year: "2025",
      name: "Programming with Generative AI",
      detail: "Elite + Silver Certificate — Score: 75%",
      desc: "Prompt engineering and generative AI model applications.",
    },
    {
      org: "NPTEL", year: "2026",
      name: "Neural Networks for Computer Vision & Deep Learning",
      detail: "Certification",
      desc: "Advanced coursework covering neural network architectures for vision tasks.",
    },
    {
      org: "IIT Bombay & AWS", year: "2025",
      name: "Machine Learning Workshop",
      detail: "Workshop Certification",
      desc: "Practical ML applications and cloud-based model deployment on AWS.",
    },
  ];

  const activities = [
    {
      name: "National Service Scheme (NSS) — Volunteer",
      period: "2023 – Present",
      desc: "Participating in social awareness programs and community outreach initiatives.",
    },
    {
      name: "Career Development Centre, IITRAM — Outreach Team",
      period: "2025 – Present",
      desc: "Supporting student engagement and organizing career events and industry workshops.",
    },
  ];

  return (
    <section id="certifications" style={{ padding: "7rem 3rem", background: COLORS.bg }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeUp><SectionLabel index="04" title="Certifications & Activities" /></FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "3.5rem" }}>
          {certs.map((c, i) => (
            <FadeUp key={c.name} delay={i * 0.07}>
              <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: "6px", padding: "2rem",
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderDark; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                  <div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem", color: COLORS.accent,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                    }}>{c.org}</span>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.62rem", color: COLORS.inkLight,
                  }}>{c.year}</span>
                </div>
                <h4 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.2rem", fontWeight: 700, color: COLORS.ink,
                  marginBottom: "0.4rem", lineHeight: 1.3, letterSpacing: "-0.01em",
                }}>{c.name}</h4>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.75rem", fontWeight: 600, color: COLORS.accentCool,
                  marginBottom: "0.5rem",
                }}>{c.detail}</div>
                <p style={{ fontSize: "0.83rem", color: COLORS.inkMid, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem", fontWeight: 700, color: COLORS.ink,
            margin: "4rem 0 1.5rem", letterSpacing: "-0.01em",
          }}>Extracurricular Activities</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {activities.map((a, i) => (
              <div key={a.name} style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: "6px", padding: "1.8rem",
                borderLeft: `3px solid ${COLORS.accent}`,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem", color: COLORS.accent,
                  letterSpacing: "0.12em", marginBottom: "0.4rem",
                }}>{a.period}</div>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: COLORS.ink, marginBottom: "0.5rem", lineHeight: 1.4 }}>{a.name}</div>
                <p style={{ fontSize: "0.83rem", color: COLORS.inkMid, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const links = [
    { label: "Email", value: "Parin.Solanki.23co@iitram.ac.in", href: "mailto:Parin.Solanki.23co@iitram.ac.in" },
    { label: "LinkedIn", value: "linkedin.com/in/ParinSolanki", href: "https://www.linkedin.com/in/parin-solanki-4075aa29a/" },
    { label: "GitHub", value: "github.com/ParinSolanki", href: "https://github.com/Heisenberg-WW-JP" },
    { label: "Phone", value: "+91 94097 19436", href: "tel:+919409719436" },
  ];

  return (
    <section id="contact" style={{
      padding: "8rem 3rem",
      background: COLORS.ink, color: "#fff",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(6rem, 20vw, 20rem)",
        fontWeight: 700, color: "rgba(255,255,255,0.025)",
        whiteSpace: "nowrap", userSelect: "none",
        letterSpacing: "-0.04em", lineHeight: 1,
      }}>CONTACT</div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeUp>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem", color: COLORS.accent,
            letterSpacing: "0.2em", textTransform: "uppercase",
            marginBottom: "1rem",
            display: "flex", alignItems: "center", gap: "0.8rem",
          }}>
            <span style={{ display: "block", width: "2rem", height: "1px", background: COLORS.accent }} />
            05 — Contact
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700, letterSpacing: "-0.03em",
            color: "#fff", lineHeight: 1.1, marginBottom: "2rem",
          }}>Let's Work Together</h2>
          <p style={{
            fontSize: "1rem", color: "rgba(255,255,255,0.55)",
            lineHeight: 1.8, maxWidth: "500px", marginBottom: "4rem",
            fontWeight: 400,
          }}>
            Currently seeking internship opportunities, research collaborations, and interesting engineering challenges. Feel free to reach out through any of the channels below.
          </p>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", overflow: "hidden" }}>
          {links.map((l, i) => (
            <FadeUp key={l.label} delay={i * 0.08}>
              <a href={l.href} target={l.href.startsWith("http") ? "_blank" : "_self"} rel="noreferrer" style={{
                display: "block", padding: "2rem 2.5rem",
                background: "rgba(255,255,255,0.03)",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem", color: COLORS.accent,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}>{l.label}</div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.95rem", color: "#fff", fontWeight: 500,
                  wordBreak: "break-all",
                }}>{l.value}</div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{
      background: COLORS.ink, borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "1.5rem 3rem",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem", color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.1em",
      }}>© 2026 Parin Solanki</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem", color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.06em",
      }}>IITRAM · Ahmedabad, Gujarat</span>
    </footer>
  );
}

/* ─── SECTION LABEL ─── */
function SectionLabel({ index, title }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.68rem", color: COLORS.accent,
        letterSpacing: "0.2em", textTransform: "uppercase",
        marginBottom: "0.5rem",
        display: "flex", alignItems: "center", gap: "0.8rem",
      }}>
        <span style={{ display: "block", width: "2rem", height: "1px", background: COLORS.accent }} />
        {index} — {title}
      </div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(2rem, 4vw, 3.2rem)",
        fontWeight: 700, color: COLORS.ink,
        letterSpacing: "-0.03em", lineHeight: 1.1,
      }}>{title}</h2>
    </div>
  );
}

/* ─── APP ─── */
export default function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}


import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, SunMoon, X } from "lucide-react";
import { motion } from "framer-motion";
import TagCloud from "react-tagcloud";
import { Document, Page } from "react-pdf";

// Tema Context
const ThemeContext = createContext();

// Yazar Profilleri
const authors = [
  { id: 0, name: "Dr. A. Genetik", bio: "Uzman genetik araştırmacı" },
  { id: 1, name: "Prof. B. Biyotek", bio: "Biyoteknoloji profesörü" },
];

// Örnek makaleler
const articles = [
  {
    id: 0,
    authorId: 0,
    category: "Genetik",
    title: "CRISPR Teknolojisinde Yeni Nesil Gen Düzenleme",
    summary: "CRISPR-Cas12/Cas13 sistemleri, genetik hastalıkların tedavisinde daha hassas çözümler sunuyor.",
    content: "... uzun içerik ...",
    pdfUrl: "https://arxiv.org/pdf/2001.00001.pdf",
    keywords: ["CRISPR", "Cas12", "Gen Düzenleme"],
  },
  // Diğer makaleler benzer formatta eklenmeli.
];

// Araştırma makaleleri bağlantıları
const researchArticles = [
  {
    topic: "Genetik",
    links: [
      { title: "CRISPR-Cas12/Cas13: Bibliometric analysis and systematic review", url: "https://www.sciencedirect.com/science/article/pii/S1876034124000534" },
      { title: "CRISPR-Cas12: A Versatile Tool for Genome Editing and Beyond", url: "https://journals.ku.edu/sjm/article/view/23277" }
    ]
  },
  {
    topic: "Tek Hücreli RNA",
    links: [
      { title: "Single-cell RNA sequencing data dimensionality reduction (Review)", url: "https://www.spandidos-publications.com/10.3892/wasj.2025.315" },
      { title: "Advancements in single-cell RNA sequencing and spatial omics", url: "https://www.frontierspartnerships.org/journals/acta-biochimica-polonica/articles/10.3389/abp.2025.13922/full" }
    ]
  },
  {
    topic: "Organoid Teknolojisi",
    links: [
      { title: "Recent progress on organoids: Techniques, advantages and applications", url: "https://www.sciencedirect.com/science/article/pii/S0753332225001362" },
      { title: "Organoid research breakthroughs in 2024: A review", url: "https://www.accscience.com/journal/OR/articles/online_first/4838" }
    ]
  },
  {
    topic: "Yapay Zeka & Genom",
    links: [
      { title: "Increasing use of artificial intelligence in genomic medicine", url: "https://www.nature.com/articles/s44276-025-00135-4" },
      { title: "Advancing Precision Oncology with AI-Powered Genomic Analysis", url: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2025.1591696/full" }
    ]
  }
];

export default function App() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Google Analytics setup
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <Layout />
      </Router>
    </ThemeContext.Provider>
  );
}

function Layout() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-black text-black dark:text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link to="/" className="text-2xl font-bold">📝 My Blog</Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <SunMoon className={`w-5 h-5 ${theme === "light" ? "rotate-180" : ""}`} />
          </button>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link to="/">Anasayfa</Link>
            <Link to="/articles">Makaleler</Link>
            <Link to="/authors">Yazarlar</Link>
            <Link to="/about">Hakkımda</Link>
            <Link to="/contact">İletişim</Link>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="flex flex-col gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 md:hidden bg-zinc-50 dark:bg-zinc-900">
          <Link to="/">Anasayfa</Link>
          <Link to="/articles">Makaleler</Link>
          <Link to="/authors">Yazarlar</Link>
          <Link to="/about">Hakkımda</Link>
          <Link to="/contact">İletişim</Link>
        </nav>
      )}

      <main className="px-6 py-10 space-y-16 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/author/:id" element={<AuthorDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="text-center py-10 text-sm text-zinc-500" id="subscribe">
        <h3>RSS Aboneliği</h3>
        <Input placeholder="E-posta adresiniz" type="email" />
        <Button>Abone Ol</Button>
      </footer>
    </div>
);

// Diğer bileşenler: Home, Articles, Authors, AuthorDetail, PostDetail, About, Contact

function Home() {
  useEffect(() => { if (Notification.permission !== 'granted') Notification.requestPermission(); }, []);
  useEffect(() => { new Notification('Blog', { body: 'Yeni yazılar eklendi!' }); }, []);
  const keywords = articles.flatMap(a => a.keywords).map(k => ({ value: k, count: Math.random() * 10 + 1 }));

  return (
    <>
      <section className="mb-8">
        <h1 className="text-3xl font-bold">Popüler Konular</h1>
        <TagCloud minSize={12} maxSize={35} tags={keywords} />
      </section>
      {/* İstatistik kartları ve kategori filtresi burada yer almalı */}
    </>
  );
}

function Articles() {
  return (
    <div className="space-y-8">
      {/* Makaleler listesi */}
    </div>
  );
}

function Authors() {
  return (
    <div className="space-y-4">
      {/* Yazarlar listesi */}
    </div>
  );
}

function AuthorDetail() {
  return (
    <div className="space-y-4">
      {/* Yazar detayı */}
    </div>
  );
}

function PostDetail() {
  return (
    <div className="space-y-8">
      {/* Yazı detayı */}
    </div>
  );
}

function About() { return <p className="italic">(Bu bölüm daha sonra eklenecek.)</p>; }
function Contact() {
  return (
    <form className="space-y-4 max-w-md mx-auto">
      <Input placeholder="Adınız" />
      <Input placeholder="E-posta" type="email" />
      <Input placeholder="Mesajınız" as="textarea" rows={4} />
      <Button>Gönder</Button>
    </form>
  );
}

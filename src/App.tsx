import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { 
  Mic, 
  Video, 
  Scissors, 
  Radio, 
  FileText, 
  Building2, 
  Camera, 
  Lightbulb, 
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Play,
  X,
  Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import AdminPanel from "./components/AdminPanel";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Início", href: "#home" },
    { name: "Sobre", href: "#about" },
    { name: "Serviços", href: "#services" },
    { name: "Equipamentos", href: "#equipment" },
    { name: "Preços", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 relative">
            <img 
              src="https://i.postimg.cc/MpxNwd63/P-logo.png" 
              alt="Logo" 
              className="absolute inset-0 w-full h-full object-contain" 
            />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap text-white">Paleta Estúdios</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <a 
          href="https://api.whatsapp.com/send/?phone=5511961959349&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
        >
          Agende uma Visita
        </a>
      </div>
    </nav>
  );
};

const Hero = ({ images: dbImages }: { images?: string[] }) => {
  const defaultImages = [
    "https://i.postimg.cc/zvZpjG3t/DSC1385.jpg",
    "https://i.postimg.cc/PfYSqYRx/DSC1378.jpg",
    "https://i.postimg.cc/Y0K83Cjd/DSC1386.jpg",
    "https://i.postimg.cc/8CYZ7HGj/DSC1388.jpg",
    "https://i.postimg.cc/25t01wYR/DSC1391.jpg",
    "https://i.postimg.cc/bw3ChPFQ/DSC1403.jpg",
    "https://i.postimg.cc/W1XWvVfN/DSC1408.jpg",
    "https://i.postimg.cc/L4tVSRJ8/DSC1319.jpg",
    "https://i.postimg.cc/x82ymp41/DSC1330.jpg",
    "https://i.postimg.cc/CxPN2Nz7/DSC1347.jpg",
    "https://i.postimg.cc/13CHdHfc/DSC1348.jpg",
    "https://i.postimg.cc/NjfDbVfX/DSC1353.jpg",
    "https://i.postimg.cc/m2SVYR4p/DSC1366.jpg"
  ];
  const images = dbImages && dbImages.length > 0 ? dbImages : defaultImages;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentIndex}
            src={images[currentIndex]} 
            alt={`Estúdio de Podcast em São Paulo - Paleta Estúdios - Foto ${currentIndex + 1}`} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'opacity' }}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#0a0a0a]"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          O Melhor <span className="gradient-text">Estúdio de Podcast</span> em São Paulo
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
        >
          Aluguel de estúdio para podcast corporativo, gravação de lives e produções audiovisuais no coração de SP.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="#contact" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-colors">
            Começar Agora <ChevronRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const About = ({ images: dbImages }: { images?: string[] }) => {
  const defaultImages = [
    "https://i.postimg.cc/PfYSqYRx/DSC1378.jpg",
    "https://i.postimg.cc/Y0K83Cjd/DSC1386.jpg",
    "https://i.postimg.cc/8CYZ7HGj/DSC1388.jpg",
    "https://i.postimg.cc/25t01wYR/DSC1391.jpg",
    "https://i.postimg.cc/bw3ChPFQ/DSC1403.jpg",
    "https://i.postimg.cc/W1XWvVfN/DSC1408.jpg",
    "https://i.postimg.cc/L4tVSRJ8/DSC1319.jpg",
    "https://i.postimg.cc/x82ymp41/DSC1330.jpg",
    "https://i.postimg.cc/CxPN2Nz7/DSC1347.jpg",
    "https://i.postimg.cc/13CHdHfc/DSC1348.jpg",
    "https://i.postimg.cc/NjfDbVfX/DSC1353.jpg",
    "https://i.postimg.cc/m2SVYR4p/DSC1366.jpg"
  ];
  const images = dbImages && dbImages.length > 0 ? dbImages : defaultImages;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-4">Nosso DNA</h2>
          <h3 className="text-4xl font-bold mb-6">Aluguel de Estúdio de Podcast em São Paulo</h3>
          <p className="text-white/70 leading-relaxed mb-6">
            No coração de São Paulo, o maior palco da América Latina, nasceu um espaço feito para quem leva conteúdo a sério. A Paleta Estúdios oferece o melhor serviço de <strong>aluguel de estúdio de podcast</strong>, com estrutura híbrida, estética sofisticada e tudo que você precisa para transformar uma ideia em conteúdo de alto impacto — do roteiro à distribuição.
          </p>
          <p className="text-white/70 leading-relaxed mb-8">
            Especialistas em <strong>podcast corporativo</strong> e produções audiovisuais, nossa identidade une decoração vintage com influências industriais, criando um ambiente acolhedor, moderno e absolutamente instagramável.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 size={18} className="text-green-500" /> Estúdio fotográfico completo
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 size={18} className="text-green-500" /> Camarim privativo
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 size={18} className="text-green-500" /> Até 4 pessoas simultâneas
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 size={18} className="text-green-500" /> Ambiente discreto
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden aspect-square md:aspect-video"
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentIndex}
              src={images[currentIndex]} 
              alt="Studio Environment" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Gravação de Podcast",
      desc: "Aluguel de estúdio completo com microfones Shure e câmeras 4K para o seu podcast em São Paulo.",
      icon: Mic,
    },
    {
      title: "Edição e Pós-produção",
      desc: "Tratamento completo de áudio e vídeo, garantindo um resultado final impecável para YouTube e Spotify.",
      icon: Scissors,
    },
    {
      title: "Cortes para Redes Sociais",
      desc: "Transformamos seu podcast em pílulas virais para Instagram, TikTok e YouTube Shorts.",
      icon: Video,
    },
    {
      title: "Gravação de Lives",
      desc: "Transmissão ao vivo para múltiplas plataformas com estabilidade e qualidade profissional.",
      icon: Radio,
    },
    {
      title: "Roteiro e Produção",
      desc: "Apoio criativo para estruturar seu conteúdo e tirar o melhor de cada convidado.",
      icon: FileText,
    },
    {
      title: "Podcast Móvel / Corporativo",
      desc: "Levamos toda nossa estrutura até sua empresa. Ideal para eventos e podcast corporativo.",
      icon: Building2,
      highlight: true,
    },
  ];

  return (
    <section id="services" className="py-24 bg-brand-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-purple-500 uppercase mb-4">Serviços</h2>
          <h3 className="text-4xl font-bold">Soluções Completas de Conteúdo</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl glass gradient-border group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${s.highlight ? "ring-2 ring-orange-500/50" : ""}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${s.highlight ? "bg-orange-500 text-white" : "bg-white/5 text-purple-500 group-hover:bg-purple-500 group-hover:text-white"}`}>
                <s.icon size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">{s.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Equipment = () => {
  const categories = [
    {
      name: "Câmeras e Lentes",
      icon: Camera,
      items: ["3x Sony FX30", "1x Sony A7R2", "Lente 24-70mm f/2.8", "Lente 70-200mm f/2.8", "Lentes 17-70mm e 35-150mm"],
      image: "https://i.postimg.cc/P5DwhQqF/camera_lente.png"
    },
    {
      name: "Iluminação",
      icon: Lightbulb,
      items: ["Aputure 600D", "3x Amaran 150c", "Amaran 300c", "6x Luzes 120W Bicolor", "8x Tripés Profissionais"],
      image: "https://i.postimg.cc/fRd9Zfb2/iluminac_a_o.png"
    },
    {
      name: "Áudio",
      icon: Mic,
      items: ["Gravador Zoom H6", "Kits Microfone Lapela", "4x Microfones Rode Podcast", "Mesa de Som Zoom", "Mesa de Corte Live"],
      image: "https://i.postimg.cc/g2hZdH0N/rode_podmic_usb_black_hero_3_quater_tilted_4000x4000_rgb_2000x2000_064a3d6.png"
    },
    {
      name: "Suporte",
      icon: ChevronRight,
      items: ["Tripés Hidráulicos", "Gimbals para Câmera/Celular", "Monopés", "Easyrig", "Monitores de Referência"],
      image: "https://i.postimg.cc/Qd7TsJMY/suporte_copiar.png"
    },
  ];

  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="equipment" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-4">Equipamentos</h2>
          <h3 className="text-4xl font-bold mb-8">Tecnologia de Cinema para o seu Podcast</h3>
          
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div 
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={`p-6 rounded-xl cursor-pointer transition-all ${activeCategory === i ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <cat.icon size={20} className={activeCategory === i ? "text-blue-500" : "text-white/40"} />
                    <span className={`font-semibold ${activeCategory === i ? "text-white" : "text-white/60"}`}>{cat.name}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${activeCategory === i ? "rotate-90 text-blue-500" : "text-white/20"}`} />
                </div>
                {activeCategory === i && (
                  <motion.ul 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pl-8 space-y-1"
                  >
                    {cat.items.map(item => (
                      <li key={item} className="text-sm text-white/50">• {item}</li>
                    ))}
                  </motion.ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-brand-surface p-8 border border-white/5">
            <img 
              key={activeCategory}
              src={categories[activeCategory].image} 
              alt={categories[activeCategory].name} 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          <div className="absolute top-12 right-12 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

// Automatic YouTube URL parser with robust fallbacks
function parseYoutubeUrl(url: string) {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  let videoId = "";
  let listId = "";

  // Extract list parameter if any
  try {
    const listMatch = cleanUrl.match(/[?&]list=([^#\&\?]+)/);
    if (listMatch) {
      listId = listMatch[1];
    }
  } catch (e) {}

  // A list of regexes to cover all common configurations:
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /live\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
    /v\/([a-zA-Z0-9_-]{11})/,
    /vi\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Fallback 1: If URL has youtube, but didn't match standard patterns, look for watch/v/embed where id is at the end or surrounded
  if (!videoId && (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be"))) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = cleanUrl.match(regExp);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  // Fallback 2: If we still don't have videoId, and cleanUrl matches a raw 11-char ID
  if (!videoId) {
    const fallbackMatch = cleanUrl.match(/^[a-zA-Z0-9_-]{11}$/);
    if (fallbackMatch) {
      videoId = cleanUrl;
    }
  }

  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1${listId ? `&list=${listId}` : ""}`;
    const src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return { videoId, embedUrl, src, listId };
  }
  
  return null;
}

interface PortfolioItemData {
  id?: string;
  src: string;
  title: string;
  videoUrl?: string;
  youtubeUrl?: string;
}

const News = ({ items: dbItems }: { items?: PortfolioItemData[] }) => {
  const [activeMedia, setActiveMedia] = useState<{ src: string; title: string; videoUrl?: string; youtubeUrl?: string } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const defaultItems = [
    {
      src: "https://img.youtube.com/vi/I974rqPXlVM/maxresdefault.jpg",
      title: "Mañez Talks",
      videoUrl: "https://www.youtube.com/embed/I974rqPXlVM?list=PLrGJcV096sHnDb2CnzLQHlBCHS84FBHMx&autoplay=1",
      youtubeUrl: "https://www.youtube.com/watch?v=I974rqPXlVM&list=PLrGJcV096sHnDb2CnzLQHlBCHS84FBHMx"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/IMG_2832.jpg",
      title: "Mañez Talks"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/IMG_2822.jpg",
      title: "Ação…"
    },
    {
      src: "https://img.youtube.com/vi/XgQgFFTf_LY/maxresdefault.jpg",
      title: "Evoluir ou Desistir - Erick Vieira - Vieira Cred - Grupo Vieira",
      videoUrl: "https://www.youtube.com/embed/XgQgFFTf_LY?autoplay=1",
      youtubeUrl: "https://www.youtube.com/watch?v=XgQgFFTf_LY&t=1s"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/IMG_0039.jpg",
      title: "Estúdio Paleta"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/IMG_1652.jpg",
      title: "Pacheco & Lima"
    },
    {
      src: "https://img.youtube.com/vi/8rH21rQDWro/maxresdefault.jpg",
      title: "PACHECO LIMA ADVOGADOS",
      videoUrl: "https://www.youtube.com/embed/8rH21rQDWro?autoplay=1",
      youtubeUrl: "https://www.youtube.com/watch?v=8rH21rQDWro"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/DSC09216.jpg",
      title: "Nexus Cast"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/DSC08346.jpg",
      title: "I9TV"
    },
    {
      src: "https://img.youtube.com/vi/bLIWzZDu3Gc/maxresdefault.jpg",
      title: "Paulo Roca - Nexus Cast",
      videoUrl: "https://www.youtube.com/embed/bLIWzZDu3Gc?autoplay=1",
      youtubeUrl: "https://www.youtube.com/watch?v=bLIWzZDu3Gc&t=2430s"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/DSC5377.jpg",
      title: "Nexus Cast"
    },
    {
      src: "https://pod.paletaestudios.com.br/assets/img/_DSC0890.jpg",
      title: "Mañez Talks"
    }
  ];

  const items = dbItems && dbItems.length > 0 ? dbItems : defaultItems;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="news" className="relative py-24 bg-brand-surface/20 overflow-hidden">
      <style>{`
        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.03);
          filter: brightness(1.1);
        }
      `}</style>
      
      <div className="absolute inset-0 max-md:hidden top-[150px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <p className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-4">
          Portfólio de Gravações
        </p>
        <h3 className="z-20 mx-auto max-w-3xl justify-center bg-gradient-to-r from-white via-white/80 to-white bg-clip-text py-3 text-center text-4xl text-transparent md:text-6xl font-bold font-sans tracking-tight">
          Nossa Galeria de <span className="text-orange-500">Histórias</span>
        </h3>
        <p className="text-white/50 max-w-2xl mx-auto text-lg mt-2">
          Grandes nomes e conversas inesquecíveis. O Estúdio Paleta é a casa dos criadores de conteúdo.
        </p>
      </div>

      {/* Interactive horizontal scroll slider */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 group/arrows">
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-orange-500 hover:border-orange-500 transition-all cursor-pointer shadow-lg hover:scale-105"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-1 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-orange-500 hover:border-orange-500 transition-all cursor-pointer shadow-lg hover:scale-105"
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scrollable Track Container */}
        <div className="scroll-container w-full overflow-hidden font-sans">
          <div 
            ref={scrollContainerRef}
            className="scrollbar-none flex gap-5 overflow-x-auto py-4 scroll-smooth snap-x snap-mandatory"
          >
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="image-item flex-shrink-0 w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group cursor-pointer snap-start"
                onClick={() => setActiveMedia(item)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const currentSrc = e.currentTarget.src;
                    if (currentSrc.includes("maxresdefault.jpg")) {
                      e.currentTarget.src = currentSrc.replace("maxresdefault.jpg", "hqdefault.jpg");
                    } else if (currentSrc.includes("hqdefault.jpg")) {
                      e.currentTarget.src = currentSrc.replace("hqdefault.jpg", "0.jpg");
                    }
                  }}
                />
                
                {/* Overlay play indicator for video items */}
                {item.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-500/95 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white transform group-hover:scale-110 transition-transform duration-300">
                      <Play size={24} className="fill-current ml-1" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
                      {item.videoUrl ? "Assistir Vídeo" : "Gravação Realizada"}
                    </span>
                  </div>
                  <p className="text-white text-base md:text-xl font-bold truncate">{item.title}</p>
                </div>
                
                {/* Always-on minimal tag at the bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-xs text-white/90 font-medium font-sans truncate">{item.title}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.videoUrl ? 'bg-red-500' : 'bg-orange-500'} animate-pulse flex-shrink-0 ml-1`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center mt-12 z-20 relative">
        <a 
          href="#contact" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02]"
        >
          Ver Todos os Episódios <ChevronRight size={20} />
        </a>
      </div>

      {/* Lightbox / Media Player Overlay Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-brand-surface rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col font-sans"
            >
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                onClick={() => setActiveMedia(null)}
              >
                <X size={20} />
              </button>

              <div className="p-2 md:p-4">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center relative">
                  {activeMedia.videoUrl ? (
                    <iframe
                      src={activeMedia.videoUrl}
                      title={activeMedia.title}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={activeMedia.src}
                      alt={activeMedia.title}
                      className="max-h-[70vh] w-full h-full object-contain animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-bold">
                      {activeMedia.videoUrl ? "EPISÓDIO NO AR" : "FOTO DE PORTFÓLIO"}
                    </span>
                  </div>
                  <h4 className="text-white text-lg md:text-xl font-bold">{activeMedia.title}</h4>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveMedia(null)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                  {activeMedia.videoUrl && (
                    <a
                      href={activeMedia.youtubeUrl || "https://www.youtube.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      Ver no YouTube <ChevronRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Locação (Sem Operador)",
      price: "300",
      period: "hora",
      features: ["Uso total do espaço", "Equipamentos inclusos", "Ambiente climatizado", "Café e recepção"],
      cta: "Solicitar Orçamento",
      color: "blue",
    },
    {
      name: "Locação (Com Operador)",
      price: "600",
      period: "hora",
      features: ["Tudo do plano anterior", "Operador de áudio e vídeo", "Monitoramento em tempo real", "Backup imediato"],
      cta: "Solicitar Orçamento",
      popular: true,
      color: "orange",
    },
    {
      name: "Projeto Corporativo",
      price: "1600",
      period: "episódio",
      features: ["Estrutura na sua empresa", "Equipe técnica completa", "Edição e pós-produção", "Distribuição em plataformas"],
      cta: "Falar com Consultor",
      color: "purple",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-brand-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-green-500 uppercase mb-4">Investimento</h2>
          <h3 className="text-4xl font-bold">Planos Transparentes</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-3xl glass flex flex-col ${p.popular ? "ring-2 ring-orange-500 md:scale-105 z-10" : ""}`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Mais Popular
                </div>
              )}
              <h4 className="text-lg font-semibold mb-6 text-white/60">{p.name}</h4>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-sm font-medium text-white/40">R$</span>
                <span className="text-5xl font-bold">{p.price}</span>
                <span className="text-sm text-white/40">/{p.period}</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 size={16} className="text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <a 
                href="https://api.whatsapp.com/send/?phone=5511961959349&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl font-bold transition-all text-center ${p.popular ? "bg-orange-500 hover:bg-orange-600" : "bg-white/5 hover:bg-white/10"}`}
              >
                {p.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Vamos agendar uma visita sem compromisso?</h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Conheça pessoalmente o estúdio mais instagramável de São Paulo e descubra como podemos elevar seu conteúdo.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href="https://api.whatsapp.com/send/?phone=5511961959349&text&type=phone_number&app_absent=0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                <Phone size={24} /> Agende sua Visita
              </a>
              <a href="mailto:contato@paletaestudios.com.br" className="text-white font-semibold hover:underline">
                Ou envie um e-mail
              </a>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Onde fica o estúdio de podcast Paleta Estúdios?",
      answer: "O Paleta Estúdios está localizado no Largo do Paissandú, 72, no Centro Histórico de São Paulo, SP. É um ponto estratégico com fácil acesso por transporte público e toda a infraestrutura do centro da cidade."
    },
    {
      question: "Quais serviços o Paleta Estúdios oferece?",
      answer: "Oferecemos aluguel de estúdio para podcast, produção de podcast corporativo, gravação de lives profissionais, podcast móvel (levamos o estúdio até você) e edição completa de cortes para redes sociais como Reels, TikTok e YouTube Shorts."
    },
    {
      question: "Como funciona o aluguel de estúdio de podcast?",
      answer: "O aluguel pode ser feito por hora ou por pacotes de episódios. Incluímos toda a estrutura técnica: microfones Shure, câmeras 4K, iluminação profissional e um técnico para acompanhar a gravação."
    },
    {
      question: "Vocês fazem podcast corporativo?",
      answer: "Sim! Somos especialistas em podcast corporativo em São Paulo. Ajudamos empresas a criarem autoridade através de conteúdo em áudio e vídeo de alta qualidade, cuidando de toda a parte técnica e de edição."
    },
    {
      question: "O estúdio é climatizado e tem tratamento acústico?",
      answer: "Sim, nosso estúdio conta com isolamento acústico profissional e ar-condicionado silencioso para garantir que sua gravação tenha a melhor qualidade sonora possível, sem ruídos externos."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-brand-surface/20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-4">Dúvidas Frequentes</h2>
          <h3 className="text-4xl font-bold">Perguntas Comuns</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="rounded-2xl glass border border-white/5 overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-lg pr-8">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-orange-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-white/60 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Fernando Lima",
      role: "Host do Nexus Cast",
      text: "O Paleta é sem dúvidas o melhor estúdio de podcasts de SP. Estrutura impecável, câmeras 4K que dão uma qualidade cinematográfica e o áudio é cristalino. A equipe é super atenciosa!",
      rating: 5,
      date: "Há 1 mês",
      initial: "FL",
      color: "bg-blue-600/30 text-blue-400 border border-blue-500/20"
    },
    {
      name: "Erick Vieira",
      role: "Diretor da Vieira Cred",
      text: "Excelente atendimento e equipamentos de ponta. Gravamos nossa temporada inteira lá e o suporte na edição e nos cortes rápidos para as redes sociais foi fantástico. Super indico!",
      rating: 5,
      date: "Há 2 semanas",
      initial: "EV",
      color: "bg-orange-600/30 text-orange-400 border border-orange-500/20"
    },
    {
      name: "Pacheco & Lima Advogados",
      role: "Podcast Jurídico",
      text: "Ambiente super aconchegante, climatizado e muito profissional. O estúdio móvel também salvou a nossa convenção corporativa. Parabéns pelo capricho em cada detalhe!",
      rating: 5,
      date: "Há 3 semanas",
      initial: "PL",
      color: "bg-purple-600/30 text-purple-400 border border-purple-500/20"
    },
    {
      name: "Paulo Roca",
      role: "Navegador de Negócios Cast",
      text: "Sempre fomos muito bem recebidos no Paleta. Os cortes saem com legendas perfeitas, dinâmica ágil e ajudaram muito nosso canal a viralizar. Preço justo pelo nível de entrega.",
      rating: 5,
      date: "Há 2 meses",
      initial: "PR",
      color: "bg-emerald-600/30 text-emerald-400 border border-emerald-500/20"
    },
    {
      name: "Mariana Salles",
      role: "Host do Mañez Talks",
      text: "Localização maravilhosa no centro histórico, fácil de chegar. Estúdio com acústica perfeita e iluminação RGB que se adapta totalmente à identidade visual da nossa marca.",
      rating: 5,
      date: "Há 4 semanas",
      initial: "MS",
      color: "bg-pink-600/30 text-pink-400 border border-pink-500/20"
    },
    {
      name: "Renata Abreu",
      role: "Produtora I9TV",
      text: "Fazer live com eles é zero preocupação. A transmissão é mega estável, o switcher faz cortes em tempo real perfeitos, entregando um produto final de qualidade altíssima pronto pra distribuir.",
      rating: 5,
      date: "Há 3 dias",
      initial: "RA",
      color: "bg-yellow-600/30 text-yellow-400 border border-yellow-500/20"
    }
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Decorative background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header container */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-4">Depoimentos</h2>
            <h3 className="text-4xl font-bold mb-4">Quem Grava Reconhece</h3>
            <p className="text-white/60 text-lg">
              Veja o que os maiores podcasters, empresários e produtores de conteúdo dizem sobre o Paleta Estúdios nas avaliações oficiais do Google.
            </p>
          </div>

          {/* Google rating badge */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shrink-0 lg:max-w-sm">
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                {/* SVG Google G Letter Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-bold text-white text-md">Google Reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-white">5.0</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 mt-1">Baseado em +120 avaliações de clientes</p>
            </div>
            <div className="h-px w-full sm:h-12 sm:w-px bg-white/10"></div>
            <a
              href="https://maps.google.com/?cid=12143003450912140410" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white uppercase tracking-wider transition-all shadow-lg hover:scale-[1.03] text-center w-full sm:w-auto shrink-0"
            >
              Avaliar no Google
            </a>
          </div>
        </div>

        {/* Bento/Modern Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="p-6 md:p-8 rounded-2xl glass border border-white/5 bg-brand-surface/10 hover:bg-brand-surface/25 hover:border-white/10 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Stars and Date */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-white/30">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-white/80 leading-relaxed text-sm md:text-md italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-md ${rev.color}`}>
                  {rev.initial}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                    {rev.name}
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 inline" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </h4>
                  <p className="text-xs text-white/40 truncate">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Map = () => {
  return (
    <section className="py-24 bg-brand-surface/20">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-4">Localização</h2>
        <h3 className="text-4xl font-bold mb-6">No Coração de São Paulo</h3>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Estamos localizados em um ponto estratégico do centro histórico, com fácil acesso e toda a infraestrutura que você precisa.
        </p>
      </div>
      
      <div className="w-full h-[500px] md:h-[600px] border-y border-white/5 shadow-2xl">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.653494701297!2d-46.63891462467026!3d-23.54495147881144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5852979a4991%3A0x89254d39999092d!2sLargo%20do%20Paissand%C3%BA%2C%2072%20-%20Centro%20Hist%C3%B3rico%20de%20S%C3%A3o%20Paulo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001037-010!5e0!3m2!1spt-BR!2sbr!4v1709593200000!5m2!1spt-BR!2sbr" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => {
  return (
    <footer className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 shrink-0 relative">
              <img 
                src="https://i.postimg.cc/MpxNwd63/P-logo.png" 
                alt="Logo" 
                className="absolute inset-0 w-full h-full object-contain" 
              />
            </div>
            <span className="text-lg font-bold tracking-tighter uppercase text-white">Paleta Estúdios</span>
          </div>
          <p className="text-white/40 max-w-sm mb-8">
            O melhor estúdio de podcast e produção de conteúdo em São Paulo. Especialistas em podcast corporativo, lives e podcast móvel.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        <div>
          <h5 className="font-bold mb-6">Contato</h5>
          <ul className="space-y-4 text-sm text-white/50">
            <li className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 shrink-0" /> Largo do Paissandú, 72 - Centro Histórico, São Paulo - SP</li>
            <li className="flex items-center gap-3">
              <a href="https://api.whatsapp.com/send/?phone=5511961959349&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={18} className="text-orange-500 shrink-0" /> 11 96195-9349
              </a>
            </li>
            <li className="flex items-center gap-3"><Mail size={18} className="text-orange-500 shrink-0" /> contato@paletaestudios.com.br</li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-6">Navegação</h5>
          <ul className="space-y-4 text-sm text-white/50">
            <li><a href="#home" className="hover:text-white transition-colors">Início</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">Sobre</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Serviços</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
        <div>© 2024 Paleta Estúdios. Todos os direitos reservados.</div>
        <button 
          onClick={onAdminClick}
          className="hover:text-[#f27d26] text-white/40 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-xs"
        >
          <Settings size={12} /> Painel Administrativo
        </button>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<"public" | "admin">("public");

  // Load Firestore data in App state to distribute to widgets dynamically
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [dnaImages, setDnaImages] = useState<string[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemData[]>([]);

  useEffect(() => {
    // 1. Fetch Banners
    const unsubBanners = onSnapshot(
      query(collection(db, "banner_images"), orderBy("order", "asc")),
      (snapshot) => {
        const urls = snapshot.docs.map(doc => doc.data().url as string).filter(Boolean);
        setBannerImages(urls);
      },
      (error) => {
        console.warn("Could not load banners from Firestore. Fallback will be served.", error);
      }
    );

    // 2. Fetch DNA Images
    const unsubDNA = onSnapshot(
      query(collection(db, "nosso_dna_images"), orderBy("order", "asc")),
      (snapshot) => {
        const urls = snapshot.docs.map(doc => doc.data().url as string).filter(Boolean);
        setDnaImages(urls);
      },
      (error) => {
        console.warn("Could not load DNA images from Firestore. Fallback will be served.", error);
      }
    );

    // 3. Fetch Portfolio Slides
    const unsubPort = onSnapshot(
      query(collection(db, "portfolio_items"), orderBy("order", "asc")),
      (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          let src = data.src || "";
          let videoUrl = data.videoUrl || undefined;
          let youtubeUrl = data.youtubeUrl || undefined;

          // Check if there is ANY indication that this item is a YouTube video
          const isVideoUrlYoutube = !!(videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")));
          const isYoutubeUrlYoutube = !!(youtubeUrl && (youtubeUrl.includes("youtube.com") || youtubeUrl.includes("youtu.be")));
          const isSrcYoutube = !!(src && (src.includes("youtube.com") || src.includes("youtu.be")));

          if (isVideoUrlYoutube || isYoutubeUrlYoutube || isSrcYoutube) {
            // Find the best link of the candidate URLs
            const candidateUrl = youtubeUrl || videoUrl || src;
            const parsed = parseYoutubeUrl(candidateUrl);
            if (parsed) {
              src = parsed.src;
              videoUrl = parsed.embedUrl;
              youtubeUrl = candidateUrl;
            }
          }

          return {
            id: doc.id,
            src: src,
            title: data.title || "",
            videoUrl: videoUrl,
            youtubeUrl: youtubeUrl,
          };
        });
        setPortfolioItems(items);
      },
      (error) => {
        console.warn("Could not load portfolio from Firestore. Fallback will be served.", error);
      }
    );

    return () => {
      unsubBanners();
      unsubDNA();
      unsubPort();
    };
  }, []);

  // Jump to top when toggling views for pristine transition feel
  const handleToggleView = (newView: "public" | "admin") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView(newView);
  };

  if (view === "admin") {
    return <AdminPanel onBack={() => handleToggleView("public")} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero images={bannerImages} />
      <About images={dnaImages} />
      <Services />
      <Equipment />
      <News items={portfolioItems} />
      <Pricing />
      <FAQ />
      <Contact />
      <Testimonials />
      <Map />
      <Footer onAdminClick={() => handleToggleView("admin")} />
    </div>
  );
}

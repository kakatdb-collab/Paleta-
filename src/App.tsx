import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, 
  Video, 
  Scissors, 
  Radio, 
  FileText, 
  Building2, 
  Camera, 
  Lightbulb, 
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";

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

const Hero = () => {
  const images = [
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

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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

const About = () => {
  const images = [
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

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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

const News = () => {
  const newsImages = [
    "https://i.postimg.cc/620w3b17/DSC08346.jpg",
    "https://i.postimg.cc/XG83J1Dr/DSC09126.jpg",
    "https://i.postimg.cc/0MfxQXHk/DSC09194.jpg",
    "https://i.postimg.cc/5Y310Kk9/DSC09216.jpg",
    "https://i.postimg.cc/VrR16ZHd/DSC5257.jpg",
    "https://i.postimg.cc/dkBv1NS3/DSC5289.jpg",
    "https://i.postimg.cc/475Zd2Fk/DSC5338.jpg",
    "https://i.postimg.cc/ZBcZRsDz/DSC5377.jpg",
    "https://i.postimg.cc/ZBcZRsDZ/DSC5384.jpg"
  ];

  const duplicatedImages = [...newsImages, ...newsImages];

  return (
    <section id="news" className="py-24 bg-brand-surface/20">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center md:text-left">
          <h2 className="text-sm font-bold tracking-widest text-purple-500 uppercase mb-4">Portfólio</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Podcasts que já passaram por aqui</h3>
          <p className="text-white/50 max-w-2xl text-lg">
            Grandes nomes e conversas inesquecíveis. O Estúdio Paleta é a casa dos criadores de conteúdo.
          </p>
        </div>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div 
          className="flex gap-4 md:gap-8 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {duplicatedImages.map((img, i) => (
            <div 
              key={i}
              className="relative w-[300px] md:w-[600px] aspect-video rounded-3xl overflow-hidden flex-shrink-0 shadow-2xl"
            >
              <img 
                src={img} 
                alt={`Podcast ${i + 1}`} 
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-[1px] bg-purple-500"></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold">Gravação Realizada</span>
                </div>
                <p className="text-white text-xl md:text-2xl font-bold">Paleta Estúdios</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
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

const Footer = () => {
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
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/20">
        © 2024 Paleta Estúdios. Todos os direitos reservados.
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Equipment />
      <News />
      <Pricing />
      <FAQ />
      <Contact />
      <Map />
      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Save, 
  LogOut, 
  ArrowLeft,
  Settings,
  Sparkles,
  Link as LinkIcon,
  Video as VideoIcon,
  Image as ImageIcon,
  Key,
  Database,
  ArrowUp,
  ArrowDown,
  Edit,
  Check,
  X,
  Upload
} from "lucide-react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";

// Automatic YouTube URL parser with robust fallbacks
function parseYoutubeUrl(url: string) {
  let videoId = "";
  let listId = "";

  try {
    const listMatch = url.match(/[?&]list=([^#\&\?]+)/);
    if (listMatch) {
      listId = listMatch[1];
    }
  } catch (e) {}

  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts[1]) {
      videoId = parts[1].split(/[?#]/)[0];
    }
  } else if (url.includes("embed/")) {
    const parts = url.split("embed/");
    if (parts[1]) {
      videoId = parts[1].split(/[?#]/)[0];
    }
  } else {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
  }

  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1${listId ? `&list=${listId}` : ""}`;
    const src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return { videoId, embedUrl, src };
  }
  return null;
}

// Compress, resize, and convert client-selected files to optimized Base64 JPEG strings
function compressAndResizeImage(file: File, maxWidth: number = 1280, maxHeight: number = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compressed JPEG at 0.8 quality is highly efficient and guaranteed under 1MB Firestore limit
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

const BANNER_DEFAULTS = [
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

const DNA_DEFAULTS = [
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

const PORTFOLIO_DEFAULTS = [
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

interface BannerItem {
  id: string;
  url: string;
  order: number;
}

interface DNAItem {
  id: string;
  url: string;
  order: number;
}

interface PortfolioItem {
  id: string;
  src: string;
  title: string;
  videoUrl?: string;
  youtubeUrl?: string;
  order: number;
}

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Firestore collection states
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [dnaImages, setDnaImages] = useState<DNAItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Selected tab
  const [activeTab, setActiveTab] = useState<"banner" | "dna" | "portfolio">("banner");

  // Inputs for adding content
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [newDnaUrl, setNewDnaUrl] = useState("");

  // Native File Upload states and previews
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [dnaFile, setDnaFile] = useState<File | null>(null);
  const [dnaPreview, setDnaPreview] = useState<string | null>(null);

  const [portFile, setPortFile] = useState<File | null>(null);
  const [portPreview, setPortPreview] = useState<string | null>(null);
  
  // Inputs for portfolio item
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortType, setNewPortType] = useState<"photo" | "video">("photo");
  const [newPortMediaUrl, setNewPortMediaUrl] = useState(""); /_ Photo URL or YouTube Link _/

  // Editing states
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [editPortTitle, setEditPortTitle] = useState("");
  const [editPortSrc, setEditPortSrc] = useState("");
  const [editPortYoutube, setEditPortYoutube] = useState("");

  // Track if DB is totally empty to offer template seeding
  const [isDbEmpty, setIsDbEmpty] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // Listen to Firestore events only if authorized/loaded
  useEffect(() => {
    if (!user || user.email !== "kakatdb@gmail.com") return;

    const unsubBanners = onSnapshot(
      query(collection(db, "banner_images"), orderBy("order", "asc")),
      (snapshot) => {
        const list: BannerItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<BannerItem, "id">)
        }));
        setBanners(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "banner_images")
    );

    const unsubDNA = onSnapshot(
      query(collection(db, "nosso_dna_images"), orderBy("order", "asc")),
      (snapshot) => {
        const list: DNAItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<DNAItem, "id">)
        }));
        setDnaImages(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "nosso_dna_images")
    );

    const unsubPort = onSnapshot(
      query(collection(db, "portfolio_items"), orderBy("order", "asc")),
      (snapshot) => {
        const list: PortfolioItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<PortfolioItem, "id">)
        }));
        setPortfolio(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "portfolio_items")
    );

    return () => {
      unsubBanners();
      unsubDNA();
      unsubPort();
    };
  }, [user]);

  // Check if collections are empty to display the Seeding assistant
  useEffect(() => {
    if (!user || user.email !== "kakatdb@gmail.com") return;
    
    const checkDbStatus = async () => {
      try {
        const [bSnap, dSnap, pSnap] = await Promise.all([
          getDocs(collection(db, "banner_images")),
          getDocs(collection(db, "nosso_dna_images")),
          getDocs(collection(db, "portfolio_items"))
        ]);
        setIsDbEmpty(bSnap.empty && dSnap.empty && pSnap.empty);
      } catch (err) {
        console.warn("DB check state error:", err);
      }
    };
    checkDbStatus();
  }, [user, banners, dnaImages, portfolio]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsActionLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showFeedback("success", "Login realizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      let errorMsg = "Ocorreu um erro ao fazer login. Verifique as credenciais.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMsg = "Login ou senha incorretos.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "E-mail inválido.";
      }
      setAuthError(errorMsg + " Se novos usuários de login/senha não funcionarem, certifique-se de ativar o Provedor 'E-mail/Senha' no Console do Firebase.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setIsActionLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
      showFeedback("success", "Administrador logado via Google!");
    } catch (error: any) {
      console.error(error);
      setAuthError("Erro na autenticação do Google. Verifique.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showFeedback("success", "Sessão encerrada.");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Individual & Collective Seeding Tools ---
  const handleSeedBannersOnly = async () => {
    setIsActionLoading(true);
    try {
      showFeedback("success", "Copiando imagens de banner padrão para o seu banco...");
      for (let i = 0; i < BANNER_DEFAULTS.length; i++) {
        await addDoc(collection(db, "banner_images"), {
          url: BANNER_DEFAULTS[i],
          order: i,
          createdAt: serverTimestamp()
        });
      }
      showFeedback("success", "Fotos do Banner Principal importadas com sucesso! Você já pode visualizá-las e removê-las aqui.");
    } catch (e: any) {
      console.error(e);
      showFeedback("error", "Erro ao importar banners de modelo: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSeedDnaOnly = async () => {
    setIsActionLoading(true);
    try {
      showFeedback("success", "Copiando imagens da seção Nosso DNA de modelo...");
      for (let i = 0; i < DNA_DEFAULTS.length; i++) {
        await addDoc(collection(db, "nosso_dna_images"), {
          url: DNA_DEFAULTS[i],
          order: i,
          createdAt: serverTimestamp()
        });
      }
      showFeedback("success", "Imagens Nosso DNA importadas com sucesso! Agora você pode alterá-las.");
    } catch (e: any) {
      console.error(e);
      showFeedback("error", "Erro ao importar de modelo: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSeedPortfolioOnly = async () => {
    setIsActionLoading(true);
    try {
      showFeedback("success", "Importando episódios e gravações padrão...");
      for (let i = 0; i < PORTFOLIO_DEFAULTS.length; i++) {
        await addDoc(collection(db, "portfolio_items"), {
          src: PORTFOLIO_DEFAULTS[i].src,
          title: PORTFOLIO_DEFAULTS[i].title,
          videoUrl: PORTFOLIO_DEFAULTS[i].videoUrl || "",
          youtubeUrl: PORTFOLIO_DEFAULTS[i].youtubeUrl || "",
          order: i,
          createdAt: serverTimestamp()
        });
      }
      showFeedback("success", "Portfólio de gravações padrão importado com sucesso!");
    } catch (e: any) {
      console.error(e);
      showFeedback("error", "Erro ao importar portfólio: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsActionLoading(true);
    try {
      showFeedback("success", "Inicializando todas as fotos e mídias de modelo...");
      
      // Upload banner defaults
      for (let i = 0; i < BANNER_DEFAULTS.length; i++) {
        await addDoc(collection(db, "banner_images"), {
          url: BANNER_DEFAULTS[i],
          order: i,
          createdAt: serverTimestamp()
        });
      }

      // Upload DNA defaults
      for (let i = 0; i < DNA_DEFAULTS.length; i++) {
        await addDoc(collection(db, "nosso_dna_images"), {
          url: DNA_DEFAULTS[i],
          order: i,
          createdAt: serverTimestamp()
        });
      }

      // Upload portfolio defaults
      for (let i = 0; i < PORTFOLIO_DEFAULTS.length; i++) {
        await addDoc(collection(db, "portfolio_items"), {
          src: PORTFOLIO_DEFAULTS[i].src,
          title: PORTFOLIO_DEFAULTS[i].title,
          videoUrl: PORTFOLIO_DEFAULTS[i].videoUrl || "",
          youtubeUrl: PORTFOLIO_DEFAULTS[i].youtubeUrl || "",
          order: i,
          createdAt: serverTimestamp()
        });
      }

      setIsDbEmpty(false);
      showFeedback("success", "Banco de dados inicializado com sucesso com todos os slides e fotos de modelo!");
    } catch (e: any) {
      console.error(e);
      showFeedback("error", "Erro ao povoar banco de dados. " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- Banner operations ---

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setNewBannerUrl(""); // Cleans text field to avoid confusion
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerUrl.trim() && !bannerFile) {
      showFeedback("error", "Por favor, selecione um arquivo de imagem ou cole uma URL.");
      return;
    }
    setIsActionLoading(true);

    try {
      let finalUrl = newBannerUrl.trim();
      if (bannerFile) {
        showFeedback("success", "Comprimindo e enviando foto do banner...");
        finalUrl = await compressAndResizeImage(bannerFile);
      }

      const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order)) + 1 : 0;
      await addDoc(collection(db, "banner_images"), {
        url: finalUrl,
        order: nextOrder,
        createdAt: serverTimestamp()
      });
      setNewBannerUrl("");
      setBannerFile(null);
      setBannerPreview(null);
      showFeedback("success", "Foto adicionada ao banner principal com sucesso!");
    } catch (error: any) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, "banner_images");
      showFeedback("error", "Erro ao salvar imagem.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta foto do Banner principal?")) return;
    setIsActionLoading(true);
    try {
      await deleteDoc(doc(db, "banner_images", id));
      showFeedback("success", "Foto removida com sucesso do banner!");
    } catch (error: any) {
      console.error(error);
      handleFirestoreError(error, OperationType.DELETE, `banner_images/${id}`);
      showFeedback("error", "Erro ao excluir imagem do banner.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMoveBanner = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;

    setIsActionLoading(true);
    try {
      const itemA = banners[index];
      const itemB = banners[targetIdx];
      
      await Promise.all([
        updateDoc(doc(db, "banner_images", itemA.id), { order: itemB.order }),
        updateDoc(doc(db, "banner_images", itemB.id), { order: itemA.order })
      ]);
    } catch (error) {
      console.error(error);
      showFeedback("error", "Erro ao reordenar banners.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- Nosso DNA operations ---

  const handleDnaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDnaFile(file);
      setDnaPreview(URL.createObjectURL(file));
      setNewDnaUrl(""); // Cleans text field to avoid confusion
    }
  };

  const handleAddDna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDnaUrl.trim() && !dnaFile) {
      showFeedback("error", "Por favor, selecione um arquivo de imagem ou cole uma URL.");
      return;
    }
    setIsActionLoading(true);

    try {
      let finalUrl = newDnaUrl.trim();
      if (dnaFile) {
        showFeedback("success", "Comprimindo e enviando foto DNA...");
        finalUrl = await compressAndResizeImage(dnaFile);
      }

      const nextOrder = dnaImages.length > 0 ? Math.max(...dnaImages.map(d => d.order)) + 1 : 0;
      await addDoc(collection(db, "nosso_dna_images"), {
        url: finalUrl,
        order: nextOrder,
        createdAt: serverTimestamp()
      });
      setNewDnaUrl("");
      setDnaFile(null);
      setDnaPreview(null);
      showFeedback("success", "Foto adicionada à seção Nosso DNA!");
    } catch (error: any) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, "nosso_dna_images");
      showFeedback("error", "Erro ao salvar imagem.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteDna = async (id: string) => {
    if (!confirm("Deseja mesmo remover esta foto de Nosso DNA?")) return;
    setIsActionLoading(true);
    try {
      await deleteDoc(doc(db, "nosso_dna_images", id));
      showFeedback("success", "Foto removida do DNA.");
    } catch (error: any) {
      console.error(error);
      handleFirestoreError(error, OperationType.DELETE, `nosso_dna_images/${id}`);
      showFeedback("error", "Erro ao deletar.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMoveDna = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dnaImages.length) return;

    setIsActionLoading(true);
    try {
      const itemA = dnaImages[index];
      const itemB = dnaImages[targetIdx];
      
      await Promise.all([
        updateDoc(doc(db, "nosso_dna_images", itemA.id), { order: itemB.order }),
        updateDoc(doc(db, "nosso_dna_images", itemB.id), { order: itemA.order })
      ]);
    } catch (error) {
      console.error(error);
      showFeedback("error", "Erro ao reordenar.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- Portfolio operations ---

  const handlePortFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPortFile(file);
      setPortPreview(URL.createObjectURL(file));
      setNewPortMediaUrl(""); // Cleans text field to avoid confusion
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim()) {
      showFeedback("error", "Preencha o título do slide.");
      return;
    }
    if (newPortType === "photo" && !newPortMediaUrl.trim() && !portFile) {
      showFeedback("error", "Por favor, envie um arquivo de foto ou preencha o link da imagem.");
      return;
    }
    if (newPortType === "video" && !newPortMediaUrl.trim()) {
      showFeedback("error", "Preencha o link do vídeo do YouTube.");
      return;
    }
    setIsActionLoading(true);

    try {
      const nextOrder = portfolio.length > 0 ? Math.max(...portfolio.map(p => p.order)) + 1 : 0;
      
      let payload: Omit<PortfolioItem, "id"> = {
        title: newPortTitle.trim(),
        src: newPortMediaUrl.trim(),
        order: nextOrder
      };

      if (newPortType === "photo" && portFile) {
        showFeedback("success", "Comprimindo e enviando foto de portfólio...");
        const finalUrl = await compressAndResizeImage(portFile);
        payload.src = finalUrl;
      }

      if (newPortType === "video") {
        // Automatically translate regular youtube link to cover image and embed link
        const parsed = parseYoutubeUrl(newPortMediaUrl);
        if (parsed) {
          payload.src = parsed.src;
          payload.videoUrl = parsed.embedUrl;
          payload.youtubeUrl = newPortMediaUrl.trim();
        } else {
          payload.videoUrl = newPortMediaUrl.trim(); // fallback if embed provided manually
        }
      }

      await addDoc(collection(db, "portfolio_items"), {
        ...payload,
        createdAt: serverTimestamp()
      });

      setNewPortTitle("");
      setNewPortMediaUrl("");
      setPortFile(null);
      setPortPreview(null);
      showFeedback("success", "Item adicionado ao Portfólio de Gravações!");
    } catch (error: any) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, "portfolio_items");
      showFeedback("error", "Erro ao incluir no portfólio.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Excluir este slide de Portfólio permanentemente?")) return;
    setIsActionLoading(true);
    try {
      await deleteDoc(doc(db, "portfolio_items", id));
      showFeedback("success", "Slide removido.");
    } catch (error: any) {
      console.error(error);
      handleFirestoreError(error, OperationType.DELETE, `portfolio_items/${id}`);
      showFeedback("error", "Erro ao deletar.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMovePortfolio = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= portfolio.length) return;

    setIsActionLoading(true);
    try {
      const itemA = portfolio[index];
      const itemB = portfolio[targetIdx];
      
      await Promise.all([
        updateDoc(doc(db, "portfolio_items", itemA.id), { order: itemB.order }),
        updateDoc(doc(db, "portfolio_items", itemB.id), { order: itemA.order })
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const startEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setEditPortTitle(item.title);
    setEditPortSrc(item.src);
    setEditPortYoutube(item.youtubeUrl || item.videoUrl || "");
  };

  const saveEditPortfolio = async (id: string) => {
    if (!editPortTitle.trim() || !editPortSrc.trim()) return;
    setIsActionLoading(true);
    try {
      let isVideo = !!editPortYoutube;
      const parsed = isVideo ? parseYoutubeUrl(editPortYoutube) : null;
      
      const payload: Partial<PortfolioItem> = {
        title: editPortTitle.trim(),
        src: parsed ? parsed.src : editPortSrc.trim()
      };

      if (isVideo) {
        if (parsed) {
          payload.videoUrl = parsed.embedUrl;
          payload.youtubeUrl = editPortYoutube.trim();
        } else {
          payload.videoUrl = editPortYoutube.trim();
        }
      } else {
        // Remove video references
        payload.videoUrl = "";
        payload.youtubeUrl = "";
      }

      await updateDoc(doc(db, "portfolio_items", id), payload);
      setEditingPortfolioId(null);
      showFeedback("success", "Slide editado com sucesso!");
    } catch (error: any) {
      console.error(error);
      showFeedback("error", "Falha ao editar slide.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- Render Login ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-sans tracking-widest uppercase">Paleta Estúdios • Carregando...</p>
        </div>
      </div>
    );
  }

  const isAuthorized = user && user.email === "kakatdb@gmail.com";

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full"></div>

        <div className="w-full max-w-md bg-brand-surface border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 font-sans glass">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative glow-orange">
              <img src="https://i.postimg.cc/MpxNwd63/P-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-center mb-2">
            Painel Administrativo
          </h2>
          <p className="text-white/50 text-sm text-center mb-8">
            Faça login para gerenciar as imagens e o portfólio do site.
          </p>

          {feedback && (
            <div className={`p-4 rounded-xl mb-6 text-sm text-center ${feedback.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
              {feedback.message}
            </div>
          )}

          {authError && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl mb-6 text-xs leading-relaxed">
              {authError}
            </div>
          )}

          {user ? (
            <div className="text-center mb-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-sm mb-6 text-amber-300">
                <p className="font-semibold mb-1">Acesso Restrito</p>
                <p className="text-xs text-white/50">Logado como: <span className="text-white font-mono">{user.email}</span></p>
                <p className="text-xs text-white/60 mt-2">Apenas o e-mail de administrador <span className="text-white font-bold">kakatdb@gmail.com</span> pode acessar este painel.</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 py-3 rounded-xl font-bold transition-all"
              >
                <LogOut size={16} /> Entrar com outra conta
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="admin@paletaestudios.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isActionLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 text-white cursor-pointer"
              >
                {isActionLoading ? "Autenticando..." : "Entrar com Usuário"}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-white/30 text-xs uppercase tracking-widest font-mono">ou</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isActionLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-surface hover:bg-white/5 border border-white/10 py-3.5 rounded-xl font-bold transition-all text-sm cursor-pointer"
              >
                <Key size={16} className="text-orange-500" /> Acesso Direto com Google
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} /> Voltar para o Site Oficial
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Admin Dashboard ---

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-surface/80 backdrop-blur-md border-b border-white/10 py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 relative">
              <img src="https://i.postimg.cc/MpxNwd63/P-logo.png" alt="Logo" className="absolute inset-0 w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight uppercase text-white block">Paleta Estúdios</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f27d26] flex items-center gap-1">
                <Settings size={10} className="animate-spin" /> Painel de Controle Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft size={14} /> Ver Alterações no Site
            </button>
            
            <button
              onClick={handleSignOut}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-red-500/20 inline-flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        
        {feedback && (
          <div className={`p-4 rounded-2xl mb-8 text-sm flex items-center justify-between ${feedback.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="hover:text-white"><X size={16} /></button>
          </div>
        )}

        {/* Database initial seed assistant if completely empty */}
        {isDbEmpty && (
          <div className="p-8 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 rounded-[2rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10 text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow">
                <Sparkles size={11} /> Configuração Inicial Rápida
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Importar Imagens e Portfólio Padrão?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Detectamos que seu banco de dados do Firestore está limpo. Você pode povoar o banco instantaneamente com todos os 13 banners iniciais, as fotos da seção DNA e os 12 episódios do Portfólio com um único clique. Depois, poderá alterar, excluir ou organizar as fotos como desejar!
              </p>
            </div>
            
            <button
              onClick={handleSeedDatabase}
              disabled={isActionLoading}
              className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-orange-500/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Database size={16} /> {isActionLoading ? "Importando..." : "Importar Dados Iniciais"}
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full"></div>
          </div>
        )}

        {/* Mobile preview warning button */}
        <div className="sm:hidden mb-6">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl border border-white/10 text-sm"
          >
            <ArrowLeft size={16} /> Ver no Site
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1.5 bg-brand-surface border border-white/5 rounded-2xl w-fit mb-10 overflow-auto max-w-full">
          <button
            onClick={() => setActiveTab("banner")}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "banner" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            <ImageIcon size={14} /> 1. Banner Principal
          </button>
          
          <button
            onClick={() => setActiveTab("dna")}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "dna" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            <Sparkles size={14} /> 2. Seção Nosso DNA
          </button>
          
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "portfolio" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            <VideoIcon size={14} /> 3. Portfólio de Gravações
          </button>
        </div>

        {/* TAB 1: Banner principal */}
        {activeTab === "banner" && (
          <div className="space-y-8">
            <div className="bg-brand-surface rounded-3xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-1">Adicionar Foto ao Banner Principal</h2>
              <p className="text-white/50 text-xs mb-6">Envie uma foto local do seu celular/computador ou insira uma URL da internet. Redimensionada automaticamente.</p>
              
              <form onSubmit={handleAddBanner} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* File selector box */}
                  <div className="relative border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20 group min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-white/40 group-hover:text-orange-500 mb-2 transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Enviar Foto do Dispositivo</span>
                    <span className="text-[10px] text-white/40">Selecione uma imagem para converter e subir</span>
                    
                    {bannerPreview && (
                      <div className="absolute inset-2 bg-black rounded-lg flex items-center justify-between p-3 border border-white/20">
                        <div className="flex items-center gap-3">
                          <img src={bannerPreview} className="w-12 h-12 object-cover rounded" />
                          <div className="text-left">
                            <p className="text-[11px] font-bold text-white truncate max-w-[140px]">{bannerFile?.name}</p>
                            <p className="text-[9px] text-white/40">Pronto para enviar</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setBannerFile(null);
                            setBannerPreview(null);
                          }}
                          className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* URL Text field input */}
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1">
                      <LinkIcon size={12} className="text-orange-500" /> Ou usar link específico (URL)
                    </label>
                    <input
                      type="url"
                      placeholder="Exemplo: https://i.postimg.cc/..."
                      value={newBannerUrl}
                      onChange={(e) => {
                        setNewBannerUrl(e.target.value);
                        setBannerFile(null);
                        setBannerPreview(null);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-orange-500 focus:outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isActionLoading || (!bannerFile && !newBannerUrl.trim())}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-orange-500 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={16} /> Adicionar Banner
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-brand-surface rounded-3xl p-6 border border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold">Fotos Atuais no Banner ({banners.length})</h2>
                  <p className="text-white/40 text-xs mt-0.5 font-medium">As alterações aplicadas aqui são atualizadas em tempo real no carrossel do site.</p>
                </div>
                
                {banners.length === 0 && (
                  <button
                    onClick={handleSeedBannersOnly}
                    disabled={isActionLoading}
                    className="bg-[#f27d26]/10 hover:bg-[#f27d26]/25 border border-[#f27d26]/30 text-[#f27d26] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={12} /> Carregar Banners de Modelo
                  </button>
                )}
              </div>
              
              {banners.length === 0 ? (
                <div className="p-8 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center bg-black/10">
                  <p className="text-sm font-semibold text-white/50 mb-4">⚠️ Seu banco de dados do banner está vazio.</p>
                  <p className="text-xs text-white/30 max-w-md leading-relaxed mb-6">
                    Por isso, o site atualmente exibe imagens padrão programadas em código de fallback. Clique abaixo para carregar as fotos padrão no painel de onde você poderá reordená-las ou removê-las à vontade!
                  </p>
                  <button
                    onClick={handleSeedBannersOnly}
                    disabled={isActionLoading}
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} /> Carregar Banners de Modelo do Site
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((item, idx) => (
                    <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-black border border-white/10 flex flex-col">
                      <div className="aspect-video w-full relative">
                        <img src={item.url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=640"}} />
                        <span className="absolute top-3 left-3 bg-black/75 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider font-mono border border-white/10">
                          #{idx + 1}
                        </span>
                      </div>
                      
                      <div className="p-4 bg-brand-surface flex items-center justify-between border-t border-white/5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveBanner(idx, "up")}
                            disabled={idx === 0 || isActionLoading}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                            title="Mover para esquerda/cima"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveBanner(idx, "down")}
                            disabled={idx === banners.length - 1 || isActionLoading}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                            title="Mover para direita/baixo"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteBanner(item.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors border border-red-500/20 cursor-pointer"
                          title="Excluir do Banner"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DNA Section */}
        {activeTab === "dna" && (
          <div className="space-y-8">
            <div className="bg-brand-surface rounded-3xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-1">Adicionar Foto à Seção Nosso DNA</h2>
              <p className="text-white/50 text-xs mb-6">Envie uma foto local ou link URL para o carrossel explicativo Sobre Nós.</p>
              
              <form onSubmit={handleAddDna} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* File selector box */}
                  <div className="relative border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20 group min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDnaFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-white/40 group-hover:text-orange-500 mb-2 transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Enviar Foto do Dispositivo</span>
                    <span className="text-[10px] text-white/40">Selecione uma foto da sua galeria ou arquivos</span>
                    
                    {dnaPreview && (
                      <div className="absolute inset-2 bg-black rounded-lg flex items-center justify-between p-3 border border-white/20">
                        <div className="flex items-center gap-3">
                          <img src={dnaPreview} className="w-12 h-12 object-cover rounded" />
                          <div className="text-left">
                            <p className="text-[11px] font-bold text-white truncate max-w-[140px]">{dnaFile?.name}</p>
                            <p className="text-[9px] text-white/40">Pronto para enviar</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDnaFile(null);
                            setDnaPreview(null);
                          }}
                          className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* URL Text field input */}
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1">
                      <LinkIcon size={12} className="text-orange-500" /> Ou usar link específico (URL)
                    </label>
                    <input
                      type="url"
                      placeholder="Exemplo: https://i.postimg.cc/..."
                      value={newDnaUrl}
                      onChange={(e) => {
                        setNewDnaUrl(e.target.value);
                        setDnaFile(null);
                        setDnaPreview(null);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-orange-500 focus:outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isActionLoading || (!dnaFile && !newDnaUrl.trim())}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-orange-500 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={16} /> Adicionar no DNA
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-brand-surface rounded-3xl p-6 border border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold">Fotos Na Seção Nosso DNA ({dnaImages.length})</h2>
                  <p className="text-white/40 text-xs mt-0.5 font-medium">Essas imagens são exibidas dinamicamente na galeria Sobre Nós.</p>
                </div>
                
                {dnaImages.length === 0 && (
                  <button
                    onClick={handleSeedDnaOnly}
                    disabled={isActionLoading}
                    className="bg-[#f27d26]/10 hover:bg-[#f27d26]/25 border border-[#f27d26]/30 text-[#f27d26] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={12} /> Carregar Fotos DNA de Modelo
                  </button>
                )}
              </div>
              
              {dnaImages.length === 0 ? (
                <div className="p-8 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center bg-black/10">
                  <p className="text-sm font-semibold text-white/50 mb-4">⚠️ Seu banco de dados do DNA está vazio.</p>
                  <p className="text-xs text-white/30 max-w-md leading-relaxed mb-6">
                    O carrossel de fotos da sobre nós está provisoriamente mostrando as fotos estáticas integradas no código. Clique no botão abaixo para preencher o banco com as modelos para poder removê-las e alterá-las!
                  </p>
                  <button
                    onClick={handleSeedDnaOnly}
                    disabled={isActionLoading}
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} /> Carregar Fotos DNA de Modelo do Site
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dnaImages.map((item, idx) => (
                    <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-black border border-white/10 flex flex-col">
                      <div className="aspect-video w-full relative">
                        <img src={item.url} alt={`DNA Slide ${idx + 1}`} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=640"}} />
                        <span className="absolute top-3 left-3 bg-black/75 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider font-mono border border-white/10">
                          #{idx + 1}
                        </span>
                      </div>
                      
                      <div className="p-4 bg-brand-surface flex items-center justify-between border-t border-white/5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveDna(idx, "up")}
                            disabled={idx === 0 || isActionLoading}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                            title="Mover acima/anterior"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveDna(idx, "down")}
                            disabled={idx === dnaImages.length - 1 || isActionLoading}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                            title="Mover abaixo/seguinte"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteDna(item.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors border border-red-500/20 cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Portfólio de Gravações */}
        {activeTab === "portfolio" && (
          <div className="space-y-8">
            <div className="bg-brand-surface rounded-3xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-2">Adicionar Novo Slide ao Portfólio</h2>
              <p className="text-white/50 text-xs mb-6 font-medium text-white/50">Adicione uma foto estática tirada nos bastidores ou anexe um link de vídeo do YouTube para extração inteligente.</p>
              
              <form onSubmit={handleAddPortfolio} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Título do Slide (Texto)</label>
                    <input
                      type="text"
                      required
                      placeholder="Exemplo: Mañez Talks"
                      value={newPortTitle}
                      onChange={(e) => setNewPortTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-orange-500 focus:outline-none placeholder:text-white/35 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Tipo de Mídia de Gravação</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewPortType("photo");
                          setNewPortMediaUrl("");
                        }}
                        className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-1 px-4 cursor-pointer ${newPortType === "photo" ? "bg-orange-500 text-white border-orange-500" : "bg-black/40 text-white/60 border-white/10 hover:text-white"}`}
                      >
                        <ImageIcon size={14} /> Foto Estática
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPortType("video");
                          setPortFile(null);
                          setPortPreview(null);
                        }}
                        className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-1 px-4 cursor-pointer ${newPortType === "video" ? "bg-orange-500 text-white border-orange-500" : "bg-black/40 text-white/60 border-white/10 hover:text-white"}`}
                      >
                        <VideoIcon size={14} /> Vídeo do YouTube
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 font-bold">
                    {newPortType === "video" ? "Mídia de Gravação - YouTube Link" : "Mídia de Gravação - Envio do Arquivo ou Link"}
                  </label>

                  {newPortType === "video" ? (
                    <div>
                      <input
                        type="url"
                        required
                        placeholder="Cole o link do YouTube (Exemplo: https://www.youtube.com/watch?v=I974rqPXlVM)"
                        value={newPortMediaUrl}
                        onChange={(e) => setNewPortMediaUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-orange-500 focus:outline-none placeholder:text-white/30 text-white"
                      />
                      <p className="text-orange-400 text-[11px] mt-2.5 flex items-center gap-1 font-medium bg-orange-500/5 p-3 rounded-xl border border-orange-500/15">
                        <Sparkles size={11} /> Extração Automática: O site criará automaticamente a capa pré-visualizável da thumbnail e o reprodutor instantâneo inline ao clicar!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* File selector box */}
                      <div className="relative border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20 group min-h-[140px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePortFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-white/40 group-hover:text-orange-500 mb-2 transition-colors" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Selecione Foto do Seu Computador</span>
                        <span className="text-[10px] text-white/40">Converta e envie foto do estúdio do portfólio</span>
                        
                        {portPreview && (
                          <div className="absolute inset-2 bg-black rounded-lg flex items-center justify-between p-3 border border-white/20">
                            <div className="flex items-center gap-3">
                              <img src={portPreview} className="w-12 h-12 object-cover rounded" />
                              <div className="text-left">
                                <p className="text-[11px] font-bold text-white truncate max-w-[140px]">{portFile?.name}</p>
                                <p className="text-[9px] text-white/40 font-mono">Pronto para enviar</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setPortFile(null);
                                setPortPreview(null);
                              }}
                              className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* URL Box */}
                      <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1">
                          <LinkIcon size={12} className="text-orange-500" /> Ou usar link de foto estática (URL)
                        </label>
                        <input
                          type="url"
                          placeholder="Exemplo: https://pod.paletaestudios.com.br/assets/img/IMG_2832.jpg"
                          value={newPortMediaUrl}
                          onChange={(e) => {
                            setNewPortMediaUrl(e.target.value);
                            setPortFile(null);
                            setPortPreview(null);
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-orange-500 focus:outline-none placeholder:text-white/30 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isActionLoading || (newPortType === "photo" && !portFile && !newPortMediaUrl.trim()) || (newPortType === "video" && !newPortMediaUrl.trim())}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:hover:bg-orange-500 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
                  >
                    <Plus size={16} /> Publicar Slide de Portfólio
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-brand-surface rounded-3xl p-6 border border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold">Slides Atuais no Portfólio ({portfolio.length})</h2>
                  <p className="text-white/45 text-xs font-medium mt-0.5">Mude a ordem, edite os títulos descritivos ou remova slides antigos.</p>
                </div>
                
                {portfolio.length === 0 && (
                  <button
                    onClick={handleSeedPortfolioOnly}
                    disabled={isActionLoading}
                    className="bg-[#f27d26]/10 hover:bg-[#f27d26]/25 border border-[#f27d26]/30 text-[#f27d26] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Sparkles size={12} /> Carregar Portfólio de Modelo
                  </button>
                )}
              </div>
              
              {portfolio.length === 0 ? (
                <div className="p-8 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center bg-black/10">
                  <p className="text-sm font-semibold text-white/50 mb-4">⚠️ Seu banco de dados do portfólio está vazio.</p>
                  <p className="text-xs text-white/30 max-w-md leading-relaxed mb-6">
                    A galeria de episódios gravados do site está exibindo temporariamente os episódios estáticos gravados no código fonte. Pressione o botão para importar esses episódios para o painel administrativo!
                  </p>
                  <button
                    onClick={handleSeedPortfolioOnly}
                    disabled={isActionLoading}
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} /> Carregar Portfólio de Modelo do Site
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.map((item, idx) => {
                    const isEditing = editingPortfolioId === item.id;
                    const isVideo = !!item.videoUrl;

                    return (
                      <div key={item.id} className="p-4 bg-black/45 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between">
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 flex-grow w-full md:w-auto">
                          
                          {/* Image preview */}
                          <div className="w-24 h-24 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-brand-surface border border-white/10 relative">
                            <img src={isEditing ? editPortSrc : item.src} alt="Slide thumb" className="w-full h-full object-cover" />
                            {isVideo && (
                              <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                <VideoIcon size={14} className="text-red-400" />
                              </div>
                            )}
                          </div>

                          {/* Data info or inputs */}
                          {isEditing ? (
                            <div className="space-y-2 flex-grow w-full">
                              <div>
                                <label className="text-[10px] uppercase text-white/40 block font-bold mb-1">Título/Texto</label>
                                <input
                                  type="text"
                                  value={editPortTitle}
                                  onChange={(e) => setEditPortTitle(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-brand-surface border border-white/10 text-xs rounded-lg text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase text-white/40 block font-bold mb-1">Link da Imagem</label>
                                <input
                                  type="text"
                                  value={editPortSrc}
                                  onChange={(e) => setEditPortSrc(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-brand-surface border border-white/10 text-xs rounded-lg text-white"
                                />
                              </div>
                              {isVideo && (
                                <div>
                                  <label className="text-[10px] uppercase text-white/40 block font-bold mb-1">Vídeo do YouTube</label>
                                  <input
                                    type="text"
                                    value={editPortYoutube}
                                    onChange={(e) => setEditPortYoutube(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-brand-surface border border-white/10 text-xs rounded-lg text-white font-mono"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center sm:text-left">
                              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                                <span className="text-[10px] font-bold tracking-wider font-mono text-white/40">#{idx + 1}</span>
                                <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold font-sans ${isVideo ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                  {isVideo ? "Vídeo" : "Foto"}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white leading-snug">{item.title}</h4>
                              <p className="text-[11px] text-white/40 truncate max-w-sm mt-1 select-all font-mono">{item.youtubeUrl || item.src}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end items-center">
                          
                          {/* Reordering */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleMovePortfolio(idx, "up")}
                              disabled={idx === 0 || isEditing || isActionLoading}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                              title="Mover para cima"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              onClick={() => handleMovePortfolio(idx, "down")}
                              disabled={idx === portfolio.length - 1 || isEditing || isActionLoading}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                              title="Mover para baixo"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>

                          {/* Action controls */}
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEditPortfolio(item.id)}
                                  disabled={isActionLoading}
                                  className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-black font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                                  title="Salvar alterações"
                                >
                                  <Check size={12} /> Salvar
                                </button>
                                <button
                                  onClick={() => setEditingPortfolioId(null)}
                                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                                  title="Cancelar"
                                >
                                  <X size={12} /> Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditPortfolio(item)}
                                  disabled={isActionLoading}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 cursor-pointer"
                                  title="Editar slide"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeletePortfolio(item.id)}
                                  disabled={isActionLoading}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/20 cursor-pointer"
                                  title="Remover slide"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

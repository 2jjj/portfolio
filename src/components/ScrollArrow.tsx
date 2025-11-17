import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollArrow = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
         const position = contactSection.getBoundingClientRect();
         // Ajustei para esconder um pouco antes
         setIsVisible(position.top > window.innerHeight - 50);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-0 right-0 mx-auto w-fit z-50">
      <button
        onClick={scrollToContact}
        className="group cursor-pointer animate-bounce transition-transform duration-300"
        aria-label="Ir para contato"
        // AQUI ESTÁ O TRUQUE DA VELOCIDADE: 2s (quanto maior o número, mais lento)
        style={{ animationDuration: '2s' }}
      >
        <div className="relative">
          {/* Fundo desfocado ajustado para o tamanho novo */}
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:bg-primary/50 transition-all duration-300"></div>
          
          {/* Botão Visual: Mudei p-4 para p-3 (menor) */}
          <div className="relative p-3 rounded-full border-2 border-primary/50 bg-background/80 backdrop-blur-md group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110">
            {/* Ícone: Mudei h-6 w-6 para h-5 w-5 (menor) */}
            <ChevronDown className="h-5 w-5 text-primary transition-transform duration-300" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ScrollArrow;
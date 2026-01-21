import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AngelWings, Halo, DivineStar, FloatingParticles } from "@/components/AngelIcons";

export default function Espera() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-celestial-gradient relative overflow-hidden flex items-center justify-center">
      <FloatingParticles />
      
      {/* Divine Light Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#d4af37]/20 via-[#d4af37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="container max-w-2xl py-8 px-4 relative z-10">
        <div className="card-celestial p-8 md:p-12 text-center space-y-8">
          <div className="relative">
            <AngelWings className="w-48 mx-auto animate-pulse-gold" />
            <Halo className="w-24 mx-auto -mt-2 animate-glow" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient">
              ESPERA, MEU FILHO!
            </h1>
            
            <DivineStar className="w-8 h-8 mx-auto animate-float" />
            
            <p className="text-xl text-foreground">
              O Arcanjo Miguel ainda tem uma mensagem importante para você...
            </p>
          </div>

          <blockquote className="text-muted-foreground italic border-l-4 border-[#d4af37] pl-4 text-left">
            "Não vá embora ainda. Sei que a vida tem sido difícil, mas você foi guiado até aqui por um propósito. 
            Volte e assista ao vídeo completo. Sua bênção está esperando por você."
          </blockquote>

          <div className="space-y-4">
            <p className="text-foreground font-semibold">
              Você está a poucos passos de receber sua revelação divina.
            </p>
            
            <Button
              onClick={() => setLocation("/video")}
              className="btn-divine text-lg animate-glow"
            >
              VOLTAR E RECEBER MINHA BÊNÇÃO
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            "O tempo de Deus é perfeito. Confie no processo."
          </p>
        </div>
      </div>
    </div>
  );
}

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AngelWings, Halo, DivineStar, Dove, FloatingParticles } from "@/components/AngelIcons";

export default function Calma() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-celestial-gradient relative overflow-hidden flex items-center justify-center">
      <FloatingParticles />
      
      {/* Divine Light Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#d4af37]/20 via-[#d4af37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="container max-w-2xl py-8 px-4 relative z-10">
        <div className="card-celestial p-8 md:p-12 text-center space-y-8">
          <div className="relative">
            <Dove className="w-16 h-12 mx-auto animate-float text-[#d4af37]" />
            <AngelWings className="w-56 mx-auto animate-pulse-gold mt-4" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient">
              CALMA, MEU FILHO!
            </h1>
            
            <p className="text-xl text-foreground">
              Você assistiu ao vídeo, mas ainda não deu o passo final...
            </p>
          </div>

          <div className="bg-[#d4af37]/10 rounded-xl p-6 space-y-4">
            <DivineStar className="w-10 h-10 mx-auto" />
            
            <p className="text-foreground font-semibold text-lg">
              O Manuscrito Sagrado está esperando por você!
            </p>
            
            <p className="text-muted-foreground">
              Milhares de pessoas já transformaram suas vidas com as revelações contidas nele. 
              Não deixe essa oportunidade passar.
            </p>
          </div>

          <blockquote className="text-muted-foreground italic border-l-4 border-[#d4af37] pl-4 text-left">
            "Você já deu os primeiros passos. Agora é hora de completar sua jornada. 
            O Arcanjo Miguel está intercedendo por você neste exato momento."
          </blockquote>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-bold">
                OFERTA ESPECIAL: Apenas R$ 29,90
              </p>
              <p className="text-red-600 text-sm">
                Últimas unidades disponíveis!
              </p>
            </div>
            
            <Button
              onClick={() => setLocation("/checkout")}
              className="btn-divine text-lg animate-glow w-full"
            >
              GARANTIR MINHA UNÇÃO AGORA
            </Button>
            
            <Button
              onClick={() => setLocation("/video")}
              variant="outline"
              className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
            >
              Voltar ao Vídeo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            <Halo className="w-12 h-4 inline-block mr-2" />
            Garantia de 7 dias ou seu dinheiro de volta
          </p>
        </div>
      </div>
    </div>
  );
}

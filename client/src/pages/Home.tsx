import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AngelWings, Halo, DivineStar, Dove, FloatingParticles } from "@/components/AngelIcons";
import { cn } from "@/lib/utils";

type QuestionStep = "intro" | "religion" | "health" | "personal" | "cta";

interface FormData {
  religion: string;
  healthConcern: string;
  familyHealth: string;
  name: string;
  age: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<QuestionStep>("intro");
  const [formData, setFormData] = useState<FormData>({
    religion: "",
    healthConcern: "",
    familyHealth: "",
    name: "",
    age: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleNext = (nextStep: QuestionStep) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsAnimating(false);
    }, 300);
  };

  const handleCTAClick = () => {
    // Salvar dados no localStorage para uso posterior
    localStorage.setItem("escolhaDivinaUser", JSON.stringify(formData));
    setLocation("/video");
  };

  const renderIntro = () => (
    <div className={cn(
      "text-center space-y-8 transition-all duration-500",
      showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="relative inline-block">
        <Halo className="w-40 mx-auto animate-pulse-gold" />
      </div>
      
      <div className="space-y-4">
        <p className="text-[#d4af37] italic text-lg animate-fade-in">
          "Eu sou o Arcanjo Miguel, e fui enviado até você..."
        </p>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient animate-slide-up">
          PARABÉNS!
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground animate-slide-up delay-100">
          Você Foi Escolhido
        </h2>
      </div>

      <div className="card-celestial p-6 mx-auto max-w-lg animate-slide-up delay-200">
        <blockquote className="text-muted-foreground italic border-l-4 border-[#d4af37] pl-4">
          "Nada é por acaso. O Céu guiou seus passos até aqui porque você é um dos escolhidos para receber a revelação sagrada."
        </blockquote>
      </div>

      <p className="text-foreground animate-slide-up delay-300">
        O Arcanjo Miguel está presente neste momento. Ele sabe do seu coração cansado, dos seus sonhos adiados, e veio trazer a resposta que você tanto esperava.
      </p>

      <p className="font-bold text-lg text-foreground animate-slide-up delay-400">
        Este é o sinal que você pediu.
      </p>

      <Button
        onClick={() => handleNext("religion")}
        className="btn-divine text-lg animate-glow animate-slide-up delay-500"
      >
        <Dove className="w-6 h-6 mr-2" />
        ACEITAR A BÊNÇÃO
      </Button>
    </div>
  );

  const renderReligion = () => (
    <div className={cn(
      "space-y-8 transition-all duration-500",
      !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center space-y-4">
        <DivineStar className="w-12 h-12 mx-auto animate-pulse-gold" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Sua Jornada Espiritual
        </h2>
        <p className="text-muted-foreground italic">
          "Cada alma tem sua própria história com o Divino. Conte-me sobre a sua..."
        </p>
      </div>

      <div className="card-celestial p-8 max-w-lg mx-auto space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground">
            Qual é a sua relação com a fé?
          </Label>
          <RadioGroup
            value={formData.religion}
            onValueChange={(value) => setFormData({ ...formData, religion: value })}
            className="space-y-3"
          >
            {[
              { value: "catolico", label: "Católico(a)" },
              { value: "evangelico", label: "Evangélico(a)" },
              { value: "espirita", label: "Espírita" },
              { value: "crente", label: "Acredito em Deus, mas não sigo religião" },
              { value: "buscando", label: "Estou buscando minha fé" },
            ].map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                  formData.religion === option.value
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-border hover:border-[#d4af37]/50"
                )}
                onClick={() => setFormData({ ...formData, religion: option.value })}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          onClick={() => handleNext("health")}
          disabled={!formData.religion}
          className="btn-divine w-full"
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className={cn(
      "space-y-8 transition-all duration-500",
      !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center space-y-4">
        <AngelWings className="w-48 mx-auto animate-pulse-gold" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Proteção Para Sua Família
        </h2>
        <p className="text-muted-foreground italic">
          "O Arcanjo Miguel estende suas asas sobre aqueles que você ama..."
        </p>
      </div>

      <div className="card-celestial p-8 max-w-lg mx-auto space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground">
            Você ou algum familiar enfrenta problemas de saúde?
          </Label>
          <RadioGroup
            value={formData.healthConcern}
            onValueChange={(value) => setFormData({ ...formData, healthConcern: value })}
            className="space-y-3"
          >
            {[
              { value: "sim_eu", label: "Sim, eu mesmo(a) enfrento" },
              { value: "sim_familiar", label: "Sim, um familiar próximo" },
              { value: "sim_ambos", label: "Sim, eu e familiares" },
              { value: "nao_prevencao", label: "Não, mas busco proteção" },
            ].map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                  formData.healthConcern === option.value
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-border hover:border-[#d4af37]/50"
                )}
                onClick={() => setFormData({ ...formData, healthConcern: option.value })}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {formData.healthConcern && (
          <div className="space-y-4 animate-slide-up">
            <Label className="text-lg font-semibold text-foreground">
              Como está a saúde dos seus familiares mais próximos?
            </Label>
            <RadioGroup
              value={formData.familyHealth}
              onValueChange={(value) => setFormData({ ...formData, familyHealth: value })}
              className="space-y-3"
            >
              {[
                { value: "preocupante", label: "Preocupante, preciso de um milagre" },
                { value: "instavel", label: "Instável, peço proteção divina" },
                { value: "boa", label: "Boa, mas quero manter a proteção" },
              ].map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                    formData.familyHealth === option.value
                      ? "border-[#d4af37] bg-[#d4af37]/10"
                      : "border-border hover:border-[#d4af37]/50"
                  )}
                  onClick={() => setFormData({ ...formData, familyHealth: option.value })}
                >
                  <RadioGroupItem value={option.value} id={`family-${option.value}`} />
                  <Label htmlFor={`family-${option.value}`} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <Button
          onClick={() => handleNext("personal")}
          disabled={!formData.healthConcern || !formData.familyHealth}
          className="btn-divine w-full"
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderPersonal = () => (
    <div className={cn(
      "space-y-8 transition-all duration-500",
      !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center space-y-4">
        <DivineStar className="w-16 h-16 mx-auto animate-float" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          O Céu Deseja Conhecê-lo
        </h2>
        <p className="text-muted-foreground italic">
          "Seu nome tem poder. Quando pronunciado com fé, abre portas no mundo espiritual."
        </p>
      </div>

      <div className="card-celestial p-8 max-w-lg mx-auto space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg font-semibold text-foreground">
              Seu nome completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-[#d4af37]/30 focus:border-[#d4af37] focus:ring-[#d4af37]/20 text-lg p-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-lg font-semibold text-foreground">
              Sua idade
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Digite sua idade"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="border-[#d4af37]/30 focus:border-[#d4af37] focus:ring-[#d4af37]/20 text-lg p-4"
              min="1"
              max="120"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center italic">
          "Não importa quantos anos você tenha. O que importa é que você chegou até aqui por um propósito divino."
        </p>

        <Button
          onClick={() => handleNext("cta")}
          disabled={!formData.name || !formData.age}
          className="btn-divine w-full"
        >
          Revelar Minha Bênção
        </Button>
      </div>
    </div>
  );

  const renderCTA = () => (
    <div className={cn(
      "space-y-8 transition-all duration-500",
      !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="text-center space-y-6">
        <div className="relative">
          <AngelWings className="w-64 mx-auto animate-pulse-gold" />
          <Halo className="w-32 mx-auto -mt-4 animate-glow" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gold-gradient">
          {formData.name}, O Momento Chegou!
        </h2>
        
        <p className="text-xl text-foreground">
          "Eu sou o Arcanjo Miguel. Prepare seu coração para a revelação..."
        </p>
      </div>

      <div className="card-celestial p-8 max-w-lg mx-auto space-y-6 animate-glow">
        <div className="text-center space-y-4">
          <p className="text-[#d4af37] font-bold text-xl uppercase tracking-wider">
            O Céu Abençoa Você
          </p>
          
          <blockquote className="text-foreground italic border-l-4 border-[#d4af37] pl-4 text-left">
            "Tudo está preparado. Do outro lado deste portal, o Arcanjo Miguel irá revelar as palavras sagradas que mudarão sua vida. Uma bênção inesperada está a caminho..."
          </blockquote>

          <p className="text-foreground">
            <strong>Este momento é sagrado.</strong> Você foi escolhido entre milhares para receber esta mensagem.
          </p>

          <p className="text-muted-foreground">
            Respire fundo, abra seu coração e clique abaixo para assistir à sua revelação pessoal.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
            <p className="text-red-700 font-bold text-center text-lg">
              ATENÇÃO: Esta é sua ÚNICA chance!
            </p>
          </div>
          
          <Button
            onClick={handleCTAClick}
            className="btn-divine w-full text-base md:text-lg py-6 animate-glow"
          >
            <span className="flex flex-col md:flex-row items-center justify-center gap-2 text-center leading-tight">
              <Dove className="w-6 h-6 shrink-0 hidden md:block" />
              <span className="uppercase font-bold">SE VOCÊ PRECISA DE UM MILAGRE, CLIQUE AQUI PARA VER O VÍDEO QUE MUDARÁ SUA VIDA</span>
            </span>
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground animate-fade-in">
        <Dove className="w-4 h-4 inline mr-1" />
        Mais de 47.000 pessoas já receberam esta bênção
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-celestial-gradient relative overflow-hidden">
      <FloatingParticles />
      
      {/* Divine Light Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#d4af37]/20 via-[#d4af37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="container max-w-4xl py-8 md:py-16 relative z-10">
        {/* Progress Indicator */}
        {step !== "intro" && (
          <div className="flex justify-center gap-2 mb-8">
            {["religion", "health", "personal", "cta"].map((s, i) => (
              <div
                key={s}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  ["religion", "health", "personal", "cta"].indexOf(step) >= i
                    ? "bg-[#d4af37]"
                    : "bg-[#d4af37]/20"
                )}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-4">
          {step === "intro" && renderIntro()}
          {step === "religion" && renderReligion()}
          {step === "health" && renderHealth()}
          {step === "personal" && renderPersonal()}
          {step === "cta" && renderCTA()}
        </div>
      </div>
    </div>
  );
}

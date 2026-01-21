import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AngelWings, DivineStar, FloatingParticles } from "@/components/AngelIcons";
import { cn } from "@/lib/utils";

// Configuração do tempo para mostrar o botão CTA (em segundos)
const CTA_DELAY_SECONDS = 5; // 5 segundos para teste (alterar para 1524 em produção = ~25 minutos)

interface Comment {
  id: number;
  name: string;
  avatar: string;
  text: string;
  time: string;
  replies?: Comment[];
}

const fakeComments: Comment[] = [
  {
    id: 1,
    name: "Maria Cardoso",
    avatar: "https://i.pravatar.cc/100?img=1",
    text: "Depois de ler o manuscrito sagrado, minha vida deu uma guinada que parecia impossível. Minhas dívidas foram quitadas de formas inesperadas, e hoje vivo uma abundância que nunca imaginei. São Miguel Arcanjo tem sido meu protetor em todas as batalhas.",
    time: "3 min",
  },
  {
    id: 2,
    name: "Juliana de Almeida",
    avatar: "https://i.pravatar.cc/100?img=5",
    text: "Não sabia como superar as dificuldades financeiras que me sufocavam, mas ao estudar as palavras do manuscrito, senti uma paz imensa e em pouco tempo, as soluções começaram a surgir. Tenho certeza de que São Miguel me guiou para esse conhecimento ancestral.",
    time: "4 min",
  },
  {
    id: 3,
    name: "Fátima do Rosário",
    avatar: "https://i.pravatar.cc/100?img=9",
    text: "Eu estava no fundo do poço, mas esse manuscrito sagrado mudou tudo. Em menos de um mês, consegui quitar dívidas, reorganizar minha vida e, finalmente, senti uma sensação de propósito. As orações contidas nele são poderosas!",
    time: "5 min",
  },
  {
    id: 4,
    name: "Rodrigo Carvalho",
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "Acordei de um sonho com São Miguel Arcanjo e, naquele mesmo dia, descobri o manuscrito. Desde que comecei a seguir seus ensinamentos, uma oportunidade incrível surgiu no trabalho. Tudo flui com tanta naturalidade que só posso agradecer.",
    time: "10 min",
  },
  {
    id: 5,
    name: "Maria dos Santos",
    avatar: "https://i.pravatar.cc/100?img=20",
    text: "Não tenho palavras para descrever o que senti ao ler o manuscrito sagrado. Meu negócio, que estava à beira da falência, agora prospera como nunca antes. Sinto que minha vida foi abençoada de maneira sobrenatural através dessas palavras divinas.",
    time: "16 min",
    replies: [
      {
        id: 51,
        name: "Lourdes Lima",
        avatar: "https://i.pravatar.cc/100?img=23",
        text: "Sim Maria, depois que li o manuscrito minha vida mudou. Sonhei com números e ganhei 2mil reais quando joguei na loto, nem acreditei. As revelações contidas nele são reais!",
        time: "14 min",
      },
      {
        id: 52,
        name: "Maria dos Santos",
        avatar: "https://i.pravatar.cc/100?img=20",
        text: "Que ótimo Lourdes, muita sorte para nós!!",
        time: "10 min",
      },
    ],
  },
  {
    id: 6,
    name: "Gabriela Carvalho",
    avatar: "https://i.pravatar.cc/100?img=25",
    text: "O mais surpreendente foi a forma como tudo mudou rapidamente. Ao seguir os rituais de cura descritos no manuscrito, me reconectei com meu propósito de vida e alcancei metas que antes pareciam impossíveis. Minha gratidão é imensa.",
    time: "35 min",
  },
  {
    id: 7,
    name: "Fernando da Silva",
    avatar: "https://i.pravatar.cc/100?img=33",
    text: "Sempre trabalhei duro, mas nunca saía do lugar. Após aplicar os ensinamentos do manuscrito sagrado, oportunidades começaram a aparecer e, pela primeira vez, consegui poupar dinheiro e realizar sonhos antigos. A sabedoria ancestral realmente funciona!",
    time: "52 min",
  },
  {
    id: 8,
    name: "Ana Paula Ferreira",
    avatar: "https://i.pravatar.cc/100?img=44",
    text: "O manuscrito trouxe cura não apenas financeira, mas espiritual também. Minha saúde melhorou, meu relacionamento com a família se restaurou e consegui sair das dívidas. É como se uma força divina tivesse entrado na minha vida.",
    time: "1 h",
  },
  {
    id: 9,
    name: "Carlos Henrique",
    avatar: "https://i.pravatar.cc/100?img=52",
    text: "Estava desempregado há meses quando encontrei o manuscrito. Segui as orações de prosperidade descritas nele e em 2 semanas recebi 3 propostas de emprego. Hoje estou em uma posição melhor do que nunca imaginei. Gratidão eterna!",
    time: "1 h",
  },
];

export default function Video() {
  const [, setLocation] = useLocation();
  const [showCTA, setShowCTA] = useState(false);
  const [progress, setProgress] = useState(99);
  const pageLoadTime = useRef(Date.now());
  const playerRef = useRef<HTMLDivElement>(null);

  // Sistema anti-back
  useEffect(() => {
    const earlyBackRedirectLink = "/espera";
    const laterBackRedirectLink = "/calma";

    history.pushState({}, "", location.href);
    history.pushState({}, "", location.href);

    const handlePopState = () => {
      setTimeout(() => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - pageLoadTime.current;

        if (timeElapsed < 20 * 60 * 1000) {
          setLocation(earlyBackRedirectLink);
        } else {
          setLocation(laterBackRedirectLink);
        }
      }, 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setLocation]);

  // Carregar SmartPlayer
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/51bc0aee-933b-4e5b-964f-6f0ccd271db7/players/68e9ae227a3f63b4d7d7811b/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    // Configurar evento para mostrar CTA após tempo definido
    const checkPlayer = setInterval(() => {
      const player = document.querySelector("vturb-smartplayer");
      if (player) {
        clearInterval(checkPlayer);
        player.addEventListener("player:ready", () => {
          // @ts-ignore
          player.displayHiddenElements(CTA_DELAY_SECONDS, [".cta-hidden"], {
            persist: true,
          });
        });
      }
    }, 100);

    // Fallback: mostrar CTA após tempo definido mesmo sem player
    const ctaTimeout = setTimeout(() => {
      setShowCTA(true);
    }, CTA_DELAY_SECONDS * 1000);

    return () => {
      clearInterval(checkPlayer);
      clearTimeout(ctaTimeout);
    };
  }, []);

  const handleCTAClick = () => {
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-white">
      <FloatingParticles className="opacity-30" />
      
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            <span className="text-xs md:text-sm font-semibold text-[#666] opacity-80">Visto em:</span>
            <span className="text-xs md:text-sm font-semibold text-[#d4af37]">Cancao Nova</span>
            <span className="text-xs md:text-sm font-semibold text-[#d4af37]">Rede Vida</span>
            <span className="text-xs md:text-sm font-semibold text-[#d4af37]">TV Horizonte</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-red-600 text-white py-2 px-4 text-center">
        <span className="font-bold">{progress}%</span> das vagas preenchidas
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Um <span className="text-red-600">Manuscrito</span> Antigo Está{" "}
            <span className="text-red-600">Transformando</span> Vidas em{" "}
            <span className="text-red-600">7 Dias</span> - Com{" "}
            <span className="text-red-600">Curas Inexplicáveis</span> e{" "}
            <span className="text-red-600">Riqueza Repentina</span>
          </h1>
        </div>

        {/* Video Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] p-4 md:p-6 mb-8 max-w-md mx-auto">
          <div ref={playerRef}>
            {/* @ts-ignore */}
            <vturb-smartplayer
              id="vid-68e9ae227a3f63b4d7d7811b"
              style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "400px" }}
            />
          </div>
        </div>

        {/* CTA Button - Hidden until time */}
        <div className={cn("cta-hidden mb-8 w-full overflow-hidden px-4", showCTA ? "block" : "hidden")}>
          <div className="max-w-sm mx-auto space-y-4">
            <div className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] p-1 rounded-2xl shadow-2xl w-full">
              <div className="bg-white rounded-xl p-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <DivineStar className="w-6 h-6 text-[#d4af37]" />
                  <span className="text-[#d4af37] font-bold text-lg uppercase tracking-wide">Oferta Especial</span>
                  <DivineStar className="w-6 h-6 text-[#d4af37]" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  As 5 Palavras Ungidas
                </h3>
                
                <p className="text-muted-foreground text-sm">
                  Receba agora as palavras sagradas reveladas pelo Arcanjo Miguel que transformarão sua vida
                </p>
                
                <div className="py-2">
                  <span className="text-muted-foreground line-through text-lg">De R$ 97,00</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-[#d4af37]">R$ 29,90</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Economia de R$ 67,10</span>
                </div>
                
                <Button
                  onClick={handleCTAClick}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#c9a432] hover:to-[#a88526] text-white font-bold py-3 px-6 rounded-xl text-base md:text-lg shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <span className="flex flex-col items-center gap-1 text-center">
                    <span className="text-sm md:text-base">🙏 QUERO RECEBER MINHA UNCAO</span>
                    <span className="text-xs font-normal opacity-90">Pagamento 100% Seguro via PIX</span>
                  </span>
                </Button>
                
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Acesso Imediato</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Garantia de 7 dias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="text-center">
            <AngelWings className="w-16 h-8 mx-auto text-[#d4af37]" />
            <p className="text-xs text-muted-foreground mt-1">Proteção Divina</p>
          </div>
          <div className="text-center">
            <DivineStar className="w-8 h-8 mx-auto text-[#d4af37]" />
            <p className="text-xs text-muted-foreground mt-1">Bênção Celestial</p>
          </div>
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p className="text-xs text-muted-foreground mt-1">Garantia Total</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            9 de 149 Comentários
          </h3>

          <div className="space-y-6">
            {fakeComments.map((comment) => (
              <div key={comment.id}>
                <div className="flex gap-4">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[#1877f2] font-semibold text-sm">
                      {comment.name}
                    </p>
                    <p className="text-[#1c1e21] text-sm leading-relaxed mt-1">
                      {comment.text}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-[#65676b]">
                      <span className="cursor-pointer hover:underline">Responder</span>
                      <span className="cursor-pointer hover:underline">Curtir</span>
                      {!comment.replies && (
                        <span className="cursor-pointer hover:underline">Seguir</span>
                      )}
                      <span>{comment.time}</span>
                    </div>

                    {/* Replies */}
                    {comment.replies && (
                      <div className="ml-4 mt-4 pl-4 border-l-2 border-[#e5e7eb] space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <img
                              src={reply.avatar}
                              alt={reply.name}
                              className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="text-[#1877f2] font-semibold text-sm">
                                {reply.name}
                              </p>
                              <p className="text-[#1c1e21] text-sm leading-relaxed mt-1">
                                {reply.text}
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-[#65676b]">
                                <span className="cursor-pointer hover:underline">Responder</span>
                                <span className="cursor-pointer hover:underline">Curtir</span>
                                <span>{reply.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {comment.id !== fakeComments[fakeComments.length - 1].id && (
                  <div className="border-b border-[#e5e7eb] mt-6" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 text-sm text-[#666] leading-relaxed max-w-2xl mx-auto">
          <p className="font-bold mb-4">
            Política de Privacidade │ Termos e Condições de Uso
          </p>
          <p>
            Esse site não é afiliado ao Facebook ou qualquer entidade do Facebook. 
            Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site. 
            Fazemos todos os esforços para indicar claramente e mostrar todos as provas reais do produto 
            e usamos resultados reais. Nós não vendemos seus e-mail ou qualquer informação para terceiros. 
            Jamais fazemos nenhum tipo de spam. Se você tiver alguma dúvida, sinta-se à vontade para usar 
            o link de contato e falar conosco em horário comercial de Segunda a Sextas das 09h00 às 18h00. 
            Lemos e respondemos todas as mensagens por ordem de chegada.
          </p>
        </footer>
      </div>
    </div>
  );
}

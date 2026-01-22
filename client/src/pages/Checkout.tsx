import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AngelWings, Halo, DivineStar, FloatingParticles } from "@/components/AngelIcons";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Loader2, Copy, Check, QrCode, Shield, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  name: string;
  age: string;
  religion: string;
  healthConcern: string;
  familyHealth: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [pixData, setPixData] = useState<{
    qrCode: string;
    copyPaste: string;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"form" | "pix">("form");

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("escolhaDivinaUser");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setFormData((prev) => ({ ...prev, name: parsed.name || "" }));
    }
  }, []);

  // Mutation para criar pagamento PIX
  const createPixMutation = trpc.payment.createPix.useMutation({
    onSuccess: (data) => {
      setPixData({
        qrCode: data.pix.qrCode,
        copyPaste: data.pix.copyPaste,
        transactionId: data.transactionId,
      });
      setStep("pix");
    },
    onError: (error) => {
      toast.error("Erro ao gerar PIX: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.cpf) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    createPixMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document: formData.cpf.replace(/\D/g, ""),
    });
  };

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  return (
    <div className="min-h-screen bg-celestial-gradient relative overflow-hidden">
      <FloatingParticles className="opacity-30" />
      
      {/* Divine Light Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#d4af37]/20 via-[#d4af37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="container max-w-4xl py-8 px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <AngelWings className="w-40 mx-auto animate-pulse-gold" />
          <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mt-4">
            Unção Sagrada
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete seu pedido e receba a bênção do Arcanjo Miguel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Form or PIX */}
          <div className="card-celestial p-6 md:p-8">
            {step === "form" ? (
              <>
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#d4af37]" />
                  Dados para Pagamento
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                      className="border-[#d4af37]/30 focus:border-[#d4af37]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="border-[#d4af37]/30 focus:border-[#d4af37]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                      placeholder="(11) 99999-9999"
                      className="border-[#d4af37]/30 focus:border-[#d4af37]"
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                      className="border-[#d4af37]/30 focus:border-[#d4af37]"
                      maxLength={14}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createPixMutation.isPending}
                    className="btn-divine w-full mt-6"
                  >
                    {createPixMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Gerando PIX...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5 mr-2" />
                        GERAR PIX - R$ 29,90
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#d4af37]" />
                  Pague com PIX
                </h2>

                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl border border-[#d4af37]/30 text-center flex justify-center">
                    {pixData?.qrCode ? (
                      <img
                        src={pixData.qrCode}
                        alt="QR Code PIX"
                        className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
                        onError={() => console.error('QR Code image failed to load')}
                      />
                    ) : (
                      <div className="w-40 h-40 sm:w-48 sm:h-48 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 flex-col gap-2">
                        <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Gerando QR Code...</p>
                      </div>
                    )}
                  </div>

                  {/* Copy Paste */}
                  <div className="space-y-2">
                    <Label>Código PIX Copia e Cola</Label>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <Input
                        value={pixData?.copyPaste || ""}
                        readOnly
                        className="font-mono text-xs overflow-x-auto"
                      />
                      <Button
                        type="button"
                        onClick={handleCopyPix}
                        variant="outline"
                        className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 shrink-0 w-full sm:w-auto"
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-[#d4af37]/10 rounded-xl p-4 space-y-2">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Como pagar:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Abra o app do seu banco</li>
                      <li>Escolha pagar com PIX</li>
                      <li>Escaneie o QR Code ou cole o código</li>
                      <li>Confirme o pagamento</li>
                    </ol>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Após o pagamento, você receberá acesso imediato ao Manuscrito Sagrado
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="card-celestial p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Resumo do Pedido
              </h2>

              <div className="flex items-center gap-4 pb-4 border-b border-[#d4af37]/20">
                <div className="w-20 h-20 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
                  <DivineStar className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Unção Sagrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Manuscrito do Arcanjo Miguel
                  </p>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">R$ 97,00</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto especial</span>
                  <span>- R$ 67,10</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-gold-gradient">R$ 29,90</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="card-celestial p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-foreground">Compra Segura</p>
                  <p className="text-sm text-muted-foreground">
                    Seus dados estão protegidos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#d4af37]" />
                <div>
                  <p className="font-semibold text-foreground">Acesso Imediato</p>
                  <p className="text-sm text-muted-foreground">
                    Receba assim que o pagamento for confirmado
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Halo className="w-8 h-4 text-[#d4af37]" />
                <div>
                  <p className="font-semibold text-foreground">Garantia de 7 Dias</p>
                  <p className="text-sm text-muted-foreground">
                    Satisfação garantida ou seu dinheiro de volta
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="card-celestial p-6">
              <blockquote className="italic text-muted-foreground border-l-4 border-[#d4af37] pl-4">
                "Depois de receber o manuscrito, minha vida mudou completamente. 
                As dívidas foram quitadas e encontrei paz interior."
              </blockquote>
              <p className="mt-2 text-sm font-semibold text-foreground">
                — Maria S., São Paulo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

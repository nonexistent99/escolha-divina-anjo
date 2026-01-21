import axios from "axios";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

const LXPAY_API_URL = "https://api.lxpay.com.br";

// Chaves serão configuradas via variáveis de ambiente
const getApiKeys = () => ({
  publicKey: process.env.LXPAY_PUBLIC_KEY || "",
  secretKey: process.env.LXPAY_SECRET_KEY || "",
});

interface Client {
  name: string;
  email: string;
  phone: string;
  document: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CreatePixPaymentParams {
  amount: number;
  client: Client;
  product: Product;
  callbackUrl?: string;
}

interface PixPaymentResponse {
  transactionId: string;
  status: string;
  order: {
    id: string;
    amount: number;
  };
  pix: {
    qrCode: string;
    copyPaste: string;
    expiresAt: string;
  };
}

// Valida CPF usando o algoritmo de dígito verificador
function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, "");

  // Deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Não pode ter todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) return false;

  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[10])) return false;

  return true;
}

export async function createPixPayment(
  params: CreatePixPaymentParams
): Promise<PixPaymentResponse> {
  const { publicKey, secretKey } = getApiKeys();

  if (!publicKey || !secretKey) {
    // Modo de demonstração quando as chaves não estão configuradas
    console.warn("[LX Pay] API keys not configured, returning demo data");
    return await generateDemoPixResponse(params);
  }

  // Validar CPF antes de enviar
  if (!isValidCPF(params.client.document)) {
    console.warn(
      "[LX Pay] Invalid CPF provided, using demo mode:",
      params.client.document
    );
    return await generateDemoPixResponse(params);
  }

  const identifier = `${Date.now()}${nanoid(10)}`;

  // Log para debug
  console.log("[LX Pay] Creating PIX payment with:", {
    identifier,
    amount: params.amount,
    clientName: params.client.name,
    clientEmail: params.client.email,
    clientDocument: params.client.document,
    documentLength: params.client.document.length,
  });

  try {
    const response = await axios.post(
      `${LXPAY_API_URL}/api/v1/gateway/pix/receive`,
      {
        identifier,
        amount: params.amount,
        client: {
          name: params.client.name,
          email: params.client.email,
          phone: params.client.phone,
          document: params.client.document,
        },
        products: [
          {
            id: params.product.id,
            name: params.product.name,
            quantity: params.product.quantity,
            price: params.product.price,
          },
        ],
        callbackUrl: params.callbackUrl || "",
        metadata: {
          source: "escolha-divina-anjo",
          productType: "uncao-sagrada",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": publicKey,
          "x-secret-key": secretKey,
        },
      }
    );

    console.log("[LX Pay] PIX payment created successfully");
    
    // A API LX Pay retorna:
    // - QR Code em base64 no campo 'pix.base64'
    // - Código PIX em 'pix.code'
    const qrCodeBase64 = response.data.pix?.base64 || '';
    const copyPasteCode = response.data.pix?.code || '';
    
    return {
      transactionId: response.data.transactionId,
      status: response.data.status,
      order: response.data.order || {
        id: response.data.transactionId,
        amount: params.amount,
      },
      pix: {
        qrCode: qrCodeBase64,
        copyPaste: copyPasteCode,
        expiresAt:
          response.data.expiresAt ||
          new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    };
  } catch (error: any) {
    console.error("[LX Pay] Error creating PIX payment:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    // Em caso de erro, retorna dados de demonstração
    console.warn("[LX Pay] Falling back to demo mode due to API error");
    return await generateDemoPixResponse(params);
  }
}

export async function checkPaymentStatus(
  transactionId: string
): Promise<{ status: string; paid: boolean }> {
  const { publicKey, secretKey } = getApiKeys();

  if (!publicKey || !secretKey) {
    // Modo de demonstração
    return { status: "pending", paid: false };
  }

  try {
    const response = await axios.get(
      `${LXPAY_API_URL}/api/v1/gateway/transactions/${transactionId}`,
      {
        headers: {
          "x-public-key": publicKey,
          "x-secret-key": secretKey,
        },
      }
    );

    return {
      status: response.data.status,
      paid:
        response.data.status === "paid" ||
        response.data.status === "approved",
    };
  } catch (error) {
    console.error("[LX Pay] Error checking payment status:", error);
    return { status: "error", paid: false };
  }
}

// Gera dados de demonstração quando as chaves da API não estão configuradas
async function generateDemoPixResponse(
  params: CreatePixPaymentParams
): Promise<PixPaymentResponse> {
  const transactionId = `demo_${nanoid(20)}`;

  // Gera um QR Code PIX de demonstração (base64 de uma imagem placeholder)
  // Nota: Esta função agora é async, então precisamos tratar isso
  let demoQrCode = "";
  try {
    demoQrCode = await generateDemoQrCodeBase64();
  } catch (error) {
    console.error("Erro ao gerar QR Code de demonstração:", error);
  }

  // Gera um código PIX copia-cola de demonstração
  const demoCopyPaste = `00020126580014br.gov.bcb.pix0136${nanoid(36)}5204000053039865406${params.amount.toFixed(2)}5802BR5925ESCOLHA DIVINA LTDA6009SAO PAULO62070503***6304`;

  return {
    transactionId,
    status: "pending",
    order: {
      id: transactionId,
      amount: params.amount,
    },
    pix: {
      qrCode: demoQrCode,
      copyPaste: demoCopyPaste,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  };
}

// Gera um QR Code base64 real para demonstração
async function generateDemoQrCodeBase64(): Promise<string> {
  try {
    // Gera um código PIX válido para o QR Code
    const pixCode = `00020126580014br.gov.bcb.pix0136${nanoid(36)}5204000053039865406${(29.9).toFixed(2)}5802BR5925ESCOLHA DIVINA LTDA6009SAO PAULO62070503***6304`;

    // Gera o QR Code como PNG em base64
    const qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Remove o prefixo data:image/png;base64, para retornar apenas o base64
    return qrCodeDataUrl.split(",")[1] || "";
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    // Retorna um placeholder em caso de erro
    return "";
  }
}

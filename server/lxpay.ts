import axios from "axios";
import { nanoid } from "nanoid";

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

export async function createPixPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
  const { publicKey, secretKey } = getApiKeys();
  
  if (!publicKey || !secretKey) {
    // Modo de demonstração quando as chaves não estão configuradas
    console.warn("[LX Pay] API keys not configured, returning demo data");
    return generateDemoPixResponse(params);
  }

  const identifier = `${Date.now()}${nanoid(10)}`;
  
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

    return {
      transactionId: response.data.transactionId,
      status: response.data.status,
      order: response.data.order,
      pix: {
        qrCode: response.data.pix.qrCode,
        copyPaste: response.data.pix.copyPaste,
        expiresAt: response.data.pix.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    };
  } catch (error) {
    console.error("[LX Pay] Error creating PIX payment:", error);
    // Em caso de erro, retorna dados de demonstração
    console.warn("[LX Pay] Falling back to demo mode due to API error");
    return generateDemoPixResponse(params);
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<{ status: string; paid: boolean }> {
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
      paid: response.data.status === "paid" || response.data.status === "approved",
    };
  } catch (error) {
    console.error("[LX Pay] Error checking payment status:", error);
    return { status: "error", paid: false };
  }
}

// Gera dados de demonstração quando as chaves da API não estão configuradas
function generateDemoPixResponse(params: CreatePixPaymentParams): PixPaymentResponse {
  const transactionId = `demo_${nanoid(20)}`;
  
  // Gera um QR Code PIX de demonstração (base64 de uma imagem placeholder)
  const demoQrCode = generateDemoQrCodeBase64();
  
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

// Gera um QR Code base64 simples para demonstração
function generateDemoQrCodeBase64(): string {
  // Este é um placeholder - em produção, o QR Code real virá da API
  // Retorna um SVG simples convertido para base64
  const svgQrCode = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="40" height="40" fill="black"/>
      <rect x="140" y="20" width="40" height="40" fill="black"/>
      <rect x="20" y="140" width="40" height="40" fill="black"/>
      <rect x="80" y="80" width="40" height="40" fill="black"/>
      <rect x="30" y="30" width="20" height="20" fill="white"/>
      <rect x="150" y="30" width="20" height="20" fill="white"/>
      <rect x="30" y="150" width="20" height="20" fill="white"/>
      <rect x="35" y="35" width="10" height="10" fill="black"/>
      <rect x="155" y="35" width="10" height="10" fill="black"/>
      <rect x="35" y="155" width="10" height="10" fill="black"/>
      <text x="100" y="195" text-anchor="middle" font-size="10" fill="#666">DEMO PIX</text>
    </svg>
  `;
  
  return Buffer.from(svgQrCode).toString("base64");
}

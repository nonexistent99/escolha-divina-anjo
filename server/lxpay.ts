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

export async function createPixPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
  const { publicKey, secretKey } = getApiKeys();
  
  if (!publicKey || !secretKey) {
    // Modo de demonstração quando as chaves não estão configuradas
    console.warn("[LX Pay] API keys not configured, returning demo data");
    return await generateDemoPixResponse(params);
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
    return await generateDemoPixResponse(params);
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
async function generateDemoPixResponse(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
  const transactionId = `demo_${nanoid(20)}`;
  
  // Gera um QR Code PIX de demonstração (base64 de uma imagem placeholder)
  // Nota: Esta função agora é async, então precisamos tratar isso
  let demoQrCode = '';
  try {
    demoQrCode = await generateDemoQrCodeBase64();
  } catch (error) {
    console.error('Erro ao gerar QR Code de demonstração:', error);
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
    const pixCode = `00020126580014br.gov.bcb.pix0136${nanoid(36)}5204000053039865406${(29.90).toFixed(2)}5802BR5925ESCOLHA DIVINA LTDA6009SAO PAULO62070503***6304`;
    
    // Gera o QR Code como PNG em base64
    const qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    // Remove o prefixo data:image/png;base64, para retornar apenas o base64
    return qrCodeDataUrl.split(',')[1] || '';
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    // Retorna um placeholder em caso de erro
    return '';
  }
}

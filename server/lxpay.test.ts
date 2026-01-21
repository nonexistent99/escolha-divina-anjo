import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Mock das variáveis de ambiente antes de importar o módulo
const originalEnv = process.env;

describe("LX Pay Integration", () => {
  beforeEach(() => {
    // Limpa as variáveis de ambiente antes de cada teste
    process.env = { ...originalEnv };
    delete process.env.LXPAY_PUBLIC_KEY;
    delete process.env.LXPAY_SECRET_KEY;
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("createPixPayment", () => {
    it("should return demo data when API keys are not configured", async () => {
      // Importa o módulo após limpar as variáveis de ambiente
      const { createPixPayment } = await import("./lxpay.js");
      
      const result = await createPixPayment({
        amount: 29.90,
        client: {
          name: "João da Silva",
          email: "joao@email.com",
          phone: "11999999999",
          document: "12345678901",
        },
        product: {
          id: "uncao-sagrada",
          name: "Unção Sagrada",
          quantity: 1,
          price: 29.90,
        },
      });

      expect(result).toBeDefined();
      expect(result.transactionId).toMatch(/^demo_/);
      expect(result.status).toBe("pending");
      expect(result.order.amount).toBe(29.90);
      expect(result.pix.qrCode).toBeDefined();
      expect(result.pix.copyPaste).toBeDefined();
      expect(result.pix.expiresAt).toBeDefined();
    });

    it("should generate valid PIX copy-paste code format", async () => {
      const { createPixPayment } = await import("./lxpay.js");
      
      const result = await createPixPayment({
        amount: 29.90,
        client: {
          name: "Maria Santos",
          email: "maria@email.com",
          phone: "11988888888",
          document: "98765432100",
        },
        product: {
          id: "uncao-sagrada",
          name: "Unção Sagrada",
          quantity: 1,
          price: 29.90,
        },
      });

      // Verifica se o código PIX começa com o padrão correto
      expect(result.pix.copyPaste).toMatch(/^00020126/);
      expect(result.pix.copyPaste).toContain("br.gov.bcb.pix");
    });

    it("should include correct amount in response", async () => {
      const { createPixPayment } = await import("./lxpay.js");
      
      const amount = 29.90;
      const result = await createPixPayment({
        amount,
        client: {
          name: "Test User",
          email: "test@email.com",
          phone: "",
          document: "11111111111",
        },
        product: {
          id: "test",
          name: "Test Product",
          quantity: 1,
          price: amount,
        },
      });

      expect(result.order.amount).toBe(amount);
    });
  });

  describe("checkPaymentStatus", () => {
    it("should return pending status for demo transactions", async () => {
      const { checkPaymentStatus } = await import("./lxpay.js");
      
      const result = await checkPaymentStatus("demo_test123");

      expect(result).toBeDefined();
      expect(result.status).toBe("pending");
      expect(result.paid).toBe(false);
    });
  });
});

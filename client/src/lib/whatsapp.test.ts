import { describe, expect, it } from "vitest";
import { WHATSAPP_MESSAGES, WHATSAPP_NUMBER, whatsappHref } from "./whatsapp";

describe("whatsappHref", () => {
  it("uses the configured business number and URL-encodes an Arabic contextual message", () => {
    const href = whatsappHref(WHATSAPP_MESSAGES.ecommerce);

    expect(href).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
    expect(decodeURIComponent(href.split("text=")[1] ?? "")).toBe(WHATSAPP_MESSAGES.ecommerce);
  });

  it("keeps each core conversion message distinct", () => {
    expect(new Set(Object.values(WHATSAPP_MESSAGES)).size).toBe(Object.keys(WHATSAPP_MESSAGES).length);
  });
});

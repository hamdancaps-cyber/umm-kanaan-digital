/** Live Storefront cart smoke test: no order is placed and only an ephemeral cart is created. */
import { describe, expect, it } from "vitest";
import { createCart, isShopifyConfigured, listProducts, removeCartLines, updateCartLines } from "./_core/shopify";

describe("shopify live cart smoke", () => {
  it.skipIf(!isShopifyConfigured())("creates, updates, and clears an ephemeral cart without checkout", async () => {
    const products = await listProducts({ first: 5 });
    const variant = products.flatMap(product => product.variants).find(item => item.availableForSale);
    expect(variant).toBeDefined();
    if (!variant) return;

    const created = await createCart([{ variantId: variant.id, quantity: 1 }]);
    expect(created.checkoutUrl).toMatch(/^https:\/\//);
    expect(created.items).toHaveLength(1);
    expect(created.items[0]?.quantity).toBe(1);

    const lineId = created.items[0]?.lineId;
    expect(lineId).toBeDefined();
    if (!lineId) return;

    const updated = await updateCartLines(created.id, [{ lineId, quantity: 2 }]);
    expect(updated.items[0]?.quantity).toBe(2);

    const cleared = await removeCartLines(created.id, [lineId]);
    expect(cleared.items).toHaveLength(0);
  }, 30_000);
});

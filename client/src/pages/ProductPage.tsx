/** Product detail page with transparent purchase information and Shopify cart action. */
import { SiteChrome } from "@/components/SiteChrome";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileDown, Heart, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useRoute } from "wouter";
import { ProductCoverArt } from "./ShopPage";

export default function ProductPage() {
  const [, params] = useRoute("/shop/:handle");
  const handle = params?.handle ?? "";
  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery({ handle }, { enabled: Boolean(handle) });
  const { addItem, loading } = useCart();
  const track = trpc.platform.analytics.track.useMutation();
  const favorite = trpc.platform.account.saveFavorite.useMutation();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!product) return;
    track.mutate({ eventType: "product_view", source: "product_page", metaJson: JSON.stringify({ handle: product.handle }) });
  }, [product?.handle]);
  if (isLoading) return <SiteChrome><main className="product-loading">جاري تحميل المنتج...</main></SiteChrome>;
  if (!product) return <SiteChrome><main className="product-loading">لم يتم العثور على هذا المنتج.</main></SiteChrome>;
  const variant = product.variants[0];
  const hasInvalidGeneratedAsset = product.images[0]?.url?.includes("hamdan-digital-product-phone-guide") || !product.images[0]?.url;
  return <SiteChrome><main className="product-page"><div className="hamdan-container product-layout"><div className="product-gallery">{hasInvalidGeneratedAsset ? <ProductCoverArt large /> : <img src={product.images[0].url} alt={product.images[0]?.altText || product.title} />}</div><article className="product-info"><span>{product.productType || "منتج رقمي"}</span><h1 className="hamdan-display">{product.title}</h1><p>{product.description || "مورد رقمي من منصة أم كنعان الرقمية يساعدك على تنظيم وتطبيق خطوة عملية."}</p><strong className="product-price">{formatMoney(product.priceRange.min)}</strong><div className="product-actions"><button className="button-primary product-buy" disabled={!variant?.availableForSale || loading} onClick={() => variant && addItem(variant.id)}><ShoppingBag size={18} /> أضف للسلة</button><button className="favorite-button" onClick={() => isAuthenticated ? favorite.mutate({ entityType: "product", entityKey: product.handle }) : startLogin()}><Heart size={18} /> حفظ</button></div><small><FileDown size={14} /> راجع طريقة الوصول والتنزيل الموضحة في صفحة الدفع قبل إتمام الشراء.</small></article></div><section className="product-details"><div className="hamdan-container detail-grid"><article><CheckCircle2 size={19} /><h2>ما المشكلة التي يساعد على حلها؟</h2><p>يساعدك المنتج على تنظيم خطوة عملية بدل الاعتماد على معلومات متفرقة أو البدء دون خطة.</p></article><article><CheckCircle2 size={19} /><h2>لمن يناسب؟</h2><p>للمبتدئ أو صاحب المشروع الصغير الذي يريد موردًا واضحًا يمكن استخدامه وتكييفه.</p></article><article><CheckCircle2 size={19} /><h2>ماذا ستحصل عليه؟</h2><p>محتوى أو قالب رقمي وفق الوصف المعلن للمنتج، مع توضيح ما يشمله قبل الشراء.</p></article><article><CheckCircle2 size={19} /><h2>كيف أستخدمه؟</h2><p>ابدأ بالخطوة الأولى في المورد، ثم خصصه لهدفك وسياقك بدل نسخه دون فهم.</p></article></div></section></main></SiteChrome>;
}

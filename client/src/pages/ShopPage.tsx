/** Shopify-backed digital product catalogue using normalized commerce data only. */
import { SiteChrome } from "@/components/SiteChrome";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";
import type { Product } from "@shared/commerce/types";
import { ArrowLeft, FileDown, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, loading } = useCart();
  const variant = product.variants[0];
  const hasInvalidGeneratedAsset = product.images[0]?.url?.endsWith(".svg") || !product.images[0]?.url;
  return <article className="product-card"><Link href={`/shop/${product.handle}`} className="product-image">{hasInvalidGeneratedAsset ? <ProductCoverArt /> : <img src={product.images[0].url} alt={product.images[0]?.altText || product.title} />}</Link><div className="product-meta"><span>{product.productType || "منتج رقمي"}</span><h2>{product.title}</h2><p>{product.description || "مورد رقمي يساعدك على تنظيم خطوة عملية في مسارك."}</p></div><div className="product-bottom"><strong>{formatMoney(product.priceRange.min)}</strong><button className="buy-button" disabled={!variant?.availableForSale || loading} onClick={() => variant && addItem(variant.id)}>{variant?.availableForSale ? <><ShoppingBag size={16} /> أضف للسلة</> : "غير متاح"}</button></div></article>;
}

export function ProductCoverArt({ large = false }: { large?: boolean }) {
  return <div className={`product-cover-art${large ? " product-cover-art-large" : ""}`} aria-label="رسم غلاف دليل بداية العمل من الهاتف"><span className="cover-label">UMK / START</span><div className="cover-phone"><i /><b /><em /></div><div className="cover-route"><span /><span /><span /></div><strong>هاتف<br />→ مهارة<br />→ خطوة</strong></div>;
}

export default function ShopPage() {
  const { data: products = [], isLoading, error } = trpc.commerce.products.list.useQuery({ first: 12 });
  return <SiteChrome><main><section className="page-hero shop-hero"><div className="hamdan-container"><span className="eyebrow">متجر الموارد الرقمية</span><h1 className="hamdan-display">موارد صغيرة تساعدك على تطبيق خطوة كبيرة.</h1><p>كل منتج رقمي يوضح المشكلة التي يساعدك على حلها، لمن يناسبه، وما الذي ستحصل عليه وكيف تستخدمه قبل الإضافة إلى السلة.</p></div></section><section className="page-section"><div className="hamdan-container"><div className="store-promise"><FileDown size={21} /><p>بعد إتمام الشراء من بوابة الدفع، يُدار الوصول والتنزيل وفق إعدادات المتجر والمنتج الرقمي.</p></div>{isLoading ? <div className="loading-grid"><span /><span /></div> : error ? <div className="shop-message"><h2>المتجر يُجهّز الآن.</h2><p>تُراجع المنتجات وإعدادات البيع قبل إتاحتها. يمكنك العودة لاحقًا أو التواصل مع أم كنعان للاستفسار عن الموارد المناسبة.</p></div> : products.length ? <div className="shop-grid">{products.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div> : <div className="shop-message"><h2>يتم تجهيز أول موارد المنصة.</h2><p>سيتوفر هنا دليل البداية من الهاتف وقالب خطة محتوى ومنتجات رقمية أخرى بعد مراجعة تفاصيلها وتفعيلها.</p></div>}</div></section></main></SiteChrome>;
}

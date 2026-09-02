import { SiteChrome } from "@/components/SiteChrome";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/whatsapp";
import { ArrowLeft, MessageCircle, Package, ShoppingBag, Store, UsersRound } from "lucide-react";

const commerceJourney = [
  ["Product", "حدّد منتجًا أو خدمة تحل مشكلة حقيقية وتستطيع شرح قيمتها بوضوح.", Package],
  ["Store", "اعرض المنتج وتجربته وسياساته بطريقة منظمة قبل طلب أي شراء.", Store],
  ["Marketing", "تعلم كيف تصل إلى جمهور مناسب بمحتوى ورسالة وتجربة متسقة.", ShoppingBag],
  ["Customer", "افهم ما يحتاجه العميل قبل وبعد الشراء، ولا تعتبر التحويل نهاية العلاقة.", UsersRound],
  ["Business Development", "راجع ما تعلمته وطوّر المنتج والتسويق والخدمة تدريجيًا.", ArrowLeft],
] as const;

export default function EcommercePage() {
  return <SiteChrome><main><section className="page-hero"><div className="hamdan-container"><span className="eyebrow">E-Commerce Education</span><h1 className="hamdan-display">التجارة الإلكترونية ليست متجرًا فقط.</h1><p>هي رحلة من المنتج إلى المتجر والتسويق والعميل والمبيعات وتطوير العمل. نعرضها هنا كمجال تتعلمه وتطبقه، لا كدعوة لشراء منتج.</p><a className="button-primary page-cta" target="_blank" rel="noreferrer" href={whatsappHref(WHATSAPP_MESSAGES.ecommerce)}><MessageCircle size={18} /> اسأل عن بداية التجارة الإلكترونية</a></div></section><section className="page-section"><div className="hamdan-container"><div className="section-heading"><span className="eyebrow">رحلة التجارة</span><h2 className="hamdan-display">من الفكرة إلى عمل يتعلم من السوق.</h2><p>ابدأ بالفهم والتطبيق: لا تنشئ متجرًا أو تلتزم بتكلفة قبل أن تعرف المنتج والجمهور وطريقة الوصول وخدمة العميل.</p></div><div className="commerce-journey">{commerceJourney.map(([title, text, Icon], index) => <article key={title}><span>0{index + 1}</span><Icon size={24} /><h2>{title}</h2><p>{text}</p></article>)}</div></div></section><section className="page-section section-ink"><div className="hamdan-container"><div className="section-heading"><span className="eyebrow">قبل أي التزام</span><h2 className="hamdan-display">افهم التكلفة والأداة والسياسة والعميل.</h2><p>أي منتج أو برنامج أو رسوم مرتبطة بالبيع يجب أن تُشرح بوضوح قبل اتخاذ قرار مالي. لا توجد مبيعات أو أرباح مضمونة.</p></div></div></section></main></SiteChrome>;
}

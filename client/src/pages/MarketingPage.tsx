import { SiteChrome } from "@/components/SiteChrome";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/whatsapp";
import { BarChart3, MessageCircle, PenTool, Target, UsersRound } from "lucide-react";

const marketingSteps = [
  ["افهم الجمهور", "ابدأ بالمشكلة التي تحلها والناس الذين يحتاجون إلى هذا الحل.", UsersRound],
  ["اصنع محتوى مفيدًا", "حوّل المعرفة إلى محتوى واضح ومنتظم يمكن تحسينه من الهاتف.", PenTool],
  ["اختر القناة", "افهم كيف تستخدم المنصات والقنوات الرقمية لإيصال رسالتك دون تشتيت.", Target],
  ["قِس وطوّر", "راقب التفاعل والتحويل، ثم عدّل رسالتك وتجربتك خطوة بخطوة.", BarChart3],
] as const;

export default function MarketingPage() {
  return <SiteChrome><main><section className="page-hero page-hero-ink"><div className="hamdan-container"><span className="eyebrow">Digital Marketing</span><h1 className="hamdan-display">التسويق الإلكتروني يبدأ بفهم الناس، لا بمجرد النشر.</h1><p>تعلّم كيف تربط الجمهور والمحتوى والقنوات والتحويل في رحلة عملية، بدل البحث عن اختصار أو وعود سريعة.</p><a className="button-primary page-cta" target="_blank" rel="noreferrer" href={whatsappHref(WHATSAPP_MESSAGES.marketing)}><MessageCircle size={18} /> اسأل أم كنعان عن مسار التسويق</a></div></section><section className="page-section"><div className="hamdan-container"><div className="section-heading"><span className="eyebrow">كيف يعمل التسويق؟</span><h2 className="hamdan-display">جمهور → رسالة → محتوى → تحويل → تحسين.</h2><p>لا تحتاج إلى أن تبدأ بكل المنصات. ابدأ بفهم هدف واحد، ورسالة واحدة، وتطبيق صغير قابل للقياس.</p></div><div className="core-learning-grid">{marketingSteps.map(([title, text, Icon], index) => <article className="core-learning-card" key={title}><span>0{index + 1}</span><Icon size={24} /><h2>{title}</h2><p>{text}</p></article>)}</div></div></section><section className="page-section section-soft"><div className="hamdan-container transparency-grid"><article><h2>ما ستتعلمه</h2><p>أساسيات الجمهور، صناعة المحتوى، Social Media Marketing، الرسالة، والتحويل بصورة تناسب المبتدئ.</p></article><article><h2>ما لا نعد به</h2><p>لا نعد بمتابعين أو مبيعات أو دخل مضمون. النتائج ترتبط بالقيمة والتطبيق والسوق والاستمرار.</p></article><article><h2>خطوتك التالية</h2><p>ابدأ بالدورة التأسيسية أو تواصل مع أم كنعان لتحديد ما يناسب وقتك وهدفك الحالي.</p></article></div></section></main></SiteChrome>;
}

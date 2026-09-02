/** Public catalogue of guided skill paths for first-time learners. */
import { SiteChrome } from "@/components/SiteChrome";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/whatsapp";
import { ArrowLeft, Bot, BriefcaseBusiness, Compass, FileText, MessageCircle, PenTool, Target } from "lucide-react";
import { Link } from "wouter";

const pathCards = [
  ["بداية العمل الرقمي", "لمن لديه هاتف وإنترنت ورغبة في التعلّم، لكنه يحتاج خريطة بداية بسيطة.", "ستتعرف على المجالات وتختار مهارة أولى وتنفذ تطبيقًا صغيرًا.", Compass],
  ["التسويق الإلكتروني", "لمن يريد فهم الجمهور والمحتوى والقنوات التي توصل الرسالة بوضوح.", "ستبدأ بالمفاهيم، ثم تنتقل إلى تحليل بسيط وخطة تطبيق.", Target],
  ["المنتجات الرقمية", "لمن يريد تحويل فكرة أو معرفة إلى ملف أو قالب أو دليل يقدّم قيمة.", "ستفهم الفكرة والعميل والمحتوى والتسعير والتسويق بمسار متدرج.", FileText],
  ["صناعة المحتوى", "لمن يريد بناء عادة نشر مفيدة ومنظمة من الهاتف.", "ستتعلم فكرة المحتوى وتنظيمه واختبار ما يفيد جمهورك.", PenTool],
  ["الذكاء الاصطناعي العملي", "لمن يريد استخدام أدوات AI لرفع الإنتاجية والمحتوى والتسويق.", "ستركز على الاستخدام العملي المسؤول بدل الاعتماد على نتائج جاهزة.", Bot],
  ["العمل الحر", "لمن يريد ترتيب مهارة وملف عملي وخدمة يمكن تقديمها بوضوح.", "ستبني أساسًا من المهارة والتطبيق والتواصل مع العملاء المحتملين.", BriefcaseBusiness],
] as const;

export default function PathsPage() {
  return <SiteChrome><main><section className="page-hero"><div className="hamdan-container"><span className="eyebrow">اختر البداية لا النهاية</span><h1 className="hamdan-display">كل مهارة تبدأ بمسار واضح.</h1><p>اختر المسار الذي يعكس هدفك الحالي. ستعرف ما الذي ستتعلمه، ولمن يناسبك، وكيف يمكن أن تبدأ بتطبيق عملي.</p></div></section><section className="page-section"><div className="hamdan-container"><div className="road-intro"><span>01</span><p>ابدأ من هدف واحد. لا تُحمّل نفسك كل المجالات؛ المسار الجيد يشرح لك ما ستتعلمه الآن وما ستؤجله للخطوة التالية.</p></div><div className="catalog-grid">{pathCards.map(([title, audience, outcome, Icon], index) => <article className="catalog-card" key={title}><span className="catalog-step">0{index + 1}</span><span className="catalog-icon"><Icon size={22} /></span><h2>{title}</h2><p>{audience}</p><div className="catalog-outcome"><strong>ما الذي ستخرج به؟</strong><span>{outcome}</span></div><Link href="/how-it-works" className="catalog-link">كيف أبدأ هذا المسار؟ <ArrowLeft size={16} /></Link></article>)}</div><div className="split-cta"><Link className="button-secondary" href="/academy">ابدأ من الأكاديمية <ArrowLeft size={17} /></Link><a className="button-primary" target="_blank" rel="noreferrer" href={whatsappHref(WHATSAPP_MESSAGES.generalPath)}><MessageCircle size={18} /> ناقش مسارك مع أم كنعان</a></div></div></section></main></SiteChrome>;
}

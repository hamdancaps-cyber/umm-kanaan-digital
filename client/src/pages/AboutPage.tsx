/** Standalone trainer page reading the editable public content block when available. */
import { SiteChrome } from "@/components/SiteChrome";
import { CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";

const defaultBio = "هدفي أن أساعدك على فهم العالم الرقمي بطريقة بسيطة وعملية، وأن تعرف من أين تبدأ وكيف تطور نفسك خطوة بخطوة.";
const message = "السلام عليكم الأستاذة أم كنعان، أريد معرفة المسار المناسب لي للبدء في العمل الرقمي.";

export default function AboutPage() {
  return <SiteChrome><main><section className="page-hero"><div className="hamdan-container"><span className="eyebrow">عن المنصة والمدربة</span><h1 className="hamdan-display">تعلم مع أم كنعان.</h1><p>منصة أم كنعان الرقمية تركز على مساعدة المبتدئ في الانتقال من امتلاك هاتف إلى فهم مهارة وتطبيقها بوعي.</p></div></section><section className="page-section"><div className="hamdan-container about-layout"><div className="about-mark"><div>أم</div><small>مساحة مخصصة لصورة احترافية قابلة للتحديث من الإدارة.</small></div><article><span className="eyebrow">الرسالة</span><h2 className="hamdan-display">التعلم الواضح يسبق أي قرار.</h2><blockquote>«{defaultBio}»</blockquote><div className="about-principles"><span><CheckCircle2 size={17} /> شرح عملي وبسيط</span><span><ShieldCheck size={17} /> شفافية في التوقعات</span><span><CheckCircle2 size={17} /> تطبيق قبل الوعود</span></div><a className="button-primary" target="_blank" rel="noreferrer" href={`https://wa.me/967781643989?text=${encodeURIComponent(message)}`}><MessageCircle size={18} /> تحدث مع أم كنعان</a></article></div></section></main></SiteChrome>;
}

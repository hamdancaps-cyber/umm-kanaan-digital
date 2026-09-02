/** Academy overview with course-state UI ready to bind to database records. */
import { SiteChrome } from "@/components/SiteChrome";
import { WHATSAPP_MESSAGES, whatsappHref } from "@/lib/whatsapp";
import { BookOpen, CheckCircle2, ClipboardCheck, FileStack, MessageCircle, PlayCircle } from "lucide-react";
import { Link } from "wouter";

const courses = [
  ["المستوى 1: أساسيات العالم الرقمي", "المحتوى المتاح حاليًا للمبتدئ: فهم المجالات والمهارات والأدوات وخطوة التطبيق الأولى.", "متاح الآن", "مبتدئ"],
  ["المستوى 2: التسويق الإلكتروني", "فهم الجمهور والرسالة والمحتوى والقنوات وقياس ما يمكن تحسينه.", "قريبًا", "قيد الإعداد"],
  ["المستوى 3: التجارة الإلكترونية", "من المنتج إلى المتجر والتسويق والعميل وتطوير العمل.", "قريبًا", "قيد الإعداد"],
  ["المستوى 4: صناعة المحتوى", "نظام مبسط لتحويل الأفكار إلى محتوى يمكن إنتاجه واستمراره.", "قريبًا", "قيد الإعداد"],
  ["المستوى 5: الذكاء الاصطناعي العملي", "أدوات وأسئلة وطرق عمل تدعم الإنتاجية والمحتوى والتسويق.", "قريبًا", "قيد الإعداد"],
  ["المستوى 6: بناء وتطوير المشروع الرقمي", "تجميع المهارة والتطبيق والتسويق والقيمة في مشروع متدرج.", "قريبًا", "قيد الإعداد"],
] as const;

export default function AcademyPage() {
  return <SiteChrome><main><section className="page-hero academy-hero"><div className="hamdan-container"><span className="eyebrow">أكاديمية أم كنعان</span><h1 className="hamdan-display">تعلمها، جرّبها، ثم طوّرها.</h1><p>الأكاديمية تنظّم التعلم في دروس ومشاريع وملفات واختبارات؛ لتنتقل من المعرفة إلى تطبيق أوضح في كل مرحلة.</p><div className="hero-stats"><span><BookOpen size={16} /> دورات منظمة</span><span><ClipboardCheck size={16} /> اختبارات ذاتية</span><span><FileStack size={16} /> ملفات تطبيق</span></div></div></section><section className="page-section"><div className="hamdan-container"><div className="section-heading"><span className="eyebrow">مسار التعلم</span><h2 className="hamdan-display">دورات تناسب البداية ولا تفترض خبرة سابقة.</h2><p>تظهر الدروس والتقدم الخاص بك من حسابك بعد التسجيل والالتحاق بالدورة.</p></div><div className="course-grid">{courses.map(([title, description, lessons, level], i) => <article className="course-card" key={title}><div className="course-head"><span>0{i + 1}</span><PlayCircle size={21} /></div><span className="course-level">{level}</span><h2>{title}</h2><p>{description}</p><div className="course-foot"><span>{lessons}</span>{i === 0 ? <Link href="/academy/digital-work-foundations">استكشف المنهج</Link> : <button>يُضاف قريبًا</button>}</div></article>)}</div><div className="split-cta"><Link className="button-secondary" href="/paths">استكشف المسارات</Link><a className="button-primary" target="_blank" rel="noreferrer" href={whatsappHref(WHATSAPP_MESSAGES.academy)}><MessageCircle size={18} /> اسأل عن التدريب</a></div></div></section><section className="page-section section-soft"><div className="hamdan-container course-process"><div><span className="eyebrow">تعلم بالتطبيق</span><h2 className="hamdan-display">لا تشتري معلومات فقط.</h2><p>كل مسار يمكن أن يضم مشروعًا عمليًا: خطة تسويق، حساب تجاري، خطة محتوى، منتج رقمي، Portfolio أو تجربة AI لصناعة محتوى.</p></div><div className="process-points">{[["شاهد", "درس قصير وواضح"], ["نفّذ", "تمرين أو مشروع"], ["قيّم", "اختبار ذاتي"], ["تقدّم", "تتبع خطواتك"]].map(([title, text]) => <div key={title}><CheckCircle2 size={18} /><strong>{title}</strong><span>{text}</span></div>)}</div></div></section></main></SiteChrome>;
}

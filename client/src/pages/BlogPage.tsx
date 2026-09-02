/** SEO-oriented blog index that can later hydrate from published article records. */
import { SiteChrome } from "@/components/SiteChrome";
import { ArrowLeft, BookOpenText, Clock3, Search } from "lucide-react";

const posts = [
  ["كيف أبدأ العمل من الهاتف؟", "خطوات عملية تساعدك على الانتقال من استخدام الهاتف للاستهلاك إلى استخدامه لبناء مهارة.", "بداية العمل الرقمي", "6 دقائق"],
  ["كيف أتعلم التسويق الإلكتروني من الصفر؟", "ما الذي تتعلمه أولًا، وكيف تميّز بين المفاهيم الأساسية والتفاصيل التي يمكن تأجيلها.", "التسويق الإلكتروني", "8 دقائق"],
  ["ما هي المنتجات الرقمية؟", "فهم بسيط للمنتجات الرقمية والقيمة التي تقدمها والفرق بينها وبين الوعود السريعة.", "المنتجات الرقمية", "5 دقائق"],
  ["كيف أستخدم الذكاء الاصطناعي في العمل؟", "أفكار واقعية لاستخدام AI لتحسين التعلم والإنتاجية والمحتوى.", "الذكاء الاصطناعي", "7 دقائق"],
  ["كيف أصنع محتوى من الهاتف؟", "نظام خفيف لتحويل فكرة واحدة إلى محتوى واضح ومفيد للجمهور.", "صناعة المحتوى", "6 دقائق"],
  ["كيف أبدأ العمل الحر؟", "التركيز على المهارة والملف العملي والخدمة والتواصل بشكل مسؤول.", "العمل الحر", "9 دقائق"],
] as const;

export default function BlogPage() {
  return <SiteChrome><main><section className="page-hero"><div className="hamdan-container"><span className="eyebrow">مكتبة عملية</span><h1 className="hamdan-display">مدونة تساعدك على فهم البداية.</h1><p>شروحات عربية مبسطة حول العمل الرقمي والتسويق والمنتجات الرقمية والذكاء الاصطناعي وصناعة المحتوى.</p></div></section><section className="page-section"><div className="hamdan-container"><div className="blog-toolbar"><span><Search size={18} /> ابحث عن خطوة أو مهارة</span><small>تضاف المقالات المنشورة من لوحة التحكم.</small></div><div className="blog-grid">{posts.map(([title, excerpt, category, readTime], i) => <article className="blog-card" key={title}><div className="blog-index">0{i + 1}</div><span className="blog-category">{category}</span><h2>{title}</h2><p>{excerpt}</p><div><span><Clock3 size={14} /> {readTime}</span><button>اقرأ المقال <ArrowLeft size={15} /></button></div></article>)}</div><div className="blog-note"><BookOpenText size={21} /><p>المقالات التعليمية لا تعد بنتيجة أو دخل، بل تساعدك على فهم المهارة والخطوات التي تحتاجها لتطبيقها.</p></div></div></section></main></SiteChrome>;
}

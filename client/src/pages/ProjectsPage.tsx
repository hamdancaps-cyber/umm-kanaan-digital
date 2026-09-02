/** Applied project ideas that turn each digital path into a concrete beginner exercise. */
import { SiteChrome } from "@/components/SiteChrome";
import { CheckCircle2, ClipboardList, FileText, PenTool } from "lucide-react";

const projects = [["خطة محتوى لأسبوع", "اكتب هدفًا وجمهورًا وأربع أفكار محتوى من الهاتف.", PenTool], ["صفحة منتج رقمي أولية", "عرّف المشكلة والقيمة وما سيحصل عليه المستخدم وكيف يستفيد منه.", FileText], ["رسالة تسويقية واضحة", "صغ رسالة تصف الشخص والمشكلة والحل والدعوة التالية دون مبالغة.", ClipboardList]] as const;

export default function ProjectsPage() {
  return <SiteChrome><main><section className="page-hero page-hero-ink"><div className="hamdan-container"><span className="eyebrow">تطبيق قبل الوعود</span><h1 className="hamdan-display">مشاريع صغيرة تثبت ما تعلّمته.</h1><p>المشروع التطبيقي لا يضمن فرصة أو دخلًا، لكنه يعطيك ممارسة واضحة وقطعة عمل يمكنك مراجعتها وتحسينها مع الوقت.</p></div></section><section className="page-section"><div className="hamdan-container"><div className="project-grid">{projects.map(([title, description, Icon], index) => <article key={title}><span>0{index + 1}</span><Icon size={23} /><h2>{title}</h2><p>{description}</p><div><CheckCircle2 size={16} /> خصصه لهدفك، لا تنسخه بلا فهم.</div></article>)}</div></div></section></main></SiteChrome>;
}

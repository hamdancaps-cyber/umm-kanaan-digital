/** Consent-first free-resource catalogue backed by published lead-magnet records. */
import { SiteChrome } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { Download, FileText, ShieldCheck } from "lucide-react";

export default function FreeResourcesPage() {
  const resources = trpc.platform.public.leadMagnets.useQuery();
  return <SiteChrome><main><section className="page-hero"><div className="hamdan-container"><span className="eyebrow">ابدأ مجانًا</span><h1 className="hamdan-display">موارد منظمة لخطوتك الأولى.</h1><p>الدليل أو القالب لا يعد بنتيجة؛ هو مورد يساعدك على ترتيب تعلمك وتطبيقك. تطلب بيانات التواصل فقط عند إتاحة تنزيل يتطلب ذلك وبموافقة واضحة.</p></div></section><section className="page-section"><div className="hamdan-container"><div className="resource-grid">{resources.data?.map(resource => <article key={resource.id} className="resource-card"><span className="icon-chip"><FileText size={20} /></span><small>{resource.format}</small><h2>{resource.title}</h2><p>{resource.description}</p><button className="button-primary"><Download size={17} /> {resource.ctaLabel}</button></article>)}</div><div className="resource-notice"><ShieldCheck size={20} /><p>لن تُنسب إليك أي نتيجة أو سلوك شرائي مقابل تحميل مورد مجاني. راجع سياسة الخصوصية قبل مشاركة بياناتك.</p></div></div></section></main></SiteChrome>;
}

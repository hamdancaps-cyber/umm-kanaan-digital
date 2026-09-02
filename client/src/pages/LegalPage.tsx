/** Plain-language policy and disclosure pages, marked for owner review before publication. */
import { SiteChrome } from "@/components/SiteChrome";
import { AlertTriangle, FileText, ShieldCheck } from "lucide-react";
import { useRoute } from "wouter";

const policyContent: Record<string, { eyebrow: string; title: string; icon: typeof ShieldCheck; sections: Array<[string, string]> }> = {
  privacy: { eyebrow: "مسودة سياسة", title: "سياسة الخصوصية", icon: ShieldCheck, sections: [["ما الذي قد نجمعه؟", "قد نجمع بيانات تسجيل الحساب والمعلومات التي يرسلها المستخدم طوعًا للحصول على مورد مجاني أو للتواصل، مثل الاسم والبريد الإلكتروني."], ["كيف نستخدم البيانات؟", "تُستخدم البيانات لتقديم الخدمة، إدارة الحساب والموارد، الرد على الاستفسارات، وتحسين المنصة بموافقتك عندما تكون مطلوبة."], ["التحكم في البيانات", "يمكن للمستخدم طلب تحديث بياناته أو الاستفسار عن استخدامها عبر قناة التواصل الرسمية. يجب مراجعة هذه السياسة وتحديث تفاصيل مقدمي الخدمة قبل الإطلاق العام."]]},
  terms: { eyebrow: "مسودة شروط", title: "الشروط والأحكام", icon: FileText, sections: [["طبيعة الخدمة", "منصة أم كنعان الرقمية منصة تعليمية وموارد رقمية. المحتوى يهدف إلى التعلم وتطوير المهارات، وليس عرضًا لوظيفة أو وعدًا بالدخل."], ["استخدام المحتوى", "يُستخدم المحتوى والمنتجات الرقمية للاستخدام الشخصي وفق ما يعلن في صفحة المنتج. لا يجوز إعادة بيعها أو توزيعها دون إذن مكتوب."], ["المسؤولية", "يتحمل المستخدم مسؤولية قراراته وتطبيقه للمعلومات. تختلف النتائج بحسب المهارة والجهد والسوق وطريقة التطبيق."]]},
  refund: { eyebrow: "مسودة سياسة", title: "سياسة الاسترداد", icon: FileText, sections: [["المنتجات الرقمية", "يجب تحديد سياسة الاسترداد الخاصة بكل منتج رقمي بوضوح في صفحة المنتج وقبل إتمام الدفع، مع مراعاة القوانين المحلية وشروط بوابة الدفع."], ["طلب المراجعة", "عند وجود مشكلة في الوصول أو الملف أو وصف المنتج، يمكن التواصل عبر WhatsApp مع رقم الطلب وشرح المشكلة لتقييم الطلب."], ["تنبيه قبل الإطلاق", "هذه صفحة تأسيسية ويجب مراجعتها واعتمادها من مالك المشروع أو مستشار قانوني قبل فتح المبيعات العامة."]]},
  disclaimer: { eyebrow: "إخلاء مسؤولية", title: "تنبيه مهم قبل البدء", icon: AlertTriangle, sections: [["لا توجد ضمانات", "المحتوى تعليمي، ولا توجد ضمانات للربح أو النجاح أو الحصول على فرصة بعينها. تختلف النتائج حسب المهارة والجهد والسوق وطريقة التطبيق."], ["القرارات المالية", "لا تتخذ قرارًا ماليًا بناءً على وعود أو افتراضات. اطلع على تفاصيل المنتج أو البرنامج والتكاليف والتحديات قبل الالتزام."], ["الشفافية", "عند طلب تفاصيل أي فرصة أو نموذج عمل أو تكلفة، يجب تقديم المعلومات الحقيقية بوضوح قبل أن يتخذ المستخدم قرارًا ماليًا."]]},
};

export default function LegalPage() {
  const [, params] = useRoute("/:kind");
  const kind = params?.kind ?? "disclaimer";
  const content = policyContent[kind] ?? policyContent.disclaimer;
  const Icon = content.icon;
  return <SiteChrome><main><section className="page-hero"><div className="hamdan-container"><span className="eyebrow">{content.eyebrow}</span><h1 className="hamdan-display">{content.title}</h1><p>هذه النسخة صممت لتوضيح التوقعات للمستخدمين، ويجب اعتمادها ومراجعتها قانونيًا وفق بلد التشغيل والمنتجات والسياسات النهائية قبل النشر العام.</p></div></section><section className="page-section"><div className="hamdan-container legal-layout"><span className="legal-icon"><Icon size={27} /></span><div>{content.sections.map(([title, text]) => <article key={title}><h2>{title}</h2><p>{text}</p></article>)}</div></div></section></main></SiteChrome>;
}

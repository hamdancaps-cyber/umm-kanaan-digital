/** Role-gated management surface for editable copy, WhatsApp settings, and future content. */
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BookOpen, FileText, LayoutDashboard, MessageCircle, Save, Settings2, ShoppingBag, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const menuItems = [
  { icon: LayoutDashboard, label: "نظرة عامة", path: "/admin" },
  { icon: FileText, label: "المحتوى", path: "/admin" },
  { icon: BookOpen, label: "الأكاديمية", path: "/academy" },
  { icon: UsersRound, label: "المستخدمون", path: "/admin" },
  { icon: Settings2, label: "إعدادات الموقع", path: "/admin" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const settings = trpc.platform.admin.settings.useQuery(undefined, { enabled: user?.role === "admin" });
  const blocks = trpc.platform.admin.contentBlocks.useQuery(undefined, { enabled: user?.role === "admin" });
  const faqs = trpc.platform.admin.faqs.useQuery(undefined, { enabled: user?.role === "admin" });
  const saveSetting = trpc.platform.admin.saveSetting.useMutation({ onSuccess: () => utils.platform.admin.settings.invalidate() });
  const saveBlock = trpc.platform.admin.saveContentBlock.useMutation({ onSuccess: () => utils.platform.admin.contentBlocks.invalidate() });
  const saveFaq = trpc.platform.admin.saveFaq.useMutation({ onSuccess: () => utils.platform.admin.faqs.invalidate() });
  const recordPurchase = trpc.platform.admin.recordPurchase.useMutation();
  const [whatsappNumber, setWhatsappNumber] = useState("+967781643989");
  const [whatsappMessage, setWhatsappMessage] = useState("السلام عليكم الأستاذة أم كنعان، أريد معرفة المسار المناسب لي للبدء في العمل الرقمي.");
  const [trainerBio, setTrainerBio] = useState("هدفي أن أساعدك على فهم العالم الرقمي بطريقة بسيطة وعملية، وأن تعرف من أين تبدأ وكيف تطور نفسك خطوة بخطوة.");
  const [ctaText, setCtaText] = useState("اكتشف مسارك المناسب");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [purchaseUserId, setPurchaseUserId] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState("");

  if (user && user.role !== "admin") {
    return <DashboardLayout menuItems={menuItems} title="إدارة المنصة"><div className="portal-page" dir="rtl"><div className="admin-lock"><Settings2 size={28} /><h1>هذه المساحة مخصصة لمدير المنصة.</h1><p>يمكن للحسابات الإدارية فقط تعديل المحتوى وإعدادات التواصل.</p><Link className="button-secondary" href="/account">العودة إلى حسابي</Link></div></div></DashboardLayout>;
  }

  const onSaveContact = () => {
    saveSetting.mutate({ settingKey: "whatsapp_number", settingGroup: "contact", value: whatsappNumber });
    saveSetting.mutate({ settingKey: "whatsapp_default_message", settingGroup: "contact", value: whatsappMessage });
  };
  const onSaveTrainer = () => saveBlock.mutate({ blockKey: "trainer_bio", title: "تعلم مع الالأستاذة أم كنعان كابس", body: trainerBio, published: true });
  const onSaveCta = () => saveBlock.mutate({ blockKey: "homepage_primary_cta", title: "الدعوة الرئيسية", body: ctaText, published: true });
  const onSaveFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    saveFaq.mutate({ category: "عام", question: faqQuestion, answer: faqAnswer, published: true, sortOrder: (faqs.data?.length ?? 0) + 1 });
    setFaqQuestion(""); setFaqAnswer("");
  };
  const onRecordPurchase = () => {
    const userId = Number(purchaseUserId);
    if (!userId || !purchaseOrderId.trim() || !purchaseProduct.trim()) return;
    recordPurchase.mutate({ userId, providerOrderId: purchaseOrderId, productTitle: purchaseProduct, productHandle: purchaseProduct.toLowerCase().replace(/\s+/g, "-"), amount: "0", currencyCode: "YER" });
  };

  return <DashboardLayout menuItems={menuItems} title="إدارة منصة أم كنعان الرقمية"><div className="portal-page" dir="rtl"><div className="portal-header"><div><span className="eyebrow">لوحة التحكم</span><h1 className="hamdan-display">إدارة المحتوى والتواصل.</h1><p>هذه النسخة تضع أساسًا قابلًا للتوسع لتحرير عناصر المنصة الأساسية دون تعديل الشفرة.</p></div></div><div className="admin-overview"><article><MessageCircle size={20} /><span>قناة التواصل الرئيسية</span><strong>WhatsApp</strong></article><article><FileText size={20} /><span>كتل المحتوى المحفوظة</span><strong>{blocks.data?.length ?? "—"}</strong></article><article><Settings2 size={20} /><span>إعدادات الموقع</span><strong>{settings.data?.length ?? "—"}</strong></article></div><section className="admin-section"><div className="admin-section-head"><div><h2>إعدادات WhatsApp</h2><p>يمكن تغيير الرقم والرسالة الافتراضية لاحقًا. تظهر هذه القيم في خطة الإدارة ولا تُبدّل نصوص CTA العامة تلقائيًا حتى تربط بها الواجهة.</p></div><MessageCircle size={22} /></div><div className="admin-form"><label>رقم WhatsApp<input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="+967..." /></label><label>الرسالة الافتراضية<textarea value={whatsappMessage} onChange={e => setWhatsappMessage(e.target.value)} /></label><button className="button-primary" onClick={onSaveContact} disabled={saveSetting.isPending}><Save size={17} /> حفظ إعدادات التواصل</button></div></section><section className="admin-section"><div className="admin-section-head"><div><h2>قسم المدرب</h2><p>تُحفظ النبذة في كتل محتوى قابلة للتحرير. أضف الصورة المهنية والمعلومات الموثقة فقط من إدارة الملفات والمحتوى.</p></div><UsersRound size={22} /></div><div className="admin-form"><label>نبذة ورسالة المدرب<textarea value={trainerBio} onChange={e => setTrainerBio(e.target.value)} /></label><button className="button-primary" onClick={onSaveTrainer} disabled={saveBlock.isPending}><Save size={17} /> حفظ قسم المدرب</button></div></section><section className="admin-section"><div className="admin-section-head"><div><h2>الدعوة الرئيسية</h2><p>احفظ نص CTA رئيسيًا لربطه بعناصر التحويل في الصفحة الرئيسية في تحديثات المحتوى التالية.</p></div><FileText size={22} /></div><div className="admin-form"><label>نص الزر الرئيسي<input value={ctaText} onChange={e => setCtaText(e.target.value)} /></label><button className="button-primary" onClick={onSaveCta} disabled={saveBlock.isPending}><Save size={17} /> حفظ CTA</button></div></section><section className="admin-section"><div className="admin-section-head"><div><h2>الأسئلة الشائعة</h2><p>أضف الإجابات التي تزيل الغموض عن التعلم والمنتجات والفرص، دون صياغة وعود عن النتائج.</p></div><FileText size={22} /></div><div className="admin-form"><label>السؤال<input value={faqQuestion} onChange={e => setFaqQuestion(e.target.value)} /></label><label>الإجابة<textarea value={faqAnswer} onChange={e => setFaqAnswer(e.target.value)} /></label><button className="button-primary" onClick={onSaveFaq} disabled={saveFaq.isPending}><Save size={17} /> إضافة سؤال شائع</button></div>{faqs.data?.length ? <div className="admin-faq-list">{faqs.data.map(faq => <div key={faq.id}><strong>{faq.question}</strong><span>{faq.published ? "منشور" : "مسودة"}</span></div>)}</div> : null}</section><section className="admin-section"><div className="admin-section-head"><div><h2>تسجيل طلب مؤكد</h2><p>أدخل بيانات طلب Shopify المؤكد فقط ليتاح المنتج للمستخدم المقصود في لوحة حسابه. لا تستخدم هذه الخانة لطلبات تجريبية أو غير مدفوعة.</p></div><ShoppingBag size={22} /></div><div className="admin-form"><label>رقم المستخدم الداخلي<input value={purchaseUserId} onChange={e => setPurchaseUserId(e.target.value)} inputMode="numeric" /></label><label>معرّف طلب Shopify<input value={purchaseOrderId} onChange={e => setPurchaseOrderId(e.target.value)} /></label><label>اسم المنتج<input value={purchaseProduct} onChange={e => setPurchaseProduct(e.target.value)} /></label><button className="button-primary" onClick={onRecordPurchase} disabled={recordPurchase.isPending}><Save size={17} /> تسجيل شراء مؤكد</button></div></section><section className="admin-section admin-next"><h2>المراحل التالية الجاهزة للبناء</h2><p>هيكل البيانات يدعم إدارة المسارات والدورات والدروس والاختبارات والمقالات والموارد المجانية والـCTA والـSEO. يكتمل ربط هذه الوحدات بنماذج إدارة تفصيلية عند إضافة المحتوى الفعلي للمنصة.</p></section></div></DashboardLayout>;
}

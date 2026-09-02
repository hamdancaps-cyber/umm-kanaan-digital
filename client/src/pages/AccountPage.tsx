/** Authenticated learner dashboard built on the provided dashboard shell. */
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, Compass, Heart, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

const menuItems = [
  { icon: BookOpen, label: "تعلمي", path: "/account" },
  { icon: Compass, label: "المسارات", path: "/paths" },
  { icon: ShoppingBag, label: "مشترياتي", path: "/shop" },
  { icon: Heart, label: "المفضلة", path: "/account" },
];

export default function AccountPage() {
  const { user } = useAuth();
  const enrollments = trpc.platform.account.enrollments.useQuery();
  const favorites = trpc.platform.account.favorites.useQuery();
  const purchases = trpc.platform.account.purchases.useQuery();
  const enrolledCourses = enrollments.data ?? [];
  return <DashboardLayout menuItems={menuItems} title="حسابي"><div className="portal-page" dir="rtl"><div className="portal-header"><div><span className="eyebrow">مساحتك التعليمية</span><h1 className="hamdan-display">مرحبًا، {user?.name?.split(" ")[0] ?? "بك"}.</h1><p>من هنا ستتابع المسارات والدورات والمفضلة وسجل المشتريات الذي يصل من الطلبات المؤكدة.</p></div><Link className="button-primary" href="/paths">اكتشف مسارك</Link></div><div className="account-stats"><article><BookOpen size={20} /><span>الدورات الملتحق بها</span><strong>{enrollments.isLoading ? "—" : enrolledCourses.length}</strong></article><article><Award size={20} /><span>المفضلة</span><strong>{favorites.isLoading ? "—" : favorites.data?.length ?? 0}</strong></article><article><ShoppingBag size={20} /><span>المنتجات الرقمية</span><strong>{purchases.isLoading ? "—" : purchases.data?.length ?? 0}</strong></article></div><section className="portal-panel"><div className="portal-panel-head"><div><h2>دوراتي</h2><p>{enrolledCourses.length ? "هذه الدورات التي التحقت بها. يظهر التقدم التفصيلي بعد إضافة دروس المسار." : "لم تلتحق بدورة بعد. ابدأ بمسار مناسب ثم انتقل إلى محتوى الأكاديمية."}</p></div><Compass size={23} /></div>{enrolledCourses.length ? <div className="enrollment-list">{enrolledCourses.map(item => <div key={item.enrollment.id}><span>{item.course?.title ?? "دورة"}</span><small>الالتحاق: {new Date(item.enrollment.enrolledAt).toLocaleDateString("ar")}</small><strong>{item.enrollment.progressPercent}%</strong></div>)}</div> : <div className="empty-learning"><h3>اكتشف المجال المناسب لك أولًا.</h3><p>أجب عن اختبار المسار البسيط، ثم ابدأ بالمحتوى الذي يرتب البداية دون ضغط.</p><Link className="button-secondary" href="/#quiz">ابدأ اختبار المسار</Link></div>}</section><section className="portal-panel"><div className="portal-panel-head"><div><h2>المفضلة والمشتريات</h2><p>تُعرض المنتجات بعد تأكيد الطلب، وتُعرض العناصر التي تحفظها كمرجع للعودة إليها.</p></div><Heart size={23} /></div><div className="account-mini-lists"><div><strong>المفضلة</strong>{favorites.data?.length ? favorites.data.map(item => <span key={item.id}>{item.entityType}: {item.entityKey}</span>) : <small>لم تحفظ عنصرًا بعد.</small>}</div><div><strong>المشتريات</strong>{purchases.data?.length ? purchases.data.map(item => <span key={item.id}>{item.productTitle} · {item.accessStatus}</span>) : <small>لا توجد مشتريات مؤكدة بعد.</small>}</div></div></section></div></DashboardLayout>;
}

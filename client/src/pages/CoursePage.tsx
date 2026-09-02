/** Course detail page with lessons, progress actions, and a small knowledge check. */
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { SiteChrome } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ClipboardCheck, Clock3, LockKeyhole, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";

export default function CoursePage() {
  const [, params] = useRoute("/academy/:slug");
  const slug = params?.slug ?? "";
  const { isAuthenticated } = useAuth();
  const courseQuery = trpc.platform.public.courseBySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const enroll = trpc.platform.account.enrollCourse.useMutation();
  const complete = trpc.platform.account.completeLesson.useMutation();
  const submitQuiz = trpc.platform.account.submitQuiz.useMutation();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (courseQuery.isLoading) return <SiteChrome><main className="product-loading">جاري تحميل الدورة...</main></SiteChrome>;
  const data = courseQuery.data;
  if (!data) return <SiteChrome><main className="product-loading">لم يتم العثور على هذه الدورة.</main></SiteChrome>;
  const { course, lessons, quiz } = data;
  const handleEnroll = () => isAuthenticated ? enroll.mutate({ courseId: course.id }) : startLogin();
  const handleComplete = (lessonId: number) => isAuthenticated ? complete.mutate({ lessonId }) : startLogin();
  const handleQuiz = () => {
    if (!isAuthenticated) return startLogin();
    if (!quiz) return;
    submitQuiz.mutate({ quizId: quiz.id, answers: Object.entries(answers).map(([questionId, option]) => ({ questionId: Number(questionId), option })) });
  };

  return <SiteChrome><main><section className="page-hero academy-hero"><div className="hamdan-container"><span className="eyebrow">أكاديمية أم كنعان / {course.level === "beginner" ? "مبتدئ" : course.level}</span><h1 className="hamdan-display">{course.title}</h1><p>{course.description}</p><div className="hero-stats"><span><Clock3 size={16} /> {course.estimatedMinutes} دقيقة تقريبًا</span><span><PlayCircle size={16} /> {lessons.length} دروس</span><span><ClipboardCheck size={16} /> اختبار ذاتي</span></div><button className="button-primary course-enroll" onClick={handleEnroll} disabled={enroll.isPending}>{isAuthenticated ? "التحق بالدورة" : "سجّل للدخول وابدأ"}</button></div></section><section className="page-section"><div className="hamdan-container course-detail-grid"><div><div className="section-heading"><span className="eyebrow">دروس قصيرة</span><h2 className="hamdan-display">ابدأ ثم طبّق.</h2><p>عند إكمال الدرس، يُسجل تقدّمك في حسابك. لا يوجد تقدّم مصطنع أو شهادات دون استكمال حقيقي.</p></div><div className="lesson-list">{lessons.map((lesson, index) => <article key={lesson.id} className="lesson-card"><span>0{index + 1}</span><div><h3>{lesson.title}</h3><p>{lesson.content}</p><small><Clock3 size={13} /> {lesson.durationMinutes} دقائق · {lesson.lessonType === "exercise" ? "تمرين" : "درس"}</small></div><button onClick={() => handleComplete(lesson.id)} disabled={complete.isPending}><CheckCircle2 size={17} /> أكملت الدرس</button></article>)}</div></div>{quiz ? <aside className="course-quiz"><span className="icon-chip"><ClipboardCheck size={20} /></span><h2>اختبار الفهم</h2><p>{quiz.instructions}</p>{quiz.questions.map((question, index) => { const options = JSON.parse(question.optionsJson) as string[]; return <fieldset key={question.id}><legend>{index + 1}. {question.prompt}</legend>{options.map((option, optionIndex) => <label key={option}><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === optionIndex} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })} /> {option}</label>)}</fieldset>})}<button className="button-primary" onClick={handleQuiz} disabled={submitQuiz.isPending || Object.keys(answers).length !== quiz.questions.length}>{isAuthenticated ? "إرسال الاختبار" : <><LockKeyhole size={16} /> سجّل الدخول للإرسال</>}</button>{submitQuiz.data ? <p className="quiz-result-note">نتيجتك: {submitQuiz.data.score}% — {submitQuiz.data.passed ? "تم اجتياز الاختبار" : "راجع الدروس ثم أعد المحاولة"}.</p> : null}</aside> : null}</div></section></main></SiteChrome>;
}

export const WHATSAPP_NUMBER = "967781643989";

export const WHATSAPP_MESSAGES = {
  opportunity: "السلام عليكم الأستاذة أم كنعان، أريد معرفة تفاصيل فرصة العمل في مجال التجارة والتسويق الرقمي وكيف يمكنني البدء.",
  marketing: "السلام عليكم الأستاذة أم كنعان، أريد معرفة المزيد عن مسار التسويق الإلكتروني وكيف أبدأ.",
  ecommerce: "السلام عليكم الأستاذة أم كنعان، أريد معرفة كيفية البدء في مجال التجارة الإلكترونية.",
  generalPath: "السلام عليكم الأستاذة أم كنعان، أريد معرفة المسار الرقمي المناسب لي.",
  academy: "السلام عليكم الأستاذة أم كنعان، أريد معرفة المسار التدريبي الأنسب لي للبدء بصورة عملية.",
} as const;

export const whatsappHref = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

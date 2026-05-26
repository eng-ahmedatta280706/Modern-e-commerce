export const translations = {
    en: {
        header: {
            freeShipping: "Free shipping on all orders over $50",
            searchPlaceholder: "Search for products...",
            wishlist: "Go to Wishlist",
            categories: {
                newArrivals: "New Arrivals",
                women: "Women",
                men: "Men",
                kids: "Kids",
                accessories: "Accessories",
                sale: "Sale"
            },
            subcategories: {
                one: "Subcategory 1",
                two: "Subcategory 2",
                three: "Subcategory 3"
            }
        },
        footer: {
            freeShipping: {
                title: "Free Shipping",
                desc: "On orders over $50"
            },
            securePayment: {
                title: "Secure Payment",
                desc: "100% secure payment"
            },
            quality: {
                title: "Quality Guarantee",
                desc: "30-day return policy"
            },
            support: {
                title: "Customer Support",
                desc: "24/7 customer service"
            },
            about: {
                desc: "Your premier destination for the latest fashion trends and styles. Quality clothes delivered to your doorstep."
            },
            shop: {
                title: "Shop"
            },
            customerService: {
                title: "Customer Service",
                contact: "Contact Us",
                trackOrder: "Track Order",
                returnPolicy: "Return Policy",
                shippingInfo: "Shipping Info",
                faqs: "FAQs"
            },
            newsletter: {
                title: "Subscribe",
                desc: "Get 10% off your first order by joining our mailing list.",
                placeholder: "Your email",
                button: "Join"
            },
            copyright: "© 2025 StyleStore. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service"
        }
    },

    ar: {
        header: {
            freeShipping: "شحن مجاني على جميع الطلبات التي تزيد عن 50$",
            searchPlaceholder: "ابحث عن المنتجات...",
            wishlist: "اذهب إلى المفضلة",
            categories: {
                newArrivals: "وصل حديثًا",
                women: "نساء",
                men: "رجال",
                kids: "أطفال",
                accessories: "إكسسوارات",
                sale: "تخفيضات"
            },
            subcategories: {
                one: "تصنيف فرعي 1",
                two: "تصنيف فرعي 2",
                three: "تصنيف فرعي 3"
            }
        },
        footer: {
            freeShipping: {
                title: "شحن مجاني",
                desc: "على الطلبات التي تزيد عن 50$"
            },
            securePayment: {
                title: "دفع آمن",
                desc: "دفع آمن 100%"
            },
            quality: {
                title: "ضمان الجودة",
                desc: "سياسة إرجاع خلال 30 يوم"
            },
            support: {
                title: "دعم العملاء",
                desc: "خدمة العملاء 24/7"
            },
            about: {
                desc: "وجهتك المثالية لأحدث صيحات الموضة والأزياء. ملابس عالية الجودة تُوصل إلى باب منزلك."
            },
            shop: {
                title: "تسوق"
            },
            customerService: {
                title: "خدمة العملاء",
                contact: "اتصل بنا",
                trackOrder: "تتبع الطلب",
                returnPolicy: "سياسة الإرجاع",
                shippingInfo: "معلومات الشحن",
                faqs: "الأسئلة الشائعة"
            },
            newsletter: {
                title: "اشترك",
                desc: "احصل على خصم 10٪ على طلبك الأول من خلال الانضمام إلى قائمتنا البريدية.",
                placeholder: "بريدك الإلكتروني",
                button: "اشترك"
            },
            copyright: "© 2025 ستايل ستور. جميع الحقوق محفوظة.",
            privacy: "سياسة الخصوصية",
            terms: "الشروط والأحكام"
        }
    }
} as const;

export type Translations = typeof translations;
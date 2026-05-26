import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Instagram, Twitter,
  Mail, CreditCard, ShieldCheck,
  Truck, ShoppingBag
} from 'lucide-react';
import { useTranslate } from '../../hooks/userTranslate';

const Footer: React.FC = () => {
  const { t, isRTL } = useTranslate(); // isRTL سيكون true إذا كانت اللغة عربية مثلاً

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust badges */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center py-4">
              <Truck className="text-blue-400 mb-2" size={24} />
              <h3 className="font-medium text-white">{t("footer.freeShipping.title")}</h3>
              <p className="text-sm mt-1">{t("footer.freeShipping.desc")}</p>
            </div>
            <div className="flex flex-col items-center py-4">
              <CreditCard className="text-blue-400 mb-2" size={24} />
              <h3 className="font-medium text-white">{t("footer.securePayment.title")}</h3>
              <p className="text-sm mt-1">{t("footer.securePayment.desc")}</p>
            </div>
            <div className="flex flex-col items-center py-4">
              <ShieldCheck className="text-blue-400 mb-2" size={24} />
              <h3 className="font-medium text-white">{t("footer.quality.title")}</h3>
              <p className="text-sm mt-1">{t("footer.quality.desc")}</p>
            </div>
            <div className="flex flex-col items-center py-4">
              <Mail className="text-blue-400 mb-2" size={24} />
              <h3 className="font-medium text-white">{t("footer.support.title")}</h3>
              <p className="text-sm mt-1">{t("footer.support.desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-10">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isRTL ? "text-right" : "text-left"}`}>
          {/* Column 1 - About */}
          <div className="flex flex-col">
            <div className={`flex items-center mb-4 ${isRTL ? "space-x-reverse" : "space-x-2"}`}>
              <ShoppingBag className="text-orange-500" />
              <span className="font-bold text-xl text-white tracking-tight">StyleStore</span>
            </div>
            <p className="text-sm mb-4">{t("footer.about.desc")}</p>
            <div className={`flex mt-4 ${isRTL ? "space-x-reverse justify-center md:justify-end" : "space-x-4 justify-center md:justify-start"}`}>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">{t("footer.shop.title")}</h3>
            <ul className="space-y-2">
              {["newArrivals", "women", "men", "kids", "accessories", "sale"].map((cat) => (
                <li key={cat}>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    {t(`header.categories.${cat}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">{t("footer.customerService.title")}</h3>
            <ul className="space-y-2">
              {["contact", "trackOrder", "returnPolicy", "shippingInfo", "faqs"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    {t(`footer.customerService.${item}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">{t("footer.newsletter.title")}</h3>
            <p className="text-sm mb-4">{t("footer.newsletter.desc")}</p>
            <form className="mt-4">
              <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  className={`px-4 py-2 w-full focus:outline-none text-gray-900 rounded-l-lg ${isRTL ? "rounded-l-lg rounded-r-none" : "rounded-r-none rounded-l-lg"}`}
                />
                <button
                  type="submit"
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors rounded-r-lg ${isRTL ? "rounded-r-lg rounded-l-none" : ""}`}
                >
                  {t("footer.newsletter.button")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800 py-6">
        <div className={`container mx-auto px-4 flex flex-col md:flex-row justify-between items-center ${isRTL ? "text-right" : "text-left"}`}>
          <p className="text-sm">{t("footer.copyright")}</p>
          <div className={`flex mt-4 md:mt-0 ${isRTL ? "space-x-reverse" : "space-x-4"}`}>
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">{t("footer.privacy")}</Link>
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
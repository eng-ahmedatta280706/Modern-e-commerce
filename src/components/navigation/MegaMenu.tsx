import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { subCategories } from '../../data/categories';
import type { CategoryKey } from '../../types/Category';
import { useTranslate } from '../../hooks/userTranslate';
import { slugify } from '../../utils/helpers';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: CategoryKey[] = [
  'newArrivals',
  'women',
  'men',
  'kids',
  'accessories',
  'sale',
];

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslate();
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);

  return (
    <nav className={`${isOpen ? 'block' : 'hidden'} lg:block mt-4`}>
      <ul className="flex flex-col lg:flex-row lg:justify-center gap-2 lg:gap-8">
        {categories.map(category => (
          <li key={category} className="group relative">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:block">
              <Link
                to={`/category/${slugify(
                  t(`header.categories.${category}`)
                )}`}
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
                onClick={onClose}
              >
                {t(`header.categories.${category}`)}

                <ChevronDown
                  size={16}
                  className="hidden lg:block ml-1 rtl:ml-0 rtl:mr-1 transition-transform duration-200 group-hover:rotate-180"
                />
              </Link>

              <button
                type="button"
                className="lg:hidden p-1"
                onClick={() =>
                  setOpenCategory(
                    openCategory === category ? null : category
                  )
                }
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform ${openCategory === category ? 'rotate-180' : ''
                    }`}
                />
              </button>
            </div>

            {/* Mobile Accordion */}
            {/* Mobile Accordion */}
            {openCategory === category && (
              <div className="lg:hidden mt-3 pl-4 border-l border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(subCategories[category]).map(
                    ([section, items]) => (
                      <div key={section}>
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                          {section}
                        </h3>

                        <ul className="space-y-1">
                          {(items as string[]).map(item => (
                            <li key={item}>
                              <Link
                                to={`/category/${slugify(
                                  t(`header.categories.${category}`)
                                )}/${slugify(item)}`}
                                className="block py-1 text-xs text-gray-600 hover:text-blue-600"
                                onClick={onClose}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>

                <Link
                  to={`/category/${slugify(
                    t(`header.categories.${category}`)
                  )}`}
                  className="block text-blue-600 font-medium py-3 mt-2"
                  onClick={onClose}
                >
                  View all →
                </Link>
              </div>
            )}

            {/* Desktop Mega Menu */}
            <div
              className="
                hidden
                lg:group-hover:grid
                absolute
                top-full
                left-1/2
                -translate-x-1/2
                bg-white
                shadow-xl
                rounded-xl
                p-6
                grid-cols-3
                gap-8
                w-[700px]
                z-50
                border
                border-gray-100
              "
            >
              {Object.entries(subCategories[category]).map(
                ([section, items]) => (
                  <div key={section}>
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm uppercase tracking-wide">
                      {section}
                    </h3>

                    <ul className="space-y-2">
                      {(items as string[]).map(item => (
                        <li key={item}>
                          <Link
                            to={`/category/${slugify(
                              t(`header.categories.${category}`)
                            )}/${slugify(item)}`}
                            className="block text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all"
                            onClick={onClose}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              <div className="col-span-3 border-t pt-3">
                <Link
                  to={`/category/${slugify(
                    t(`header.categories.${category}`)
                  )}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={onClose}
                >
                  View all in {t(`header.categories.${category}`)} →
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MegaMenu;
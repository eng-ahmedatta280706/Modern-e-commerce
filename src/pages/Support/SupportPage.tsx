import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, MapPin, PackageSearch, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';

const pageContent = {
  contact: {
    title: 'Contact Us',
    intro: 'We are here to help with orders, sizing, payments, and returns.',
    icon: Mail,
    sections: [
      {
        heading: 'Customer care',
        body: 'Email support@stylestore.example or call +1 (555) 012-4400 from 9 AM to 6 PM, Monday through Friday.',
      },
      {
        heading: 'Store office',
        body: 'StyleStore, 42 Market Street, New York, NY 10013.',
      },
    ],
  },
  faqs: {
    title: 'FAQs',
    intro: 'Quick answers to the questions shoppers ask most often.',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'Can I change my order?',
        body: 'You can request edits before the order ships. Use the contact page with your order number.',
      },
      {
        heading: 'Do you support guest checkout?',
        body: 'Yes. You can check out as a guest and still receive order updates by email.',
      },
      {
        heading: 'How do coupons work?',
        body: 'Coupons can apply percentage, fixed amount, or shipping discounts during checkout.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'A clear summary of how StyleStore handles shopper information.',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'Information we collect',
        body: 'We collect checkout details, account details, and support messages needed to run the store.',
      },
      {
        heading: 'How we use it',
        body: 'Information is used for order fulfillment, customer support, fraud prevention, and service improvements.',
      },
    ],
  },
  returnPolicy: {
    title: 'Return Policy',
    intro: 'Returns are simple when items are unused, unworn, and sent back on time.',
    icon: RotateCcw,
    sections: [
      {
        heading: '30-day returns',
        body: 'Most items can be returned within 30 days of delivery with original tags and packaging.',
      },
      {
        heading: 'Refund timing',
        body: 'Refunds are processed to the original payment method after the returned item is inspected.',
      },
    ],
  },
  shippingInfo: {
    title: 'Shipping Info',
    intro: 'Shipping options are selected during checkout based on your address.',
    icon: Truck,
    sections: [
      {
        heading: 'Standard shipping',
        body: 'Standard delivery usually arrives in 3 to 6 business days after fulfillment.',
      },
      {
        heading: 'Express shipping',
        body: 'Express delivery is available for eligible addresses and usually arrives in 1 to 3 business days.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These terms explain the basic rules for using StyleStore.',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'Orders and pricing',
        body: 'Prices may change over time, and order acceptance depends on stock and payment confirmation.',
      },
      {
        heading: 'Site use',
        body: 'Use the store lawfully and do not interfere with checkout, account, or support systems.',
      },
    ],
  },
  trackOrder: {
    title: 'Track Order',
    intro: 'Use your order number and email to check shipment progress.',
    icon: PackageSearch,
    sections: [
      {
        heading: 'Where to find your order number',
        body: 'Your order number appears in the confirmation email sent after checkout.',
      },
      {
        heading: 'Tracking updates',
        body: 'Shipment tracking becomes available after the carrier scans the package.',
      },
    ],
  },
};

type PageKey = keyof typeof pageContent;

const SupportPage: React.FC = () => {
  const { page = 'contact' } = useParams<{ page: PageKey }>();
  const content = pageContent[page as PageKey] ?? pageContent.contact;
  const Icon = content.icon;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Breadcrumb items={[{ label: 'Support' }, { label: content.title }]} />

        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Icon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            <p className="mt-2 text-gray-600">{content.intro}</p>
          </div>
        </div>

        {page === 'trackOrder' && (
          <form className="mb-8 grid gap-4 rounded-2xl border border-gray-200 p-5 md:grid-cols-[1fr_1fr_auto]">
            <input
              type="text"
              placeholder="Order number"
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email address"
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Track
            </button>
          </form>
        )}

        {page === 'contact' && (
          <div className="mb-8 grid gap-4 rounded-2xl border border-gray-200 p-5 md:grid-cols-2">
            <div className="flex gap-3">
              <Mail className="mt-1 text-blue-600" size={20} />
              <div>
                <h2 className="font-semibold text-gray-900">Email</h2>
                <p className="text-gray-600">support@stylestore.example</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-1 text-blue-600" size={20} />
              <div>
                <h2 className="font-semibold text-gray-900">Address</h2>
                <p className="text-gray-600">42 Market Street, New York, NY</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {content.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
              <p className="mt-2 text-gray-600">{section.body}</p>
            </section>
          ))}
        </div>

        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-lg bg-gray-900 px-5 py-2 font-medium text-white transition-colors hover:bg-gray-800"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default SupportPage;

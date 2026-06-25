import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { companyInfo } from '../mock';

export const WhatsAppButton = () => {
  const { t, isRTL } = useLanguage();
  // Strip non-digit characters from WhatsApp number for the wa.me link
  const rawNumber = (companyInfo.contact.whatsapp || '').replace(/\D/g, '');
  const message = encodeURIComponent('Hello KK-TRUST COMP, I am interested in your products.');
  const href = `https://wa.me/${rawNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-btn"
      aria-label={t('common.whatsapp')}
      className={`fixed bottom-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-105 group ${
        isRTL ? 'left-6' : 'right-6'
      }`}
    >
      <MessageCircle size={24} fill="white" strokeWidth={1.5} />
      <span className="hidden md:inline font-medium text-sm">{t('common.whatsapp')}</span>
    </a>
  );
};

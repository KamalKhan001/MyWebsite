import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { companyInfo, categories } from '../mock';
import { contactAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

const categoryTranslationKey = {
  'T-shirts': 'products.tshirts',
  'Sportswear': 'products.sportswear',
  'Gym Wear': 'products.gymWear',
  'Gloves': 'products.gloves'
};

export const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    productInterest: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      productInterest: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productInterest) {
      toast.error(t('contact.selectInterest'));
      return;
    }

    setSubmitting(true);
    try {
      await contactAPI.submit(formData);
      toast.success(t('contact.success'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        productInterest: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('contact.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
            <p className="text-xl text-blue-100">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-blue-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('contact.address')}</h3>
                <p className="text-gray-600 text-sm">{companyInfo.contact.address}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-blue-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('contact.phone')}</h3>
                <a href={`tel:${companyInfo.contact.phone}`} className="text-blue-600 hover:text-blue-700 text-sm">
                  {companyInfo.contact.phone}
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('contact.email')}</h3>
                <a href={`mailto:${companyInfo.contact.email}`} className="text-blue-600 hover:text-blue-700 text-sm break-all">
                  {companyInfo.contact.email}
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-blue-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('contact.hours')}</h3>
                <p className="text-gray-600 text-sm">{t('contact.hoursValue')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.sendMessage')}</h2>
              <p className="text-gray-600">
                {t('contact.sendDesc')}
              </p>
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.fullName')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        data-testid="contact-name-input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.emailAddr')} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        data-testid="contact-email-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.phoneNum')} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        required
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{t('contact.companyName')} *</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Ltd."
                        required
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="country">{t('contact.country')} *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="United States"
                        required
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productInterest">{t('contact.productInterest')} *</Label>
                      <Select onValueChange={handleSelectChange} value={formData.productInterest} required>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder={t('contact.selectCategory')} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {t(categoryTranslationKey[category.name] || category.name)}
                            </SelectItem>
                          ))}
                          <SelectItem value="Custom Order">Custom Order</SelectItem>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.message')} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      data-testid="contact-message-input"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.messagePlaceholder')}
                      rows={6}
                      required
                      className="border-gray-300 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    data-testid="contact-submit-btn"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                  >
                    <Send className="mr-2" size={18} />
                    {submitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-none">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {t('contact.whyChoose')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                    <p className="text-gray-700">Customer Support</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                    <p className="text-gray-700">{t('stats.countries')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                    <p className="text-gray-700">{t('stats.experience')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

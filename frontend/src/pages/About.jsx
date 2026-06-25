import { Award, Target, Eye, Heart, MapPin, Users, Package, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { companyInfo } from '../mock';
import { useLanguage } from '../contexts/LanguageContext';

export const About = () => {
  const { t } = useLanguage();
  const statLabels = ['stats.experience', 'stats.countries', 'stats.products', 'stats.clients'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.title')}</h1>
            <p className="text-xl text-blue-100">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {companyInfo.description}
            </p>
            <p className="text-gray-600 leading-relaxed">
              Based in Sialkot, the heart of Pakistan&apos;s textile industry, we have built a reputation for excellence in manufacturing and exporting premium quality apparel. Our state-of-the-art facilities, skilled workforce, and commitment to international standards have made us a preferred partner for businesses worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Target className="text-blue-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('about.mission')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {companyInfo.mission}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="text-blue-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('about.vision')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {companyInfo.vision}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('about.values')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.valuesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {companyInfo.values.map((value, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-blue-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-blue-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{value}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.achievements')}</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              {t('about.achievementsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {companyInfo.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{t(statLabels[index])}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.whyPartner')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.whyPartnerDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Strategic Location</h3>
                <p className="text-gray-600 text-sm">
                  Based in Sialkot, the hub of Pakistan&apos;s sports goods and textile industry
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Skilled Workforce</h3>
                <p className="text-gray-600 text-sm">
                  Experienced craftsmen and quality control specialists ensuring excellence
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Custom Solutions</h3>
                <p className="text-gray-600 text-sm">
                  Flexible manufacturing capabilities for custom designs and specifications
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Export Expertise</h3>
                <p className="text-gray-600 text-sm">
                  10+ years of experience in international trade and logistics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.certs')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.certsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['ISO 9001:2015', 'OEKO-TEX', 'WRAP Certified', 'CE Certified'].map((cert, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardContent className="p-6 text-center">
                  <Award className="text-blue-600 mx-auto mb-3" size={40} />
                  <h4 className="font-semibold text-gray-900">{cert}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

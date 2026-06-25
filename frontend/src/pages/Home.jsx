import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Globe, Shield, Clock, Award, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { companyInfo } from '../mock';
import { productsAPI, testimonialsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [displayTestimonials, setDisplayTestimonials] = useState([]);
  const { t, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const statLabels = ['stats.experience', 'stats.countries', 'stats.products', 'stats.clients'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, testimonials] = await Promise.all([
          productsAPI.getAll(),
          testimonialsAPI.getAll()
        ]);
        setFeaturedProducts(products.slice(0, 4));
        setDisplayTestimonials(testimonials.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {t('home.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('home.heroTitle1')}{' '}
              <span className="text-blue-600">{t('home.heroTitle2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {t('home.tagline')}
            </p>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
              {t('home.heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" data-testid="hero-view-products-btn" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group">
                  {t('home.viewProducts')}
                  <Arrow className={`${isRTL ? 'mr-2' : 'ml-2'} group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`} size={20} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                  {t('home.getQuote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyInfo.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm md:text-base">{t(statLabels[index])}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.whyChoose')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.whyChooseDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, key: 'quality' },
              { icon: Clock, key: 'delivery' },
              { icon: Globe, key: 'global' },
              { icon: Award, key: 'certified' },
              { icon: TrendingUp, key: 'pricing' },
              { icon: Users, key: 'support' }
            ].map(({ icon: Icon, key }) => (
              <Card key={key} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{t(`features.${key}`)}</h3>
                  <p className="text-gray-600">
                    {t(`features.${key}Desc`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.featuredDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredProducts.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group cursor-pointer h-full">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium ${isRTL ? 'left-3' : 'right-3'}`}>
                      {product.category}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="text-sm text-blue-600 font-medium">{t('products.moq')} {product.min_order}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                {t('home.viewAll')}
                <Arrow className={isRTL ? 'mr-2' : 'ml-2'} size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.testimonialsTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.testimonialsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                      <p className="text-xs text-gray-500">{testimonial.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm italic">&ldquo;{testimonial.text}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            {t('home.ctaDesc')}
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              {t('home.ctaButton')}
              <Arrow className={isRTL ? 'mr-2' : 'ml-2'} size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

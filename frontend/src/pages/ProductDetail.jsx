import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package, Palette, Award, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { productsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const { t, isRTL } = useLanguage();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await productsAPI.getById(id);
        setProduct(data);

        // Fetch related (same category)
        const all = await productsAPI.getAll(data.category);
        setRelatedProducts(all.filter((p) => p.id !== data.id).slice(0, 3));
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error?.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">{t('products.loading')}</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-2xl font-semibold text-gray-900 mb-4">{t('products.productNotFound')}</p>
        <Link to="/products">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            {t('products.backToProducts')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 group"
          data-testid="back-to-products-link"
        >
          {isRTL ? (
            <>
              {t('products.backToProducts')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            <>
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              {t('products.backToProducts')}
            </>
          )}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            <div className={`absolute top-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium ${isRTL ? 'left-4' : 'right-4'}`}>
              {product.category}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium w-fit">
              {t('products.category')}: {product.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specs */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="text-blue-600" size={20} />
                {t('products.specifications')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Package className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t('products.minOrder')}</div>
                    <div className="font-semibold text-gray-900">{product.min_order}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Palette className="text-blue-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">{t('products.colors')}</div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Shield className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Quality Standard</div>
                    <div className="font-semibold text-gray-900">ISO 9001:2015 Certified</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {t('products.qualityNote')}
            </p>

            <Link to="/contact" className="w-full">
              <Button
                size="lg"
                data-testid="request-quote-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-lg hover:shadow-xl"
              >
                {t('products.requestQuote')}
                {isRTL ? <ArrowLeft className="mr-2" size={20} /> : <ArrowRight className="ml-2" size={20} />}
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <Award className="text-blue-600" size={28} />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('products.relatedProducts')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link to={`/products/${rp.id}`} key={rp.id} data-testid={`related-product-${rp.id}`}>
                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group cursor-pointer h-full">
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className={`absolute top-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium ${isRTL ? 'left-3' : 'right-3'}`}>
                        {rp.category}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rp.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{rp.description}</p>
                      <div className="text-sm text-blue-600 font-medium">
                        {t('products.moq')} {rp.min_order}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { products, categories } from '../mock';
import { Shirt, Activity, Dumbbell, Hand } from 'lucide-react';

const iconMap = {
  Shirt: Shirt,
  Activity: Activity,
  Dumbbell: Dumbbell,
  Hand: Hand
};

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-blue-100">
              Premium quality textile products for international markets
            </p>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon];
              return (
                <Card key={category.name} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="text-blue-600" size={28} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter and Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              onClick={() => setSelectedCategory('All')}
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              className={selectedCategory === 'All' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                className={selectedCategory === category.name
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group">
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Min Order:</span>
                      <span className="font-medium text-blue-600">{product.minOrder}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 text-sm block mb-2">Available Colors:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Orders CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Custom Products?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                We offer custom manufacturing services for your specific requirements. Contact us to discuss your needs and get a personalized quote.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Request Custom Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/products', label: 'Products' },
  { path: '/contact', label: 'Contact' }];


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <a href="mailto:info@kktrustcomp.com" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Mail size={14} />
                <span className="hidden sm:inline">kmk36680@gamil.com</span>
              </a>
              <a href="tel:+923001234567" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Phone size={14} />
                <span className="hidden sm:inline">+92 3165694709</span>
              </a>
            </div>
            <div className="text-xs sm:text-sm">
              Trusted Export Partner Since 2014
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white font-bold text-xl px-4 py-2 rounded-l-lg shadow-md group-hover:shadow-lg transition-all">
              KK-TRUST
            </div>
            <div className="bg-gray-100 text-blue-700 font-bold text-xl px-3 py-2 rounded-r-lg border border-l-0 border-gray-200 shadow-md group-hover:shadow-lg transition-all">
              COMP
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive(link.path) ?
              'text-blue-600 border-b-2 border-blue-600 pb-1' :
              'text-gray-700'}`
              }>
              
                {link.label}
              </Link>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen &&
        <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-blue-600 py-2 ${
              isActive(link.path) ? 'text-blue-600' : 'text-gray-700'}`
              }>
              
                  {link.label}
                </Link>
            )}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  Get Quote
                </Button>
              </Link>
            </div>
          </nav>
        }
      </div>
    </header>);

};
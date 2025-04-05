
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavbarLinks from '@/components/NavbarLinks';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-elevation-1 sticky top-0 z-50">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-theater-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">StageSight</span>
          </Link>

          {/* Desktop Navigation with NavbarLinks component */}
          <NavbarLinks />

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-3 mb-4">
              <Link
                to="/"
                className={`py-2 px-4 rounded-md hover:bg-muted ${
                  isActive('/') ? 'text-theater-primary font-medium bg-muted' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`py-2 px-4 rounded-md hover:bg-muted ${
                  isActive('/events') ? 'text-theater-primary font-medium bg-muted' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/search"
                className={`py-2 px-4 rounded-md hover:bg-muted ${
                  isActive('/search') ? 'text-theater-primary font-medium bg-muted' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/cart"
                className={`py-2 px-4 rounded-md hover:bg-muted ${
                  isActive('/cart') ? 'text-theater-primary font-medium bg-muted' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
              <Link
                to="/auth"
                className={`py-2 px-4 rounded-md hover:bg-muted ${
                  isActive('/auth') ? 'text-theater-primary font-medium bg-muted' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login/Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

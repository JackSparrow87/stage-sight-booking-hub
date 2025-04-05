
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const NavbarLinks = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
  ];

  // Add admin link only for admin users
  if (isAdmin) {
    links.push({ path: '/admin', label: 'Admin' });
  }

  return (
    <div className="flex items-center">
      <nav className="hidden md:flex space-x-8 mr-4">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors hover:text-theater-primary ${
              location.pathname === link.path ? 'text-theater-primary' : 'text-theater-dark'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline-block">
            {user.email}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="flex items-center gap-1"
          >
            <LogOut size={16} /> 
            <span className="hidden md:inline-block">Logout</span>
          </Button>
        </div>
      ) : (
        <Link to="/auth">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <User size={16} /> 
            <span>Login</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavbarLinks;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavbarLinks = () => {
  const location = useLocation();
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="hidden md:flex space-x-8">
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
  );
};

export default NavbarLinks;

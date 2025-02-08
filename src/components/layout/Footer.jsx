import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LocationMarkerIcon, 
  ChatAltIcon, 
  UserGroupIcon, 
  InformationCircleIcon 
} from '@heroicons/react/outline';

const FooterSection = ({ title, links }) => (
  <div>
    <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            to={link.path} 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ Icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-white hover:text-rabat-primary-200 transition-colors"
  >
    <Icon className="h-6 w-6" />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { name: 'CityScope', path: '/map' },
        { name: 'Échappées', path: '/echappees' },
        { name: 'Agora', path: '/agora' }
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'Our Mission', path: '/about' },
        { name: 'Team', path: '/team' },
        { name: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Contribute', path: '/contribute' },
        { name: 'Guidelines', path: '/guidelines' },
        { name: 'Privacy Policy', path: '/privacy' }
      ]
    }
  ];

  const socialLinks = [
    { 
      Icon: UserGroupIcon, 
      href: 'https://www.facebook.com/rabaturbanplatform' 
    },
    { 
      Icon: ChatAltIcon, 
      href: 'https://twitter.com/rabaturban' 
    },
    { 
      Icon: LocationMarkerIcon, 
      href: 'https://www.instagram.com/rabaturbanplatform' 
    }
  ];

  return (
    <footer className="bg-rabat-primary-700 text-white py-16">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="md:col-span-1">
          <div className="flex items-center mb-4">
            <Link to={'/'}>
              <img 
                src="/rabat.png" 
                alt="Rabat Urban Platform" 
                className="w-20"
              />
            </Link>
          </div>
          <p className="text-gray-300 mb-4">
            Transforming urban exploration through collaborative mapping and community engagement.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <SocialIcon 
                key={index} 
                Icon={social.Icon} 
                href={social.href} 
              />
            ))}
          </div>
        </div>

        {/* Footer Links */}
        {footerLinks.map((section, index) => (
          <div key={index} className="md:col-span-1">
            <FooterSection 
              title={section.title} 
              links={section.links} 
            />
          </div>
        ))}

        {/* Newsletter and Contact */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">
            Stay Connected
          </h4>
          <form className="space-y-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-2 rounded-md bg-rabat-primary-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button 
              type="submit" 
              className="w-full bg-white text-rabat-primary-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-rabat-primary-600 mt-8 pt-6 text-center">
        <p className="text-gray-300">
          © {currentYear} Rabat Urban Platform. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link 
            to="/terms" 
            className="text-gray-300 hover:text-white"
          >
            Terms of Service
          </Link>
          <Link 
            to="/privacy" 
            className="text-gray-300 hover:text-white"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
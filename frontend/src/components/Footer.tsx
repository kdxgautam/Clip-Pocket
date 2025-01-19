import React from 'react';
import { Mail, Facebook, Twitter, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks: SocialLinkProps[] = [
    { 
      href: '#', 
      icon: <Facebook className="w-6 h-6" />
    },
    { 
      href: '#', 
      icon: <Twitter className="w-6 h-6" />
    },
    { 
      href: '#', 
      icon: <Github className="w-6 h-6" />
    }
  ];

  const quickLinks = [
    { href: '#downloadSection', text: 'Download' },
    { href: '#features', text: 'Features' },
    { href: '#howItWorks', text: 'How It Works' },
    { href: '#faq', text: 'FAQ' }
  ];

  const legalLinks = [
    { href: '#privacyPolicy', text: 'Privacy Policy' },
    { href: '#', text: 'Terms of Service' },
    { href: '#', text: 'DMCA' },
    { href: '#', text: 'Copyright' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <FooterSection title="YT Downloader">
          <p className="text-gray-400 text-sm">
            Free YouTube video downloader with support for multiple formats and qualities.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <SocialLink key={index} {...link} />
            ))}
          </div>
        </FooterSection>

        {/* Quick Links */}
        <FooterSection title="Quick Links" animationDelay="0.2s">
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.text}</FooterLink>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Legal */}
        <FooterSection title="Legal" animationDelay="0.4s">
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.text}</FooterLink>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Contact */}
        <FooterSection title="Contact" animationDelay="0.6s">
          <ul className="space-y-2">
            <li className="flex items-center text-gray-400">
              <Mail className="w-5 h-5 mr-2" />
              support@ytdownloader.com
            </li>
          </ul>
        </FooterSection>
      </div>

      <div className="mt-12 pt-8 border-t border-neutral-800">
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} YT Downloader. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;


interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-gray-400 hover:text-red-500 transition-colors"
  >
    {children}
  </a>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => (
  <a 
    href={href} 
    className="text-gray-400 hover:text-red-500 transition-colors"
  >
    {icon}
  </a>
);

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  animationDelay?: string;
}

const FooterSection: React.FC<FooterSectionProps> = ({ 
  title, 
  children, 
  animationDelay = '0s' 
}) => (
  <div 
    className="space-y-4 animate__animated animate__fadeIn text-white"
    style={{ animationDelay, transition: '0.6s ease-out' }}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    {children}
  </div>
);

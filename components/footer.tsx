import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gold/20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-gold mb-4">CALI GOLD DRIVE</h3>
            <p className="text-gray-400 mb-4">
              Premium ride service across Southern California. Your privacy and safety are our top priority.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/caligolddrivellc?igsh=MWM0MXkybnkxMzA2aw==" className="text-gold hover:text-yellow-400 transition-colors">
                📷 Instagram
              </a>
              <a href="https://wa.me/16574624945" className="text-gold hover:text-yellow-400 transition-colors">
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
              <li><Link href="/fleet" className="hover:text-gold transition-colors">Fleet</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/why-choose-us" className="hover:text-gold transition-colors">Why Choose Us</Link></li>
              <li><Link href="/faq-policies" className="hover:text-gold transition-colors">FAQ & Policies</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>📞 Call (657) 462-4945</p>
              <p>
                🌐 <a 
                  href="https://caligolddrive.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold hover:text-yellow-400 transition-colors hover:underline"
                >
                  www.caligolddrive.com
                </a>
              </p>
              <p>📍 Serving LA, OC, San Diego & Riverside</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 CALI GOLD DRIVE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
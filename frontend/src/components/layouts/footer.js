import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      {/* Internal styles for hover effects */}
      <style>{`
        .footer-link {
          display: block;
          color: #BFDBFE;
          font-size: 14px;
          margin-bottom: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: #ffffff;
          text-decoration: underline;
          transform: translateY(-1px);
        }

        .social-icon {
          color: #BFDBFE;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .social-icon:hover {
          color: #ffffff;
          transform: scale(1.1);
        }
      `}</style>

      <div style={containerStyle}>
        {/* Help Section */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}> Help</h3>
          <p style={centeredTextStyle}>+123 456 7890</p>
          <p style={centeredTextStyle}>+987 654 3210</p>
          <p style={centeredTextStyle}>support@example.com</p>
        </div>

        {/* À propos Section */}
        <div style={sectionStyle}>
          <h4 style={subHeadingStyle}>À propos</h4>
          <Link to="/about" className="footer-link">À propos</Link>
          <Link to="/terms" className="footer-link">Termes et conditions</Link>
          <Link to="/contact" className="footer-link">Contactez-nous</Link>
        </div>

        {/* Social Media */}
        <div style={sectionStyle}>
          <h4 style={subHeadingStyle}>Follow Us</h4>
          <div style={socialIconsContainerStyle}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div style={copyrightStyle}>
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  );
};

// Base Styles
const footerStyle = {
  backgroundColor: '#2563EB',
  color: '#FFFFFF',
  padding: '40px 24px 20px',
  fontFamily: 'Inter, -apple-system, sans-serif',
  width: '100%',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '30px',
};

const sectionStyle = {
  flex: '1 1 200px',
  minWidth: '180px',
  textAlign: 'center',
};

const headingStyle = {
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '16px',
};

const subHeadingStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '12px',
};

const centeredTextStyle = {
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '8px',
};

const socialIconsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  fontSize: '18px',
};

const copyrightStyle = {
  marginTop: '30px',
  borderTop: '1px solid #3B82F6',
  paddingTop: '16px',
  textAlign: 'center',
  fontSize: '13px',
  color: '#93C5FD',
};

export default Footer;

import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(90deg, rgba(21,102,192,0.18) 0%, rgba(33,158,188,0.13) 100%)',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        borderTop: '1.5px solid rgba(21,102,192,0.13)',
        boxShadow: '0 -4px 32px -8px rgba(33, 158, 188, 0.18), 0 -2px 16px -4px rgba(21,102,192,0.10)',
        position: 'relative',
        zIndex: 10,
        marginTop: 'auto',
        width: '100%'
      }}
    >
      <div className="container py-3">
        <div className="row align-items-center gy-2">
          {/* Left: Contact Us */}
          <div className="col-md-4 d-flex flex-column" style={{ color: '#1e293b' }}>
            <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'rgb(21, 102, 192)' }}>Contact Us</div>
            <div className="small" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Mobile: 8986020610, 6203959907</div>
            <div className="small" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Email: <a href="mailto:ec-buxar@nielit.gov.in" style={{ color: 'rgb(21, 102, 192)', textDecoration: 'none', borderBottom: 'none' }}>ec-buxar@nielit.gov.in</a></div>
          </div>
          {/* Middle: Copyright */}
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <div
              className="fw-semibold"
              style={{ color: '#1e293b', fontSize: '0.8rem', marginTop: '8px' }}
            >
              © 2025 NIELIT Buxar. All rights reserved.
            </div>
          </div>
          {/* Right: Social */}
          <div className="col-md-4 d-flex flex-row justify-content-md-end align-items-center gap-4" style={{ color: '#1e293b' }}>
            <div className="d-flex flex-column align-items-md-end" style={{ minWidth: 120 }}>
              <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'rgb(21, 102, 192)', alignSelf: 'flex-start', marginLeft: '10px' }}>Follow Us</div>
              <div className="d-flex gap-2 mt-1 justify-content-md-end">
                <a
                  href="https://www.instagram.com/nielitbuxar/?__pwa=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e1306c, #fd1d1d)',
                    color: '#fff',
                    boxShadow: '0 2px 8px -2px rgba(225, 48, 108, 0.4)',
                    transition: 'transform 0.2s ease',
                    borderBottom: 'none',
                    textDecoration: 'none'
                  }}
                  title="Instagram"
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <i className="fab fa-instagram" style={{ fontSize: '0.9rem' }}/>
                </a>
                <a
                  href="https://www.facebook.com/NielitExtensionCentreBuxar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1877f2, #42a5f5)',
                    color: '#fff',
                    boxShadow: '0 2px 8px -2px rgba(24, 119, 242, 0.4)',
                    transition: 'transform 0.2s ease',
                    borderBottom: 'none',
                    textDecoration: 'none'
                  }}
                  title="Facebook"
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <i className="fab fa-facebook-f" style={{ fontSize: '0.9rem' }}/>
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Vap4UYY2kNFx38hbM41I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: '#fff',
                    boxShadow: '0 2px 8px -2px rgba(37, 211, 102, 0.4)',
                    transition: 'transform 0.2s ease',
                    borderBottom: 'none',
                    textDecoration: 'none'
                  }}
                  title="WhatsApp"
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: '0.9rem' }}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

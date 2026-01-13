import React, { useState, useEffect } from 'react';

const WHATSAPP_URL = 'https://wa.me/message/YUNPXGVFKPZHP1';
const MAPS_URL = 'https://maps.google.com/?q=YOUR_PLACEHOLDER';
const PHONE_TEXT = '+94 76 742 6207';

const handleWhatsappClick = () => {
  console.log('cta_whatsapp_click');
  window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
};

const handleLocationClick = () => {
  console.log('cta_location_click');
  window.open(MAPS_URL, '_blank', 'noopener,noreferrer');
};

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="page">
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-content">
          <div className="brand">
            <img src="/navlogo.svg" alt="BASSS NOW" />
          </div>
          <button className="btn primary" onClick={handleWhatsappClick}>
            WhatsApp Us
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <span className="eyebrow">
                Sri Lanka's first home repair service company
              </span>
              <h1>HOME REPAIRS MADE EASY</h1>
              <p className="subtext">
                <span className="subtext-line">
                  Days of chasing after basss are over.
                </span>
                <span className="subtext-line">
                  Book and manage your home repair entirely on WhatsApp.
                </span>
                <span className="subtext-line">
                  We handle estimations, payments and billing, and repairs.
                </span>
                <span className="subtext-line">
                  All you have to do is contact us.
                </span>
              </p>
              <div className="hero-actions">
                <button className="btn primary" onClick={handleWhatsappClick}>
                  Book on WhatsApp
                </button>
                <button className="btn ghost" onClick={handleLocationClick}>
                  View Location
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <img className="hero-landing" src="/Landing.svg" alt="BASSS NOW" />
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2>How we work</h2>
            <div className="steps">
              <div className="step-card main-step">
                <span className="step-number">01</span>
                <h3>Book estimate</h3>
                <p>
                  Send your request on WhatsApp, confirm a time for us to visit,
                  and pay the estimation fee.
                </p>
              </div>
              <div className="step-card main-step">
                <span className="step-number">02</span>
                <h3>Approve estimate</h3>
                <p>
                  We share the estimate. Approve and complete payment to
                  proceed.
                </p>
              </div>
              <div className="step-card main-step">
                <span className="step-number">03</span>
                <h3>Dispatch and repair</h3>
                <p>We handle logistics end to end.</p>
              </div>
              <div className="step-card edge-step">
                <h3>Additional work</h3>
                <p>
                  During our visit, if you or our basss find additional work, we
                  will contact you with an updated estimate. Upon your approval,
                  we will do that work as well.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="container">
            <div className="section-head">
              <h2>Services</h2>
              <button className="btn text-link" onClick={handleWhatsappClick}>
                Book now on WhatsApp
              </button>
            </div>
            <div className="cards">
              <article className="service-card">
                <h3>Estimation</h3>
                <ul>
                  <li>LKR 1,000 to dispatch.</li>
                  <li>Non-refundable.</li>
                  <li>If you accept the estimate, the LKR 1,000 estimation fee is deducted from the total job cost.</li>
                </ul>
              </article>
              <article className="service-card">
                <h3>Repair Work</h3>
                <ul>
                  <li>Work starts only after the estimate is accepted and full payment is received.</li>
                  <li>We handle billing, coordination, and logistics.</li>
                  <li>No meals, tea, or cleaning are required.</li>
                </ul>
              </article>
              <article className="service-card">
                <h3>Additional Work</h3>
                <ul>
                  <li>If extra work is required, we contact you with the updated cost.</li>
                  <li>We proceed only after your approval and payment.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="faq" id="faq">
          <div className="container">
            <h2>FAQ</h2>
            <div className="faq-list">
              <details>
                <summary>Why is the estimation fee non-refundable?</summary>
                <p>
                  The fee covers basss time and dispatch planning once your estimate is booked.
                </p>
              </details>
              <details>
                <summary>Is the estimation fee deducted if I proceed?</summary>
                <p>
                  Yes. The LKR 1,000 estimation fee is deducted from the total
                  job cost when you accept the estimate. If the total estimate
                  is LKR 50,000 and we do the job, you only have to pay LKR
                  49,000.
                </p>
              </details>
              <details>
                <summary>Do you start work without payment?</summary>
                <p>
                  No. Work starts only after the estimate is accepted and full payment is received. At our discretion, we can offer split payment plans.
                </p>
              </details>
              <details>
                <summary>What happens if additional work is needed?</summary>
                <p>
                  We contact you with the updated cost and proceed only after your approval and payment.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <div className="footer-title">
              <img src="/footerlogo.svg" alt="BASSS NOW" />
            </div>
            <p className="footer-phone">{PHONE_TEXT}</p>
          </div>
          <button className="btn primary" onClick={handleWhatsappClick}>
            WhatsApp Us
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const WHATSAPP_URL = 'https://wa.me/message/YUNPXGVFKPZHP1';
const MAPS_URL = 'https://maps.app.goo.gl/MTmrvefCWmMTj5j97';
const PHONE_TEXT = '+94 76 742 6207';
const INVOICE_ROUTE = '/pathum/invoice';

const handleWhatsappClick = () => {
  console.log('cta_whatsapp_click');
  window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
};

const handleLocationClick = () => {
  console.log('cta_location_click');
  window.open(MAPS_URL, '_blank', 'noopener,noreferrer');
};

const normalizePath = (path) => {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed.length ? trimmed : '/';
};

const createLineItem = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  description: '',
  amount: 0,
  included: '',
  notIncluded:
    'Removal or disposal of existing items, furniture, appliances, or external waste is not included. BASSS NOW will clean debris created during the repair work only and will not handle disposal.',
  notes: '',
});

const formatMoney = (value) =>
  `LKR ${Number(value || 0).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function InvoicePage({ onBack }) {
  const todayLocal = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
  };

  const invoiceSheetRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const formatDisplayDate = (value) => {
    if (!value) {
      return '--';
    }
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsed);
  };

  const [invoice, setInvoice] = useState(() => ({
    invoiceNumber: '0067',
    date: todayLocal(),
    customerName: '',
    documentType: 'Invoice',
    included: '',
    notIncluded:
      'Removal or disposal of existing items, furniture, appliances, or external waste is not included. BASSS NOW will clean debris created during the repair work only and will not handle disposal.',
    notes: '',
    items: [createLineItem()],
  }));

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateItemField = (id, field) => (event) => {
    const value = event.target.value;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, createLineItem()],
    }));
  };

  const removeItem = (id) => {
    setInvoice((prev) => {
      if (prev.items.length === 1) {
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      };
    });
  };

  const total = invoice.items.reduce((sum, item) => {
    const amount = Number(item.amount || 0);
    return sum + amount;
  }, 0);
  const isInvoice = invoice.documentType === 'Invoice';
  const isEstimate = invoice.documentType === 'Estimate';

  const handleDownloadPdf = async () => {
    const sheet = invoiceSheetRef.current;
    if (!sheet) {
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(sheet, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        windowWidth: 1280,
        windowHeight: 1700,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight, 1);
      const renderWidth = imgWidth * scale;
      const renderHeight = imgHeight * scale;
      const x = (pageWidth - renderWidth) / 2;
      const y = 0;

      pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
      const fileLabel = invoice.documentType.toLowerCase();
      const fileNumber = invoice.invoiceNumber || '0067';
      pdf.save(`${fileLabel}-${fileNumber}.pdf`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="invoice-page">
      <header className="invoice-header no-print">
        <div className="container invoice-header-content">
          <button className="btn text-link" onClick={onBack}>
            Back to Home
          </button>
          <div className="invoice-header-title">Invoice Builder</div>
        </div>
      </header>

      <main className="invoice-main">
        <div className="container invoice-grid">
          <section className="invoice-form no-print">
            <h2>Invoice details</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="invoice-number">Invoice/Estimate number</label>
                <input
                  id="invoice-number"
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={updateField('invoiceNumber')}
                />
              </div>
              <div className="form-field">
                <label htmlFor="invoice-date">Date</label>
                <input
                  id="invoice-date"
                  type="date"
                  value={invoice.date}
                  onChange={updateField('date')}
                />
              </div>
              <div className="form-field">
                <label htmlFor="customer-name">Customer name</label>
                <input
                  id="customer-name"
                  type="text"
                  value={invoice.customerName}
                  onChange={updateField('customerName')}
                />
              </div>
              <div className="form-field">
                <label htmlFor="document-type">Document type</label>
                <select
                  id="document-type"
                  value={invoice.documentType}
                  onChange={updateField('documentType')}
                >
                  <option value="Invoice">Invoice</option>
                  <option value="Estimate">Estimate</option>
                </select>
              </div>
            </div>

            <div className="line-items">
              <div className="line-items-header">
                <h3>Line items</h3>
                <button className="btn text-link" onClick={addItem}>
                  Add item
                </button>
              </div>
              {invoice.items.map((item, index) => (
                <div className="line-item" key={item.id}>
                  <div className="form-field">
                    <label htmlFor={`item-desc-${item.id}`}>
                      Description {index + 1}
                    </label>
                    <input
                      id={`item-desc-${item.id}`}
                      type="text"
                      value={item.description}
                      onChange={updateItemField(item.id, 'description')}
                      placeholder="Service or product"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor={`item-amount-${item.id}`}>Amount</label>
                    <input
                      id={`item-amount-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amount}
                      onChange={updateItemField(item.id, 'amount')}
                    />
                  </div>
                  {index > 0 ? (
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove item ${index + 1}`}
                      title="Remove item"
                    >
                      x
                    </button>
                  ) : (
                    <span className="icon-spacer" aria-hidden="true" />
                  )}
                  {!isInvoice ? (
                    <>
                      <div className="form-field form-field-full">
                        <label htmlFor={`item-included-${item.id}`}>
                          What is included
                        </label>
                        <textarea
                          id={`item-included-${item.id}`}
                          rows="2"
                          value={item.included}
                          onChange={updateItemField(item.id, 'included')}
                          placeholder="Included services or materials"
                        />
                      </div>
                      <div className="form-field form-field-full">
                        <label htmlFor={`item-not-included-${item.id}`}>
                          What is not included
                        </label>
                        <textarea
                          id={`item-not-included-${item.id}`}
                          rows="2"
                          value={item.notIncluded}
                          onChange={updateItemField(item.id, 'notIncluded')}
                          placeholder="Anything excluded from the scope"
                        />
                      </div>
                      <div className="form-field form-field-full">
                        <label htmlFor={`item-notes-${item.id}`}>Notes</label>
                        <textarea
                          id={`item-notes-${item.id}`}
                          rows="2"
                          value={item.notes}
                          onChange={updateItemField(item.id, 'notes')}
                          placeholder="Additional notes"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              ))}
            </div>

            {isInvoice ? (
              <>
                <div className="form-field">
                  <label htmlFor="included">
                    What is included (applies to all line items)
                  </label>
                  <textarea
                    id="included"
                    rows="3"
                    value={invoice.included}
                    onChange={updateField('included')}
                    placeholder="Included services or materials"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="not-included">
                    What is not included (applies to all line items)
                  </label>
                  <textarea
                    id="not-included"
                    rows="3"
                    value={invoice.notIncluded}
                    onChange={updateField('notIncluded')}
                    placeholder="Anything excluded from the scope"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="notes">Notes (applies to all line items)</label>
                  <textarea
                    id="notes"
                    rows="3"
                    value={invoice.notes}
                    onChange={updateField('notes')}
                    placeholder="Additional notes"
                  />
                </div>
              </>
            ) : null}

            <div className="invoice-actions">
              <button
                className="btn primary"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>
          </section>

          <section className="invoice-preview">
            <div
              className={`invoice-sheet ${isGeneratingPdf ? 'pdf-export' : ''}`}
              ref={invoiceSheetRef}
            >
              <div className="invoice-preview-header">
                <div className="invoice-branding">
                  <img
                    className="invoice-logo-mark"
                    src="/LOGO0.png"
                    alt="BASSS NOW"
                  />
                </div>
                <div className="invoice-title-block">
                  <p className="invoice-title">{invoice.documentType}</p>
                  <div className="invoice-meta">
                    <p className="invoice-date">
                      {formatDisplayDate(invoice.date)}
                    </p>
                    <p className="invoice-number">
                      {invoice.documentType} No.{' '}
                      <strong>{invoice.invoiceNumber || '0067'}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="invoice-customer">
                <div>
                  <h4>Bill to</h4>
                  <p>{invoice.customerName || 'Customer name'}</p>
                </div>
                <div className="payment-info">
                  <h4>Payment Information</h4>
                  <p>Account Name: NPM Perera</p>
                  <p>Account Number: 73007358</p>
                  <p>Bank: Bank Of Ceylon</p>
                  <p>Branch: Maharagama</p>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => {
                    const amount = Number(item.amount || 0);
                    return (
                      <tr key={item.id}>
                        <td>{item.description || 'Service'}</td>
                        <td>{formatMoney(amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {isInvoice ? (
                <div className="invoice-summary">
                  <div className="invoice-summary-total">
                    <p>Total</p>
                    <p>{formatMoney(total)}</p>
                  </div>
                </div>
              ) : null}

              {isInvoice ? (
                invoice.included || invoice.notIncluded || invoice.notes ? (
                  <div className="invoice-notes">
                    {invoice.included ? (
                      <div className="invoice-item-notes">
                        <h4>What is included</h4>
                        <p>{invoice.included}</p>
                      </div>
                    ) : null}
                    {invoice.notIncluded ? (
                      <div className="invoice-item-notes">
                        <h4>What is not included</h4>
                        <p>{invoice.notIncluded}</p>
                      </div>
                    ) : null}
                    {invoice.notes ? (
                      <div className="invoice-item-notes">
                        <h4>Notes</h4>
                        <p>{invoice.notes}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null
              ) : invoice.items.some(
                  (item) => item.included || item.notIncluded || item.notes
                ) ? (
                <div className="invoice-notes">
                  {invoice.items.map((item, itemIndex) => {
                    if (!item.included && !item.notIncluded && !item.notes) {
                      return null;
                    }
                    return (
                      <div className="invoice-item-notes" key={item.id}>
                        <h4>
                          {item.description
                            ? item.description
                            : `Line item ${itemIndex + 1}`}
                        </h4>
                        {item.included ? (
                          <p>
                            <strong>Included:</strong> {item.included}
                          </p>
                        ) : null}
                        {item.notIncluded ? (
                          <p>
                            <strong>Not included:</strong> {item.notIncluded}
                          </p>
                        ) : null}
                        {item.notes ? (
                          <p>
                            <strong>Notes:</strong> {item.notes}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <p className="invoice-terms">
                By making payment to BASSS NOW, you confirm that you have read
                and accepted the Terms & Conditions. Please review them before{' '}
                {isEstimate ? 'accepting the quote' : 'making payment'}.
              </p>

              <div className="invoice-footer">
                <a className="invoice-footer-link" href="tel:+94767426207">
                  {PHONE_TEXT}
                </a>
                <a
                  className="invoice-footer-link"
                  href="https://basss.now"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.basss.now
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState(() =>
    normalizePath(window.location.pathname)
  );
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return window.localStorage.getItem('invoice_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isInvoice = path === INVOICE_ROUTE;

  useEffect(() => {
    if (isInvoice) {
      return undefined;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInvoice]);

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (nextPath) => {
    const normalized = normalizePath(nextPath);
    window.history.pushState({}, '', normalized);
    setPath(normalized);
    window.scrollTo(0, 0);
  };

  if (isInvoice) {
    const handleUnlock = (event) => {
      event.preventDefault();
      const correctPassword = 'santhushpathumbasss26';
      if (passwordInput === correctPassword) {
        window.localStorage.setItem('invoice_unlocked', 'true');
        setIsUnlocked(true);
        setPasswordError('');
        return;
      }
      setPasswordError('Incorrect password.');
    };

    if (!isUnlocked) {
      return (
        <div className="invoice-page">
          <main className="invoice-main">
            <div className="container invoice-grid">
              <section className="invoice-form">
                <h2>Enter password</h2>
                <form onSubmit={handleUnlock} className="form-grid">
                  <div className="form-field">
                    <label htmlFor="invoice-password">Password</label>
                    <input
                      id="invoice-password"
                      type="password"
                      value={passwordInput}
                      onChange={(event) => {
                        setPasswordInput(event.target.value);
                        setPasswordError('');
                      }}
                    />
                  </div>
                  {passwordError ? (
                    <p className="invoice-hint">{passwordError}</p>
                  ) : null}
                  <button className="btn primary" type="submit">
                    Unlock
                  </button>
                </form>
              </section>
            </div>
          </main>
        </div>
      );
    }

    return <InvoicePage onBack={() => navigateTo('/')} />;
  }

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
                  No more chasing basss la.
                </span>
                <span className="subtext-line">
                  Book and manage your home repair entirely on WhatsApp.
                </span>
                <span className="subtext-line">
                  We handle estimations, billing, and repairs.
                </span>
                <span className="subtext-line">
                  You just schedule and pay.
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
              <p className='service-note'>Important: We currently serve Colombo district only.</p>

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

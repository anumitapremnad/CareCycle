import { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle, Check, XCircle } from 'lucide-react';

export default function SafetyDisclaimer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="safety-disclaimer" aria-labelledby="safety-disclaimer-title">
      <div className="safety-disclaimer__header">
        <div className="safety-disclaimer__icon-wrap">
          <ShieldAlert size={22} className="safety-disclaimer__icon" />
        </div>
        <div className="safety-disclaimer__main-text">
          <h2 id="safety-disclaimer-title" className="safety-disclaimer__title">
            Safety & Verification Notice (Prototype Platform)
          </h2>
          <p className="safety-disclaimer__description">
            CareCycle is a <strong>technology prototype demonstration</strong>. This application{' '}
            <strong>does not verify medicine safety, pharmaceutical authenticity, legal eligibility, or FDA/regulatory status</strong>{' '}
            of listed items. All items shown are fictional demo listings. Always consult a licensed healthcare professional and strictly follow local public health regulations before distributing or using medical supplies.
          </p>
        </div>
        <button
          type="button"
          className="safety-disclaimer__toggle-btn"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls="safety-rules-panel"
        >
          <span>{expanded ? 'Hide Safety Guidelines' : 'View Safety Standards'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div id="safety-rules-panel" className="safety-disclaimer__details">
          <div className="safety-grid">
            <div className="safety-card safety-card--allowed">
              <div className="safety-card__head">
                <Check size={18} className="safety-card__head-icon" />
                <h4>Acceptable Prototype Categories</h4>
              </div>
              <ul>
                <li>Factory-sealed, unopened over-the-counter (OTC) health supplies</li>
                <li>Sterile, intact first aid goods (gauze, adhesive bandages, paper tape)</li>
                <li>Sanitized, inspectable durable medical equipment (walkers, crutches, canes)</li>
                <li>Unopened non-perishable testing accessories (sealed alcohol wipes, lancets)</li>
              </ul>
            </div>

            <div className="safety-card safety-card--prohibited">
              <div className="safety-card__head">
                <XCircle size={18} className="safety-card__head-icon" />
                <h4>Strictly Prohibited Items</h4>
              </div>
              <ul>
                <li>Prescription drugs (Rx), antibiotics, opioids, or controlled medications</li>
                <li>Any opened, unsealed, or unlabeled medications or liquids</li>
                <li>Expired medical supplies, test strips, or ointments</li>
                <li>Used sharps, needles, syringes, or invasive medical hardware</li>
              </ul>
            </div>
          </div>

          <div className="safety-disclaimer__footer-note">
            <AlertTriangle size={16} />
            <span>
              Disclaimer: CareCycle does not operate as a pharmacy, dispensary, or medical provider. Community members exchange items at their own discretion following local health laws.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

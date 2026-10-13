import { useEffect } from 'react';
import { X, Heart, ShieldCheck, RefreshCw, MapPin, PackageCheck } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose, onOpenAddModal }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container modal-container--wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
      >
        <div className="modal-header">
          <div className="modal-header__icon-box">
            <Heart size={22} />
          </div>
          <div className="modal-header__text">
            <h3 id="how-it-works-title" className="modal-title">
              How CareCycle Works
            </h3>
            <p className="modal-subtitle">
              Care, passed forward — redistributing surplus supplies to eliminate health waste.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-content">
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-number">01</div>
              <div className="pillar-icon-box">
                <PackageCheck size={22} />
              </div>
              <h4 className="pillar-title">1. Catalog Surplus</h4>
              <p className="pillar-text">
                Individuals and clinics catalog unopened, unexpired first aid items, mobility aids, and diagnostic supplies that would otherwise go unused.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-number">02</div>
              <div className="pillar-icon-box">
                <MapPin size={22} />
              </div>
              <h4 className="pillar-title">2. Local Hub Coordination</h4>
              <p className="pillar-text">
                Supplies are routed through verified community pantries, senior centers, or volunteer desks for convenient, safe local pickup.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-number">03</div>
              <div className="pillar-icon-box">
                <RefreshCw size={22} />
              </div>
              <h4 className="pillar-title">3. Pass Care Forward</h4>
              <p className="pillar-text">
                Neighbors in need request available items with dignity, zero financial barrier, and complete transparency.
              </p>
            </div>
          </div>

          <div className="info-notice-card">
            <ShieldCheck size={20} className="info-notice-icon" />
            <div>
              <strong>Strict Safety & Integrity Guardrails</strong>
              <p>
                CareCycle is strictly designed for non-prescription supplies, unopened OTC care, and inspectable durable mobility hardware. No prescription pharmaceuticals are permitted.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onClose}
          >
            Got It
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              onClose();
              onOpenAddModal();
            }}
          >
            <span>Donate an Item Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { ShieldCheck, Clock, AlertCircle, HelpCircle } from 'lucide-react';
import { TRUST_STATUS_DEFINITIONS } from '../data/mockData';

export default function TrustBadge({ status = 'demo_profile', showDetails = false }) {
  const meta = TRUST_STATUS_DEFINITIONS[status] || TRUST_STATUS_DEFINITIONS.demo_profile;

  const renderIcon = () => {
    switch (meta.variant) {
      case 'verified':
        return <ShieldCheck size={14} className="trust-badge__icon" />;
      case 'pending':
        return <Clock size={14} className="trust-badge__icon" />;
      case 'unverified':
        return <AlertCircle size={14} className="trust-badge__icon" />;
      default:
        return <HelpCircle size={14} className="trust-badge__icon" />;
    }
  };

  return (
    <div className={`trust-badge-container trust-badge--${meta.variant}`}>
      <span className="trust-badge" title={meta.description}>
        {renderIcon()}
        <span className="trust-badge__text">{meta.shortLabel}</span>
      </span>
      {showDetails && (
        <p className="trust-badge__desc-inline">
          <small>{meta.description}</small>
        </p>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  ShieldCheck,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { TRUST_STATUS_DEFINITIONS } from '../data/mockData';

export default function VerificationRequestView({
  coordinatorHub,
  verifications,
  onSubmitVerification,
}) {
  const existingRequest = verifications.find((v) => v.hubId === coordinatorHub.id);

  const [formData, setFormData] = useState({
    orgName: coordinatorHub.name || '',
    orgType: coordinatorHub.type || 'Nonprofit Community Center',
    contactPerson: coordinatorHub.coordinatorName || '',
    contactEmail: coordinatorHub.contact?.email || '',
    contactPhone: coordinatorHub.contact?.phone || '',
    explanation: '',
  });

  const [errors, setErrors] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.orgName.trim()) errs.orgName = 'Organization name is required.';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.';
    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      errs.contactEmail = 'A valid email address is required.';
    }
    if (!formData.contactPhone.trim()) errs.contactPhone = 'Contact phone number is required.';
    if (!formData.explanation.trim() || formData.explanation.trim().length < 20) {
      errs.explanation = 'Please provide at least 20 characters explaining your organization & facilities.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      onSubmitVerification({
        hubId: coordinatorHub.id,
        orgName: formData.orgName.trim(),
        orgType: formData.orgType,
        contactPerson: formData.contactPerson.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        explanation: formData.explanation.trim(),
      });
      setSubmittedSuccess(true);
    }
  };

  return (
    <section className="verification-request-view" aria-labelledby="verification-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge">
            <ShieldCheck size={14} />
            <span>Demonstration Trust System</span>
          </div>
          <h2 id="verification-title" className="view-title">
            Organization Verification Request
          </h2>
          <p className="view-subtitle">
            Coordinators can submit their hub credentials for demo administrative review to earn an &ldquo;Admin Verified (Demo)&rdquo; badge.
          </p>
        </div>
      </div>

      <div className="trust-tiers-explainer">
        <h3 className="explainer-heading">Transparent Trust Status Tiers</h3>
        <p className="explainer-subtext">
          Understand how demonstration trust badges are assigned across the network:
        </p>
        <div className="trust-tiers-grid">
          {Object.entries(TRUST_STATUS_DEFINITIONS).map(([key, item]) => (
            <div key={key} className={`trust-tier-card trust-tier-card--${item.variant}`}>
              <div className="trust-tier-card__head">
                <span className="trust-tier-label">{item.shortLabel}</span>
              </div>
              <p className="trust-tier-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-disclaimer-pill mt-4">
        <Info size={14} />
        <span>
          <strong>Prototype Disclosure:</strong> This review workflow demonstrates platform moderation concepts. It does not perform real-world background checks, FDA inspection, or legal certification.
        </span>
      </div>

      {existingRequest ? (
        <div className="existing-request-card">
          <div className="existing-request-header">
            <div className="existing-request-icon">
              {existingRequest.status === 'approved' && <CheckCircle2 size={24} className="text-mint" />}
              {existingRequest.status === 'pending' && <Clock size={24} className="text-peach" />}
              {existingRequest.status === 'rejected' && <XCircle size={24} className="text-danger" />}
            </div>
            <div>
              <h3 className="existing-request-title">
                Verification Request Status: <span className="capitalize">{existingRequest.status}</span>
              </h3>
              <p className="existing-request-date">
                Submitted on {new Date(existingRequest.submittedAt).toLocaleDateString()} for {coordinatorHub.name}
              </p>
            </div>
          </div>

          <div className="existing-request-body">
            <p><strong>Organization:</strong> {existingRequest.orgName} ({existingRequest.orgType})</p>
            <p><strong>Representative:</strong> {existingRequest.contactPerson} ({existingRequest.contactEmail})</p>
            <p><strong>Submission Statement:</strong> {existingRequest.explanation}</p>
            {existingRequest.reviewerNotes && (
              <div className="reviewer-notes-box">
                <strong>Administrator Review Notes:</strong>
                <p>{existingRequest.reviewerNotes}</p>
              </div>
            )}
          </div>
        </div>
      ) : submittedSuccess ? (
        <div className="alert-success-card">
          <CheckCircle2 size={24} />
          <div>
            <h4>Verification Request Submitted!</h4>
            <p>Your request has been placed in the Administrator Review Queue for demonstration evaluation.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="verification-form card" noValidate>
          <h3 className="form-heading">Submit Review Application for {coordinatorHub.name}</h3>

          <div className="form-grid-2">
            <div className={`form-field ${errors.orgName ? 'form-field--error' : ''}`}>
              <label htmlFor="ver-org-name" className="form-label">
                Organization Name <span className="required-star">*</span>
              </label>
              <input
                id="ver-org-name"
                type="text"
                className="form-input"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
              {errors.orgName && <span className="field-error-message"><AlertCircle size={13} /> {errors.orgName}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="ver-org-type" className="form-label">
                Organization Classification
              </label>
              <select
                id="ver-org-type"
                className="form-select"
                value={formData.orgType}
                onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
              >
                <option value="Nonprofit Community Center">Nonprofit Community Center</option>
                <option value="Student Volunteer Group">Student Volunteer Group</option>
                <option value="Senior Support Network">Senior Support Network</option>
                <option value="Community Health Pantry">Community Health Pantry</option>
                <option value="Authorized Clinic Partner">Authorized Clinic Partner</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className={`form-field ${errors.contactPerson ? 'form-field--error' : ''}`}>
              <label htmlFor="ver-contact-person" className="form-label">
                Primary Coordinator / Lead <span className="required-star">*</span>
              </label>
              <input
                id="ver-contact-person"
                type="text"
                className="form-input"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
              {errors.contactPerson && <span className="field-error-message"><AlertCircle size={13} /> {errors.contactPerson}</span>}
            </div>

            <div className={`form-field ${errors.contactEmail ? 'form-field--error' : ''}`}>
              <label htmlFor="ver-contact-email" className="form-label">
                Official Email Address <span className="required-star">*</span>
              </label>
              <input
                id="ver-contact-email"
                type="email"
                className="form-input"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
              {errors.contactEmail && <span className="field-error-message"><AlertCircle size={13} /> {errors.contactEmail}</span>}
            </div>
          </div>

          <div className={`form-field ${errors.contactPhone ? 'form-field--error' : ''}`}>
            <label htmlFor="ver-contact-phone" className="form-label">
              Contact Phone Number <span className="required-star">*</span>
            </label>
            <input
              id="ver-contact-phone"
              type="tel"
              className="form-input"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
            {errors.contactPhone && <span className="field-error-message"><AlertCircle size={13} /> {errors.contactPhone}</span>}
          </div>

          <div className={`form-field ${errors.explanation ? 'form-field--error' : ''}`}>
            <label htmlFor="ver-explanation" className="form-label">
              Facility Description &amp; Storage Procedures <span className="required-star">*</span>
            </label>
            <textarea
              id="ver-explanation"
              rows={4}
              className="form-textarea"
              placeholder="Describe your storage facility (climate control, lockboxes, designated coordinator intake) and non-prescription supply verification protocol..."
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            />
            {errors.explanation && <span className="field-error-message"><AlertCircle size={13} /> {errors.explanation}</span>}
          </div>

          <div className="form-actions-right">
            <button type="submit" className="btn btn--primary">
              <Send size={16} />
              <span>Submit Verification Request</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

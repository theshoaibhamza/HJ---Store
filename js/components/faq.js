// Modern FAQ Accordion JS: smooth open/close, accessibility, and keyboard support
// Usage: import or include in your main JS bundle

document.addEventListener('DOMContentLoaded', function () {
  const accordions = document.querySelectorAll('.accordion[is="accordion-disclosure"]');
  accordions.forEach((accordion, idx) => {
    const summary = accordion.querySelector('summary');
    if (!summary) return;

    // Add ARIA attributes
    summary.setAttribute('role', 'button');
    summary.setAttribute('tabindex', '0');
    summary.setAttribute('aria-expanded', accordion.hasAttribute('open'));
    summary.setAttribute('aria-controls', `faq-panel-${idx}`);
    const content = accordion.querySelector('.accordion__content');
    if (content) {
      content.setAttribute('id', `faq-panel-${idx}`);
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', `faq-summary-${idx}`);
      summary.setAttribute('id', `faq-summary-${idx}`);
    }

    // Keyboard support
    summary.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        summary.click();
      }
    });

    // Animate open/close
    accordion.addEventListener('toggle', function () {
      summary.setAttribute('aria-expanded', accordion.open);
    });
  });
});

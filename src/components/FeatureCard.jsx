import { useEffect, useRef, useState } from 'react';

export default function FeatureCard({ icon, iconColor, title, text, linkHref, linkLabel, index }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delay = (index % 3) * 90;

  return (
    <article
      className={`feature-card${isVisible ? ' is-visible' : ''}`}
      ref={cardRef}
      style={isVisible ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="feature-card__icon" style={{ '--icon-color': iconColor }}>
        {icon}
      </div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__text">{text}</p>
      <a href={linkHref} className="feature-card__link">
        {linkLabel} →
      </a>
    </article>
  );
}

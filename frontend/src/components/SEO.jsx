import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image, structuredData }) => {
  const defaultTitle = 'Aura Homeopathy - Your Natural Healing Partner';
  const defaultDescription = 'Aura Homeopathy offers top quality homeopathic medicines, treatments, and expert doctor consultations for natural and holistic healing.';
  const defaultImage = `${window.location.origin}/logo.png`; // Fallback image

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | Aura Homeopathy` : defaultTitle}</title>
      <meta name='description' content={description || defaultDescription} />
      
      {/* Open Graph tags for social sharing */}
      <meta property="og:type" content={type || "website"} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name || "Aura Homeopathy"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

import React from 'react';

const AboutHomeopathy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">About Homeopathy</h1>
        <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
        <p className="text-xl text-emerald-700 max-w-3xl mx-auto leading-relaxed">
          Homeopathy is a well-established holistic system of wellness that has been practiced for over two centuries. It is based on the philosophy of supporting the body’s natural balance and overall well-being through specially prepared remedies.
        </p>
      </div>

      <div className="space-y-16">
        
        {/* Introduction */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow">
          <h2 className="text-3xl font-semibold text-emerald-800 mb-6 border-b border-emerald-100 pb-4">Introduction</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Homeopathy takes an individualized approach, recognizing that each person is unique and may require personalized care based on their physical, emotional, and mental state.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Widely appreciated for its gentle and patient-focused philosophy, homeopathy continues to be chosen by people around the world as part of their complementary wellness journey.
          </p>
        </section>

        {/* History of Homeopathy */}
        <section className="bg-emerald-900 text-emerald-50 p-8 md:p-10 rounded-2xl shadow-sm">
          <h2 className="text-3xl font-semibold mb-6 border-b border-emerald-800 pb-4 text-white">History of Homeopathy</h2>
          <div className="space-y-4 text-emerald-100/90 text-lg leading-relaxed">
            <p>
              Homeopathy was founded by Dr. Samuel Hahnemann, a German physician, in the late 18th century. At a time when medical practices often involved harsh treatments, Dr. Hahnemann sought a more compassionate and patient-centered healing approach.
            </p>
            <p>
              In 1790, while translating a medical book, he developed the principle that became the foundation of homeopathy: <strong>“Like cures like”</strong>. This concept suggests that a substance capable of producing certain symptoms in a healthy individual may, when specially prepared, be used to support individuals experiencing similar symptoms.
            </p>
            <p>
              In 1810, Dr. Hahnemann published <em>The Organon of Medicine</em>, the foundational text of homeopathic philosophy and practice. Over the years, homeopathy expanded from Germany into Europe, the United Kingdom, the United States, India, and many other parts of the world.
            </p>
            <p>
              Today, homeopathy has a strong global presence and remains an important complementary wellness system in many countries.
            </p>
          </div>
        </section>

        {/* Core Philosophy */}
        <section>
          <h2 className="text-3xl font-semibold text-emerald-900 mb-8 text-center">Core Philosophy of Homeopathy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-3">Holistic Wellness</h3>
              <p className="text-gray-700 leading-relaxed">
                Homeopathy focuses on the whole individual rather than isolated symptoms. Practitioners often consider emotional well-being, stress levels, lifestyle habits, temperament, sleep patterns, and general health to create a personalized wellness approach.
              </p>
            </div>
            <div className="bg-emerald-50 p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-3">Individualized Care</h3>
              <p className="text-gray-700 leading-relaxed">
                A defining feature of homeopathy is personalization. Even if two individuals experience similar health concerns, their overall health profiles may differ, leading to different remedy selections based on individual needs.
              </p>
            </div>
            <div className="bg-emerald-50 p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-3">Natural Healing Support</h3>
              <p className="text-gray-700 leading-relaxed">
                Homeopathy is based on the philosophy of encouraging the body’s natural healing responses and maintaining internal balance.
              </p>
            </div>
            <div className="bg-emerald-50 p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-3">Gentle Approach</h3>
              <p className="text-gray-700 leading-relaxed">
                Homeopathy is often chosen by individuals seeking a gentle, non-invasive complementary wellness option that fits into a balanced lifestyle.
              </p>
            </div>
          </div>
        </section>

        {/* Preparation */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Preparation of Homeopathic Remedies</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Homeopathic remedies are prepared through a traditional process involving dilution and succussion (a specific method of shaking). Remedies may be derived from various natural sources, including:
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <li className="flex items-center gap-2 text-emerald-700 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Plants</li>
            <li className="flex items-center gap-2 text-emerald-700 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Minerals</li>
            <li className="flex items-center gap-2 text-emerald-700 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Natural compounds</li>
            <li className="flex items-center gap-2 text-emerald-700 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Biological sources</li>
          </ul>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commonly available in forms such as:</h3>
          <div className="flex flex-wrap gap-3">
            {['Tablets', 'Pellets', 'Liquid drops', 'Dilutions', 'Mother tinctures', 'Ointments', 'Creams'].map(form => (
              <span key={form} className="px-5 py-2.5 bg-emerald-50 text-emerald-800 rounded-full text-sm font-medium border border-emerald-100 hover:bg-emerald-100 transition">
                {form}
              </span>
            ))}
          </div>
        </section>

        {/* Consultation Experience */}
        <section className="bg-emerald-900 text-emerald-50 p-8 md:p-10 rounded-2xl shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6 text-white">Homeopathic Consultation Experience</h2>
              <p className="text-emerald-100/90 text-lg leading-relaxed mb-6">
                A homeopathic consultation is often more detailed than a standard brief health consultation. This individualized consultation process is one reason many people appreciate the homeopathic approach. Practitioners may discuss:
              </p>
            </div>
            <div className="bg-emerald-800 p-6 rounded-xl">
              <ul className="grid grid-cols-2 gap-4">
                {[
                  'Current concerns', 'Medical background', 'Sleep habits', 
                  'Energy levels', 'Emotional well-being', 'Stress factors', 
                  'Dietary preferences', 'Lifestyle patterns', 'Personal sensitivities'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-emerald-100 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Global Popularity & Why Choose */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Global Popularity</h2>
            <p className="text-gray-700 mb-6">
              Homeopathy is practiced in many countries worldwide and has established recognition in various complementary healthcare settings. India, in particular, has one of the largest homeopathy communities in the world.
            </p>
            <div className="flex flex-wrap gap-2">
              {['India', 'Germany', 'United Kingdom', 'France', 'Brazil', 'Switzerland', 'South Africa', 'Mexico'].map(country => (
                <span key={country} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-sm font-medium">
                  {country}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Why People Choose Homeopathy</h2>
            <ul className="space-y-3">
              {[
                'Personalized wellness support',
                'Holistic philosophy',
                'Individual-focused consultations',
                'Gentle complementary care approach',
                'Long-standing traditional use',
                'Compatibility with broader wellness routines'
              ].map(reason => (
                <li key={reason} className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Lifestyle & Vision */}
        <section className="bg-emerald-50 p-8 md:p-10 rounded-2xl border border-emerald-100 text-center">
          <h2 className="text-2xl font-semibold text-emerald-900 mb-4">Homeopathy and Wellness Lifestyle</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
            Homeopathy is often included as part of a broader wellness-focused lifestyle that may include balanced nutrition, stress management, healthy sleep habits, physical activity, mindfulness practices, and preventive wellness care.
          </p>
          
          <div className="w-16 h-px bg-emerald-300 mx-auto mb-8"></div>
          
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Vision of Homeopathy</h2>
          <p className="text-xl text-emerald-800 max-w-4xl mx-auto leading-relaxed italic">
            "The philosophy behind homeopathy emphasizes balance, harmony, and individualized care. Its long history, patient-centered consultations, and holistic approach continue to make it a meaningful wellness option for many individuals worldwide."
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutHomeopathy;

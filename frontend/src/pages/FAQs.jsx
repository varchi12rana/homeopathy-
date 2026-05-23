import React, { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is homeopathy?",
      answer: "Homeopathy is a natural system of medicine based on the principle of 'like cures like'. It uses highly diluted substances to trigger the body's natural healing system."
    },
    {
      question: "Are homeopathic medicines safe?",
      answer: "Yes, homeopathic medicines are considered safe and non-toxic because they are highly diluted. They can generally be used alongside conventional medications."
    },
    {
      question: "How long does it take for homeopathic medicines to work?",
      answer: "The time it takes to see results varies depending on the condition and the individual. Acute conditions may respond quickly, while chronic conditions may take weeks or months."
    },
    {
      question: "Can I take homeopathic medicines with my prescription drugs?",
      answer: "Generally, yes. Homeopathic medicines do not typically interact with conventional drugs. However, it's always best to consult with your healthcare provider or our online doctors if you have concerns."
    },
    {
      question: "How should I store my homeopathic medicines?",
      answer: "Store them in a cool, dry place away from direct sunlight, strong odors, and electromagnetic fields (like microwaves or televisions)."
    }
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6 text-center">Frequently Asked Questions</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-emerald-100 pb-4 last:border-b-0 last:pb-0">
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-medium text-emerald-800 text-lg">{faq.question}</span>
                <span className="text-emerald-500 text-2xl">{openIndex === index ? '-' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="mt-3 text-gray-700 leading-relaxed pr-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;

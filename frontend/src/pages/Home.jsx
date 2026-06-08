import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import FAQs from './FAQs';
import { ShieldCheck, Truck, Users, CreditCard, Leaf, ArrowRight, HeartPulse, Sparkles, Smile, Star, Phone } from 'lucide-react';
import SEO from '../components/SEO';

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?isBestSeller=true');
        setBestsellers(data.slice(0, 8)); // Get up to 8 bestsellers
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const companies = [
    { name: "Boiron", country: "France", tagline: "World Leader in Homeopathy" },
    { name: "Dr. Willmar Schwabe", country: "Germany", tagline: "Nature's Healing Power" },
    { name: "SBL", country: "India", tagline: "Excellence in Homeopathy" },
    { name: "Bakson's", country: "India", tagline: "Quality & Trust" },
    { name: "Wheezal", country: "India", tagline: "Cure with Care" },
    { name: "Bjain", country: "India", tagline: "Purity & Efficacy" },
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-800">
      <SEO 
        title="Buy Homeopathic Medicines Online" 
        description="Aura Homeopathy is your trusted destination to buy top quality homeopathic medicines online. Discover treatments for various diseases and consult with expert doctors." 
      />
      
      {/* 3. Hero Section (Video Background) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
              <Sparkles size={16} /> 100% Natural Remedies
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-emerald-950 leading-tight mb-6">
              Naturally Better,<br/>
              <span className="text-emerald-600">Holistically You.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Experience the gentle power of nature. Discover authentic homeopathic treatments that heal from within without side effects.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-emerald-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-emerald-600/30 flex items-center gap-2">
                Shop Now <ArrowRight size={20} />
              </Link>
              <button onClick={() => setShowHowItWorks(true)} className="bg-white text-emerald-700 border border-emerald-200 px-8 py-3.5 rounded-full font-semibold hover:bg-emerald-50 transition shadow-sm">
                How Homeopathy Works
              </button>
            </div>
          </div>


        </div>
      </section>

      {/* 4. Trust Feature Icons Row */}
      <section className="bg-white border-y border-emerald-50 relative z-20 -mt-10 mx-4 sm:mx-8 rounded-2xl shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Leaf size={28}/></div>
              <span className="font-medium text-slate-700">100% Natural</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Users size={28}/></div>
              <span className="font-medium text-slate-700">Trusted by Millions</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><HeartPulse size={28}/></div>
              <span className="font-medium text-slate-700">Expert Guidance</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CreditCard size={28}/></div>
              <span className="font-medium text-slate-700">Secure Payments</span>
            </div>
            <div className="flex flex-col items-center gap-3 col-span-2 md:col-span-4 lg:col-span-1">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Truck size={28}/></div>
              <span className="font-medium text-slate-700">Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>


      {/* 6. Top Homeopathic Companies (Horizontal Scroll) */}
      <section className="py-16 bg-emerald-900 overflow-hidden relative">
        <div className="container mx-auto px-4 mb-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Our Trusted Partners</h2>
          <p className="text-emerald-200">We source only from the world's most reputed homeopathic pharmacies.</p>
        </div>
        
        {/* Marquee Container */}
        <div className="flex w-[200%] md:w-[150%] animate-scroll hover:[animation-play-state:paused]">
          {/* Double the list for infinite effect */}
          {[...companies, ...companies].map((company, idx) => (
            <div key={idx} className="w-72 flex-shrink-0 mx-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition cursor-pointer group">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition">
                <span className="font-bold text-emerald-800 text-xl">{company.name[0]}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{company.name}</h3>
              <p className="text-emerald-300 text-sm mb-3">{company.country}</p>
              <span className="text-xs text-white/70 bg-black/20 px-3 py-1 rounded-full">{company.tagline}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Best Selling Remedies */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Best Selling Remedies</h2>
            <p className="text-slate-600">Our most trusted and effective homeopathic medicines.</p>
          </div>
          <Link to="#" className="text-emerald-600 font-medium hover:text-emerald-800 hidden sm:flex items-center gap-1">
            View All <ArrowRight size={16}/>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : bestsellers.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-2xl shadow-sm">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestsellers.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 8. Consultation Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-emerald-50 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center border border-emerald-100">
          <div className="p-10 md:p-16 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-800 text-sm font-medium mb-6 shadow-sm">
              <ShieldCheck size={16} /> Certified Doctors
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mb-6">
              Need Personal Guidance?
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Not sure which remedy is right for you? Consult with our expert homeopaths online and get a personalized treatment plan tailored to your symptoms.
            </p>
            {!showContactOptions ? (
              <button 
                onClick={() => setShowContactOptions(true)}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-3"
              >
                <Phone size={20} /> Consult Now
              </button>
            ) : (
              <div className="flex flex-wrap gap-4 animate-fade-in-up">
                <a href="tel:9638930188" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-3">
                  <Phone size={20} /> Dial
                </a>
                <a href="https://wa.me/919638930188?text=Hello,%20I%20would%20like%20to%20consult%20with%20a%20doctor." target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#128C7E] transition shadow-lg flex items-center gap-3">
                  Message on WhatsApp
                </a>
              </div>
            )}
          </div>
          <div className="flex-1 relative h-64 md:h-auto w-full">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" alt="Doctor Consultation" className="absolute inset-0 w-full h-full object-cover object-center md:rounded-l-[100px]" />
          </div>
        </div>
      </section>

      {/* 9. Statistics Section */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-600">
            <div className="py-4">
              <div className="text-5xl font-extrabold mb-2">25+</div>
              <div className="text-emerald-200 text-lg font-medium">Years of Trust</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-extrabold mb-2">10K+</div>
              <div className="text-emerald-200 text-lg font-medium">Happy Customers</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-extrabold mb-2">5000+</div>
              <div className="text-emerald-200 text-lg font-medium">Remedies Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQs Section */}
      <section className="py-12 bg-white">
        <FAQs />
      </section>

      {/* 11. Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Healing Stories</h2>
            <p className="text-slate-600">Real experiences from our community of wellness.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Verified Buyer", text: "The Arnica cream works wonders for my joint pain. So glad I found a natural alternative that actually delivers results.", rating: 5 },
              { name: "Rahul Sharma", role: "Patient", text: "The consultation process was smooth. The doctor understood my chronic migraines and prescribed remedies that have reduced the frequency significantly.", rating: 5 },
              { name: "Emma Woods", role: "Mother", text: "I trust HOMEOVIA for my kids' mild fevers and teething issues. The medicines are gentle, safe, and arrived very quickly.", rating: 4 }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 relative">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-emerald-600 font-bold text-xl">
                    {review.name[0]}
                  </div>
                </div>
                <div className="flex gap-1 mb-4 mt-2 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />)}
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-emerald-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. How Homeopathy Works Modal */}
      {showHowItWorks && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center overflow-hidden m-0 p-0">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative animate-pop-in m-auto z-[10000]">
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="flex justify-center items-center mb-6">
              <img src="/logo%202.png" alt="Logo" className="h-16 w-16 object-contain translate-y-1" />
              <img 
                src="/logo%20font.png" 
                alt="HOMEOVIA" 
                className="h-6 w-auto object-contain -ml-2" 
                style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(87%) saturate(543%) hue-rotate(113deg) brightness(95%) contrast(92%)' }} 
              />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-900 mb-4">How Homeopathy Works</h3>
            <div className="text-slate-600 space-y-4 leading-relaxed">
              <p>
                Homeopathy is a traditional system of medicine based on individualized remedy selection and the principle of <strong className="text-emerald-800">“like cures like.”</strong>
              </p>
              <p>
                Remedies are prepared through specialized dilution methods and chosen according to specific symptom patterns.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-6 rounded-r-md text-amber-900 text-sm font-medium">
                <strong>Important:</strong> Always use products as directed and seek professional medical advice for serious health concerns.
              </div>
            </div>
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="mt-8 w-full bg-emerald-600 text-white py-3.5 rounded-full font-bold hover:bg-emerald-700 transition shadow-md"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;

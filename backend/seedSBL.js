const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const sblMedicines = [
  "Aconitum Napellus", "Allium Cepa", "Aloe Socotrina", "Antimonium Tartaricum", "Apis Mellifica",
  "Argentum Nitricum", "Arnica Montana", "Arsenicum Album", "Belladonna", "Bryonia Alba",
  "Calcarea Carbonica", "Calcarea Fluorica", "Calcarea Phosphorica", "Calendula Officinalis", "Cantharis",
  "Carbo Vegetabilis", "Causticum", "Chamomilla", "Cinchona Officinalis", "Cocculus Indicus",
  "Coffea Cruda", "Colocynthis", "Conium Maculatum", "Cuprum Metallicum", "Drosera Rotundifolia",
  "Dulcamara", "Eupatorium Perfoliatum", "Euphrasia Officinalis", "Ferrum Phosphoricum", "Gelsemium Sempervirens",
  "Glonoinum", "Graphites", "Hepar Sulphuris Calcareum", "Hypericum Perforatum", "Ignatia Amara",
  "Ipecacuanha", "Kali Bichromicum", "Kali Carbonicum", "Kali Phosphoricum", "Lachesis Muta",
  "Ledum Palustre", "Lycopodium Clavatum", "Magnesia Phosphorica", "Mercurius Solubilis", "Natrum Muriaticum",
  "Natrum Phosphoricum", "Natrum Sulphuricum", "Nux Vomica", "Phosphorus", "Phytolacca Decandra",
  "Pulsatilla Nigricans", "Rhus Toxicodendron", "Ruta Graveolens", "Sepia Officinalis", "Silicea",
  "Spongia Tosta", "Staphysagria", "Sulphur", "Symphytum Officinale", "Thuja Occidentalis"
];

const generateProducts = () => {
  return sblMedicines.map((med, index) => {
    return {
      name: med,
      image: 'https://cdn.pixabay.com/photo/2015/12/06/18/28/capsules-1079838_1280.jpg',
      description: `${med} is a highly effective homeopathic medicine formulated by SBL for comprehensive care and holistic healing.`,
      company: 'SBL',
      price: Math.floor(Math.random() * 50) + 80, // Price between 80 and 130
      stock: Math.floor(Math.random() * 100) + 20, // Stock between 20 and 120
      potency: index % 3 === 0 ? '30C' : index % 2 === 0 ? '200C' : '6X',
      dilution: 'Liquid',
      motherTincture: false,
    };
  });
};

const importSBLData = async () => {
  try {
    const products = generateProducts();
    await Product.insertMany(products);

    console.log(`Successfully added ${products.length} SBL medicines!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importSBLData();

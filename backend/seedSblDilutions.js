const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const rawProducts = [
  { "name": "A.C.T.H", "price": "160" },
  { "name": "ABEL MOSCHUS", "price": "160" },
  { "name": "ABIES CANADENSIS", "price": "110" },
  { "name": "ABIES NIGRA", "price": "160" },
  { "name": "Abroma Augusta", "price": "160" },
  { "name": "ABROMA RADIX", "price": "160" },
  { "name": "ABROTANUM - DL", "price": "110" },
  { "name": "ABRUS PRECATORIUS", "price": "160" },
  { "name": "ABSINTHIUM", "price": "160" },
  { "name": "ACALYPHA INDICA", "price": "160" },
  { "name": "ACER NEGUNDO", "price": "160" },
  { "name": "ACETANILIDUM", "price": "160" },
  { "name": "ACHYRANTHES ASPERA", "price": "160" },
  { "name": "ACIDUM ACETYLSALICYLICUM", "price": "160" },
  { "name": "ACIDUM ASCORBICUM", "price": "160" },
  { "name": "Acidum Benzoicum", "price": "160" },
  { "name": "ACIDUM BORACICUM", "price": "160" },
  { "name": "ACIDUM BUTYRICUM", "price": "160" },
  { "name": "ACIDUM CARBOLICUM", "price": "160" },
  { "name": "ACIDUM CHROMICUM", "price": "160" },
  { "name": "ACIDUM CHRYSOPHANICUM", "price": "160" },
  { "name": "ACIDUM CITRICUM", "price": "160" },
  { "name": "ACIDUM GALLICUM", "price": "160" },
  { "name": "ACIDUM HIPPURICUM", "price": "160" },
  { "name": "ACIDUM HYDROCYANICUM", "price": "160" },
  { "name": "ACIDUM HYDROFLUORICUM", "price": "160" },
  { "name": "ACIDUM LACTICUM", "price": "160" },
  { "name": "ACIDUM NITROMURIATICUM", "price": "160" },
  { "name": "ACIDUM OXALICUM", "price": "160" },
  { "name": "ACIDUM PICRICUM", "price": "160" }
];

const seedDilutions = async () => {
  try {
    await connectDB();
    await Product.deleteMany(); // remove previous product as requested
    
    const products = rawProducts.map((p, index) => {
      // Capitalize first letter of each word
      let formattedName = p.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      return {
        name: formattedName,
        price: Number(p.price) || 160,
        company: 'SBL',
        image: 'https://cdn.pixabay.com/photo/2018/02/04/10/06/homeopathy-3129532_1280.jpg', // Professional image
        description: `Authentic ${formattedName} dilution from SBL Global.`,
        stock: Math.floor(Math.random() * 50) + 10,
        potency: index % 2 === 0 ? '30C' : '200C',
        dilution: 'Liquid',
        motherTincture: false,
      };
    });

    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} SBL dilutions from the link!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedDilutions();

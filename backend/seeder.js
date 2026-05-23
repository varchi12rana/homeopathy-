const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const sampleProducts = [
  {
    name: 'Arnica Montana',
    image: 'https://cdn.pixabay.com/photo/2014/12/10/20/48/laboratory-563423_1280.jpg',
    description: 'Arnica montana is a homeopathic medicine that relieves muscle pain and stiffness, swelling from injuries, and discoloration from bruising.',
    company: 'SBL',
    price: 100,
    stock: 50,
    potency: '30C',
    dilution: 'Liquid',
    motherTincture: false,
  },
  {
    name: 'Nux Vomica',
    image: 'https://cdn.pixabay.com/photo/2017/02/09/16/08/glass-2052738_1280.jpg',
    description: 'Nux Vomica is excellent for digestive issues, heartburn, and hangover symptoms.',
    company: 'Wheezal',
    price: 95,
    stock: 30,
    potency: '200C',
    dilution: 'Globules',
    motherTincture: false,
  },
  {
    name: 'Rhus Tox',
    image: 'https://cdn.pixabay.com/photo/2016/07/24/21/01/thermometer-1539191_1280.jpg',
    description: 'Relieves joint pain improved by motion and worsened by cold, damp weather.',
    company: 'WSI',
    price: 110,
    stock: 40,
    potency: '6X',
    dilution: 'Liquid',
    motherTincture: false,
  },
  {
    name: 'Calendula Officinalis',
    image: 'https://cdn.pixabay.com/photo/2015/12/06/18/28/capsules-1079838_1280.jpg',
    description: 'Excellent for wound healing and preventing infections in minor cuts and scrapes.',
    company: 'Dr. Reckeweg',
    price: 150,
    stock: 20,
    potency: 'Q',
    dilution: 'Liquid',
    motherTincture: true,
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      }
    ]);

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();

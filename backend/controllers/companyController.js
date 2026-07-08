const Company = require('../models/Company');

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, showOnSlider, country, tagline } = req.body;
    const companyExists = await Company.findOne({ name });

    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = await Company.create({ 
      name,
      showOnSlider: showOnSlider || false,
      country: country || 'India',
      tagline: tagline || 'Excellence in Homeopathy'
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      await company.deleteOne();
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, showOnSlider, country, tagline } = req.body;
    const company = await Company.findById(req.params.id);

    if (company) {
      company.name = name || company.name;
      if (showOnSlider !== undefined) company.showOnSlider = showOnSlider;
      if (country !== undefined) company.country = country;
      if (tagline !== undefined) company.tagline = tagline;

      const updatedCompany = await company.save();
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};

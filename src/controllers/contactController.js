const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  const { name, mobile, message } = req.body;
  try {
    const contact = await Contact.create({ name, mobile, message });
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitContact, getAllContacts };

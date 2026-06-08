const { getCollections } = require('../config/database');

const getConversations = async (req, res) => {
  try {
    const { messages: messageCollection } = getCollections();
    const { email } = req.params;
    
    // Find all messages where the user is sender or receiver
    const messages = await messageCollection
      .find({ $or: [{ sender: email }, { receiver: email }] })
      .toArray();

    const participants = new Set();
    messages.forEach(msg => {
      if (msg.sender !== email) participants.add(msg.sender);
      if (msg.receiver !== email) participants.add(msg.receiver);
    });
      
    res.send(Array.from(participants));
  } catch (error) {
    res.status(500).send({ message: 'Error fetching conversations', error: error.message });
  }
};

module.exports = { getConversations };

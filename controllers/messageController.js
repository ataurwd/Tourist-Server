const { getCollections } = require('../config/database');

const getMessages = async (req, res) => {
  try {
    const { messages: messageCollection } = getCollections();
    const { roomId } = req.params;
    
    const messages = await messageCollection
      .find({ roomId })
      .sort({ timestamp: 1 })
      .toArray();
      
    res.send(messages);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching messages', error: error.message });
  }
};

module.exports = { getMessages };

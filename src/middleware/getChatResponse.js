const { makeRequest } = require('./makeRequest');
const { URLs: { RASA_URL } } = require('../constants');

async function getChatResponse(text) {
  console.log('Getting chat response from chatbot...');
  const body = {
    sender: "puchotest",
    message: text 
  };

  const options = {
    url: RASA_URL,
    body,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  };

  let chatResponse;
  try {
    chatResponse = await makeRequest(options);
    console.log(chatResponse.body);
  } catch (error) {
    console.log(error);
  }
  return chatResponse;
}

// getChatResponse("hello my name is russel");

module.exports = {
  getChatResponse,
}
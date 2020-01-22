const { makeRequest } = require('./makeRequest');
const { URLs: { RASA_URL } } = require('../constants');

async function getChatResponse(text) {
  const body = {
    sender: "puchotest",
    message: text 
  };

  const options = {
    url: RASA_URL,
    body,
    json: true,
    method: 'post'
  };

  let chatResponse
  try {
    chatResponse = await makeRequest(options);
    console.log(chatResponse);
  } catch (error) {
    console.log(error);
  }
  return chatResponse;
}

getChatResponse('hi');

module.exports = {
  getChatResponse,
}
const { Router } = require('express');
const { makeRequest } = require('./makeRequest');
const { getChatResponse } = require('./getChatResponse');
const { URLs : { STT_URL } } = require('../constants');

const router = Router();
const url = STT_URL;

async function getText(req, res, next) {
  const headers = {
    'Content-Type': "application/json",
    'Authentication': "ya29.c.Kmq6BxOjtxVSMa04lRr_SgO_Sv8a19ka2WmyThNeonRMHZZuPs15kg1Sg1nV-jp9xJlUZ68UUrP9nnEDAOJNYMcPeXpSvKKLZ19p1GsU9YHCZFFTeeUO1auFolxUak9MYpBeesjNHQ1eUrKP"
  };
  
  const body = {
    config: {
      encoding: "FLAC",
      sampleRateHertz: 16000,
      languageCode: "en-US",
      enableWordTimeOffsets: false
    },
    audio: {
      uri: "gs://cloud-samples-tests/speech/brooklyn.flac"
    }
  };
  
  const options = {
    url,
    body,
    json: true,
    method: 'post',
  };

  try {
    const { body } = await makeRequest(options);
    res.status(200).json({ text: body});
  } catch (error) {
    res.status(error.status).json({ err: "error"});
  }
}

async function generateText(req, res, next) {
  const options = {
    url,
    body: req.body,
    method: 'post',
    json: true
  };

  try {
    const { body: { results } } = await makeRequest(options);
    const alternatives = results[0].alternatives;
    const text = alternatives[0].transcript;
    console.log(text);

    const chatResponse = await getChatResponse(text);
    result = chatResponse.reduce((obj) => ('').concat(obj.text).concat(' '));

    console.log(result);
    res.status(200).json({ text: text});
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "error"});
  }
}

router.route('/')
  .get(getText)
  .post(generateText);

module.exports = { sttRouter: router };

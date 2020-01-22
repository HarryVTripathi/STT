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
    const response = await makeRequest(options);
    const { body: { results, error }, statusCode } = response;
    let err;

    console.log('sttResult: ', results);
    if (statusCode > 299 || error) {
      err = error || { code: 500, msg: 'INTERNAL_SERVER_ERROR' };
      throw err;
    }

    const alternatives = results[0].alternatives;
    const text = alternatives[0].transcript;
    console.log('text: ', text);

    const chatResponse = await getChatResponse(text);
    
    if (!(chatResponse && chatResponse.body && chatResponse.body.length)) {
      err = {
        code: 500,
        msg: 'INTERNAL_SERVER_ERROR',
        details: 'No response from RASA',
      };
      throw err;
    }

    result = chatResponse.reduce((obj) => ('').concat(obj.text).concat(' '));

    res.status(200).json({ text: result });
  } catch (error) {
    console.log(error);
    res.status(error.code).json({ error });
  }
}

router.route('/')
  .get(getText)
  .post(generateText);

module.exports = { sttRouter: router };

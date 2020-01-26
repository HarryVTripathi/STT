const { Router } = require('express');
const { makeRequest } = require('./makeRequest');
const { getChatResponse } = require('./getChatResponse');
const { getBase64 } = require('./loadAudio');
const { tts } = require('./tts');
const { URLs : { STT_URL, STT_BETA_URL } } = require('../constants');

const router = Router();
const url = STT_URL;

async function getText(req, res, next) {
  const headers = {
    'Content-Type': "application/json",
    'Authentication': "ya29.c.Kmq6BxOjtxVSMa04lRr_SgO_Sv8a19ka2WmyThNeonRMHZZuPs15kg1Sg1nV-jp9xJlUZ68UUrP9nnEDAOJNYMcPeXpSvKKLZ19p1GsU9YHCZFFTeeUO1auFolxUak9MYpBeesjNHQ1eUrKP"
  };

  const { query: { RecordingUrl } } = req;
  let encoding = RecordingUrl ? RecordingUrl.split('.').slice(-1)[0] : "FLAC";

  if (encoding.toLowerCase() == "wav")
    encoding = null;

  console.log(RecordingUrl);
  
  const data = {
    config: {
      encoding,
      sampleRateHertz: 16000,
      languageCode: "en-US",
      enableWordTimeOffsets: false
    },
    audio: {
      uri: RecordingUrl || "gs://cloud-samples-tests/speech/brooklyn.flac"
    }
  };

  console.log(data);
  
  const options = {
    url,
    body: data,
    json: true,
    method: 'post',
  };

  try {
    const { body: text } = await makeRequest(options);
    res.status(200).json({ text: text});
  } catch (error) {
    res.status(error.status).json({ err: "error"});
  }
}

async function getTextFromBase64(req, res, next) {
  console.info('Request received, retrieving audio');
  const { query: { RecordingUrl } } = req;

  try {
    const { base64Data } = await getBase64(RecordingUrl);
    let encoding = RecordingUrl ? RecordingUrl.split('.').slice(-1)[0] : "FLAC";

    const data = {
      config: {
        encoding,
        sampleRateHertz: 16000,
        languageCode: "en-US",
        enableWordTimeOffsets: false
      },
      audio: {
        content: base64Data
      }
    };

    const options = { url: STT_BETA_URL, body: data, json: true, method: 'post' };

    console.log('Getting text from base64 data...');
    const { body: { results, error }, statusCode } = await makeRequest(options);

    if (statusCode > 299 || error || !results.length) {
      err = error || { code: 500, msg: 'INTERNAL_SERVER_ERROR' };
      throw err;
    }

    const text = results[0].alternatives[0].transcript;
    console.log('Speech to text: ', text);
    const chatResponse = await getChatResponse(text);
    
    if (!(chatResponse && chatResponse.body && chatResponse.body.length)) {
      err = {
        code: 500,
        msg: 'INTERNAL_SERVER_ERROR',
        details: 'No response from RASA',
      };
      throw err;
    }

    const ans = chatResponse.body[0].text;
    console.log('RASA chat response: ', ans);
    await tts(ans);

    res.status(statusCode).json({ chatBotAns: ans });

  } catch (error) {
    console.log(error);
    res.status(error.code).json({ error });
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
  .get(getTextFromBase64)
  .post(generateText);

module.exports = { sttRouter: router };

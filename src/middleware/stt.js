const request = require('request');
const { Router } = require('express');

const router = Router();

async function getSpeech(req, res, next) {
  const url = 'https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyCGNPwkrjEqEJwGdo8T0oQAhihhOCfqDic';

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

function makeRequest (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error)
        reject(error);
      else
        resolve(response);
    })
  })
}

router.route('/')
  .get(getSpeech);

module.exports = { sttRouter: router };

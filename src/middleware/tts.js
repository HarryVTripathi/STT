const { makeRequest } = require('./makeRequest');

const url = 'http://localhost:3000/tts';

async function tts(ans, encoding) {

  const body = {
    input: {
      text: ans
    },
    voice: {
      languageCode: "en-gb",
      name: "en-GB-Standard-A",
      ssmlGender: "FEMALE"
    },
    audioConfig:{
      audioEncoding: encoding || "MP3"
    }
  };

  const options = {
    url,
    body,
    json: true,
    method: 'get',
  };

  const res = await makeRequest(options)
  console.log(res.body);
}

// tts("It most probably is the one that your parents have chosen for you.")

module.exports = {
  tts,
};
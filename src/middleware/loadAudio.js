const request = require('request');
const fs = require('fs');
const axios = require('axios');

// const url = 'https://s3-ap-southeast-1.amazonaws.com/exotelrecordings/1579798799.28114041_0.mp3';

function loadAudio(url) {
  request(url)
    .pipe(fs.createWriteStream('audio.mp3')).on('close', (data) => console.log('data'));
}

function loadAudioV2(url) {
  const file = fs.createWriteStream('audio.mp3', { encoding: 'base64' });
  request(url)
    .pipe(file)
}

const getBase64 = async (url) => {
  console.info('Getting base64 audio string...');
  console.log('Audio URL: ', url);
  try {
    const result = await axios
      .get(url, { responseType: 'arraybuffer' })
      .then(response => new Buffer.from(response.data, 'binary')
      .toString('base64'));

    console.log(result.slice(0, 10));
    return { base64Data: result };
  } catch (error) {
    return error;
  }
}

function loadAudioV3(url) {
  const file = fs.createWriteStream('audio.mp3');
  request.get(url, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      response.pipe(file)
    }
  })
}

async function saveMP3() {
  const { base64Data } = await getBase64(url);
  fs.writeFileSync('file.mp3', Buffer.from(base64Data.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
}

// loadAudioV3('https://s3-ap-southeast-1.amazonaws.com/exotelrecordings/1579798799.28114041_0.mp3');

// getBase64(url);

// saveMP3();

module.exports = {
  loadAudio,
  loadAudioV2,
  loadAudioV3,
  getBase64,
  saveMP3,
};
/*
Before start
- If there's an update of data_train in storage, please update file
  - answerTrue.js for answer
  - nameTrue.js for name
*/

const {Storage} = require('@google-cloud/storage');
const axios = require('axios')
const fs = require('fs')

const answer = require('../extractAnswer')
const extractName = require('../extractName')
const answerTrueKey = require('./answerTrue')
const nameTrueKey = require('./nameTrue')
const keyfileStorage = require('../../keyfile.json')
const keyAzure = require('../../keyThirdApi.json').AZURE_KEY

function checkResultImage(url_image) {
  return new Promise((resolve, reject) => {
    const headers = {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": keyAzure
    }
    axios({
      url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze',
      method: 'POST',
      headers: headers,
      data: {
        "url": url_image
      }
    })
    .then(data => {
      setTimeout(() => {
        axios({
          url: data.headers['operation-location'],
          method: 'GET',
          headers: headers
        })
          .then((result) => {
            if (result.data) {
                const answers = answer(result.data)
                const name = extractName(result.data)
                if (answers.status === 'error' || name.status === 'error') {
                  resolve( {
                    status: 'error',
                    data: 'take another photo'
                  })
                }
                resolve({ url_image, name, answers })
            } else {
              resolve ({
                    status: 'error',
                    data: 'take another photo'
                })
            }
          })
          .catch(err => {
              resolve ({
                  status: 'error',
                  data: 'take another photo'
              })
          })
      }
      , 10000)
    })
    .catch(err => {
        reject(err)
    })
  })
}

async function readStorage() {
  try {
    // Creates a client
    const storage = new Storage({
      projectId: keyfileStorage.project_id,
      keyFilename: '../../keyfile.json'
    });
    
    const bucketName = keyfileStorage.project_id;
    const prefix = 'testingPindai';

    const options = {
      prefix: prefix,
    };
    
    // Lists files in the bucket, filtered by a prefix
    let [files] = await storage.bucket(bucketName).getFiles(options);
    files = files.filter(file => (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name))
    let listResult = []

    files.forEach(file => {
      let url = `https://storage.googleapis.com/${bucketName}/${file.name}`
      listResult.push(url)
    });
    return listResult
  }
  catch(err) {
  }
}

async function main() {
  try {
    let listFiles = await readStorage()
    let promisesTextResult = []
    let textResults = []
    for (let x = 0; x < listFiles.length; x++) {
      let misal = await checkResultImage(listFiles[x])
      if (misal.status === 'error') {
        continue
      }
      textResults.push(misal)
    }

    // return { name, answers }
    // name : length, range, text
    // answers : status, data
    
    // calculate accuracy
    let arrAccuracy = []
    let totalQuestionAnswerTrueKey = Object.keys(answerTrueKey).length
    let totalAnswerAccuracy = 0
    let totalNameAccuracy = 0
    let allTrueText = []
    textResults.forEach((oneSetAnswer) => {
      // calculate answer accuracy
      let trueAnswer = 0
      let falseAnswer = 0
      Object.keys(oneSetAnswer.answers.data).forEach((answerNum) => {
        if (oneSetAnswer.answers.data[answerNum] === answerTrueKey[answerNum]) {
          trueAnswer++
        } else {
          falseAnswer++
        }
      })
      let answerAccuracy = trueAnswer / totalQuestionAnswerTrueKey
      totalAnswerAccuracy += answerAccuracy

      // calculate name accuracy
      let nameJoin = oneSetAnswer.name.text.replace(/ /g, '')
      let trueChar = 0
      let falseChar = 0
      nameJoin.split('').forEach((char, index) => {
        if (char === nameTrueKey[oneSetAnswer.url_image][index]) {
          trueChar++
        } else {
          falseChar++
        }
      })
      let nameAccuracy = trueChar / nameJoin.length
      totalNameAccuracy += nameAccuracy

      if (nameAccuracy > 0.8) {
        allTrueText.push(oneSetAnswer)
      }

      arrAccuracy.push({
        answer: {
          trueAnswer, falseAnswer, answerAccuracy
        },
        name: {
          trueChar, falseChar, nameAccuracy
        }
      })
    })
    let answersAccuracy = totalAnswerAccuracy / textResults.length
    let namesAccuracy = totalNameAccuracy / textResults.length

    // Calculate range name position
    function getAverageMinMax(data) {
      let average = data.reduce((acc, text) => {
        return acc + text.name.length
      }, 0) / data.length
      let arrNameLengthFromPosition = data.map((one) => one.name.length)
      let minRange = arrNameLengthFromPosition.reduce((min,val) => Math.min(min,val), arrNameLengthFromPosition[0]);
      let maxRange = arrNameLengthFromPosition.reduce((min,val) => Math.max(min,val), arrNameLengthFromPosition[0]);
      return {
        "average": average,
        "minRange": minRange,
        "maxRange": maxRange
      }
    }
    let rangeModelAll = getAverageMinMax(textResults)
    let rangeModelBest = getAverageMinMax(allTrueText)
    fs.writeFileSync('namePosition.json', JSON.stringify({ rangeModelAll, rangeModelBest }))
  }
  catch(err) {
  }
}

main()

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
const extractNameAnswer = require('../extractNameAnswer')

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
              // console.log('ini data hasil dari microsoft', result.data)
                // const answers = answer(result.data)
                // const name = extractName(result.data)
                const { name, answers } = extractNameAnswer(result.data)
                console.log('status answers', answers.status)
                console.log('status name', name.status)
                if (answers.status === 'error' || name.status === 'error') {
                  resolve( {
                    status: 'error',
                    data: 'take another photo'
                  })
                }
                resolve({ url_image, name, answers })
            } else {
              console.log(result.data)
              resolve ({
                    status: 'error',
                    data: 'take another photo'
                })
            }
          })
          .catch(err => {
            console.log(err)
              resolve ({
                  status: 'error',
                  data: 'take another photo'
              })
          })
      }
      , 10000)
    })
    .catch(err => {
        console.log('mmasuk catch getimage', err)
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
    console.log(err)
  }
}

async function main() {
  try {
    let listFiles = await readStorage()
    console.log('start check result image', listFiles)
    console.log('start check result image', listFiles.length)
    let promisesTextResult = []
    let textResults = []
    for (let x = 0; x < listFiles.length; x++) {
      console.log('checking listFiles', listFiles[x])
      let misal = await checkResultImage(listFiles[x])
      console.log('misal', misal)
      if (misal.status === 'error') {
        continue
      }
      textResults.push(misal)
    }

    console.log('#######################ini result Text', textResults)
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
      // console.log('ini onesetanswer', oneSetAnswer)
      let trueAnswer = 0
      let falseAnswer = 0
      Object.keys(oneSetAnswer.answers.data).forEach((answerNum) => {
        if (oneSetAnswer.answers.data[answerNum] === answerTrueKey[answerNum]) {
          trueAnswer++
        } else {
          falseAnswer++
        }
        // console.log('ini oneSetAnswer.answers[answerNum]', oneSetAnswer.answers.data[answerNum])
        // console.log('ini answerTrueKey[answerNum]', answerTrueKey[answerNum])
        // console.log('ini truAnswer', trueAnswer)
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
      console.log('ini nameJoin', nameJoin)
      console.log('ini nameTrueKey[oneSetAnswer.url_image]', nameTrueKey[oneSetAnswer.url_image])
      console.log('url_image', oneSetAnswer.url_image)
      console.log('result', nameJoin === nameTrueKey[oneSetAnswer.url_image])
      console.log('nameaccuracy', nameAccuracy)

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
    console.log('average answer accuracy', answersAccuracy)
    console.log('average name accuracy', namesAccuracy)

    // Calculate range name position
    function getAverageMinMax(data) {
      console.log('ini data', data)
      let average = data.reduce((acc, text) => {
        return acc + text.name.length
      }, 0) / data.length
      let arrNameLengthFromPosition = data.map((one) => one.name.length)
      let minRange = arrNameLengthFromPosition.reduce((min,val) => Math.min(min,val), arrNameLengthFromPosition[0]);
      let maxRange = arrNameLengthFromPosition.reduce((min,val) => Math.max(min,val), arrNameLengthFromPosition[0]);
      console.log('average', average)
      console.log('minRange', minRange);
      console.log('maxRange', maxRange);
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
    console.log(err)
  }
}

main()

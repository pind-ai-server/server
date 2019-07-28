const extractName = require('./newExtractName')
const extractAnswer = require('./newExtractAnswer')

function nameAnswer(data) {
  let DATA = data.recognitionResults[0].lines
  let indexStartJawaban, namePeserta
  var location = DATA.map((data, i) => {
    // prepare answer extract
    if (data.text === "JAWABAN (Hitamkan salah satu pilihan jawaban yang benar)") {
      indexStartJawaban = i
    }
    // prepare name extract
    let locCenterY = ((data.boundingBox[7] - data.boundingBox[1]) / 2) + data.boundingBox[1]
    if (data.text === 'NAMA PESERTA') {
      namePeserta = {
        text: data.text,
        range: [data.boundingBox[0], data.boundingBox[2]],
        locCenterY
      }
    }
    return {
      text: data.text,
      range: [data.boundingBox[0], data.boundingBox[2]],
      locCenterY
    }
  })

  // check if jawaban dll blurry or not detected
  if (!indexStartJawaban) {
    return {
      status: 'error',
      data: 'take another photo'
    }
  }
  // check if Nama Peserta blurry or not detected
  if (!namePeserta) {
    return {
      status: 'error',
      data: 'take another photo'
    }
  }

  let newData = DATA.slice(indexStartJawaban + 1)
  let resultName = extractName(location, namePeserta)
  let resultAnswer = extractAnswer(newData)
  return { name: resultName, answers: resultAnswer }
}

module.exports = nameAnswer
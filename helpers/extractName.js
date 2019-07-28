const rangeName = require('./nameAccuracy/namePosition.json').rangeModelBest

function extractName(data) {
  var location = data.recognitionResults[0].lines.map((oneSentence) => {
    let locCenterY = ((oneSentence.boundingBox[7] - oneSentence.boundingBox[1]) / 2) + oneSentence.boundingBox[1]
    return {
      text: oneSentence.text,
      range: [oneSentence.boundingBox[0], oneSentence.boundingBox[2]],
      locCenterY
    }
  })
  var namePeserta
  location.forEach((one) => {
    if (one.text === 'NAMA PESERTA') {
      namePeserta = one
    }
  })
  if (!namePeserta) {
    return {
      status: 'error',
      data: 'take another photo'
    }
  }

  var lengthYFromNamaPeserta = []
  location = location.filter((one) => one.text !== 'NAMA PESERTA')
  location.forEach((one) => {
    let length = Math.abs(one.locCenterY - namePeserta.locCenterY)
    lengthYFromNamaPeserta.push({ length, range: one.range, text: one.text })
  })

  let minLenght
  let minLenghtIndex
  let minLengthText
  let notAllowedText = [
    'NOMOR PESERTA', 
    'TANGGAL LAHIR', 
    'Tgl Bin Thn',
    'Tgl Bln Thn',
    'Tgl',
    'Bln',
    'Bin',
    'Thn',
    'Tgl Bln',
    'Tgl Bin',
    'Bln Thn',
    'Bin Thn',
    'pada kotak ya',
    'pada kotak yang disediakan.'
  ]

  lengthYFromNamaPeserta.forEach((one, index) => {
    if ((one.length < minLenght 
      && !notAllowedText.includes(one.text)) 
      || index === 0) {
      minLenght = one.length
      minLenghtIndex = index
      minLengthText = one
    }
  })
  if (minLenght < rangeName.minRange || minLenght > rangeName.maxRange) {
    minLenght = 0
    minLenghtIndex = 0
    minLengthText = { 
      length: 0, 
      range: [], 
      text: ''
    }
  }
  // console.log('ini nilai minLength', minLenght)
  // console.log('ini nilai minLengthIndex', minLenghtIndex)
  // console.log('ini nilai minLengthText', minLengthText)
  return minLengthText
}

module.exports = extractName
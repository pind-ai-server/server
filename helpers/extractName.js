const rangeName = require('./nameAccuracy/namePosition.json').rangeModelBest

function checkTglBlnThn(text) {
  let textTglBlnThn = ['Tgl', 'Bln', 'Bin', 'Thn', 'Tg!', 'The', 'Tol']
  for (let x = 0; x < textTglBlnThn.length; x++) {
    let one = textTglBlnThn[x]
    if (text.includes(one)) {
      return true
    }
  }
  return false
}

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
  // console.log('ini nama peserta', namePeserta)
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
    'TANGGAL LAMIR',
    'pada kotak ya',
    'pada kotak yang disediakan.'
  ]

  lengthYFromNamaPeserta.forEach((one, index) => {
    // console.log('ini di extract name', one)
    if ((one.length < minLenght 
      && !notAllowedText.includes(one.text)
      && !checkTglBlnThn(one.text)) 
      || index === 0) {
      minLenght = one.length
      minLenghtIndex = index
      minLengthText = {
        status: 'success',
        data: one.text
      }
    }
  })
  // console.log('ini minLengthText', minLengthText)
  // if name not found
  if (!minLengthText || minLenght > rangeName.maxRange) {
    minLenght = 0
    minLenghtIndex = 0
    minLengthText = { 
      status: 'success',
      data: ''
    }
  }

  // console.log('ini nilai minLength', minLenght)
  // console.log('ini nilai minLengthIndex', minLenghtIndex)
  // console.log('ini nilai minLengthText', minLengthText)
  return minLengthText
}

module.exports = extractName
const rangeName = require('./nameAccuracy/namePosition.json').rangeModelBest

function extractName(location, namePeserta) {
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
  location = location.filter((one) => one.text !== 'NAMA PESERTA')
  location.forEach((one, index) => {
    let length = Math.abs(one.locCenterY - namePeserta.locCenterY)
    if ((length < minLenght 
      && !notAllowedText.includes(one.text)) 
      || index === 0) {
      minLenght = length
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
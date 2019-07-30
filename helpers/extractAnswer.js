function checkCharI(text) {
  let countI = 0
  let splittedText = text.split('')
  for (let x = 0; x < splittedText.length; x++) {
    let char = splittedText[x]
    if (char === 'I') {
      countI++
    }
    if (countI > 1) {
      return true
    }
  }
  return false
}

function answer(data) {
  let DATA = data.recognitionResults[0].lines
  let tes = []
  for (let i = 1; i <= 50; i++) {
    tes.push(`${i}`)
  }
  let found = false
  let index = 0
  const identifierAnswer = "JAWABAN (Hitamkan salah satu pilihan jawaban yang benar)"
  DATA.forEach((data, i) => {
    let trueWord = 0
    let arrIdentifierAnswer = identifierAnswer.split('')
    let arrDataText = data.text.split('')
    arrDataText.forEach((char, index) => {
      if (char === arrIdentifierAnswer[index]) {
        trueWord++
      }
    })
    let accuracyIdentifier = trueWord / arrIdentifierAnswer.length
    if (accuracyIdentifier >= 0.5) {
      index = i
      found = true
    }
    console.log('ini accuracyIdentifier', accuracyIdentifier)
    console.log('ini data.texgt', data.text)
    // nyunk
    // if (data.text === identifierAnswer) {
    //   index = i,
    //   found = true
    // }
  })
  if (found) {
    let result = {}
    let newData = DATA.slice(index + 1)
    console.log('ini newData', newData)
    try {
      newData.forEach(data => {
        console.log('ini data.text di answer', data.text)
        tes.forEach(num => {
          if (data.text.includes(String(num))
            && !checkCharI(data.text)) {
            let alphabeth = ['A', 'B', 'C', 'D', 'E']
            let check = [false, false, false, false, false]
            let cleanText = data.text.replace(/[.,\s]/g, '')
            let key = ''
            let value = ''
            let prevChar = ''
            let surpassKey = false
            cleanText.split('').forEach((char) => {
              if (!isNaN(+prevChar) && isNaN(+char)) {
                surpassKey = true
              }
              if (!isNaN(+char) && key.length < 2 && !surpassKey) {
                key += char
              } else {
                value += char
              }
              prevChar = char
            })
            
            // nyunk
            // let key = data.text.split('.')[0].replace(/ /g, '')
            // let value = data.text.split('.')[1].replace(/ /g, '')
            // console.log(key)
            // console.log(value)
            alphabeth.forEach((a, i) => {
              if (value.includes(a)) {
                check[i] = true
              }
            })
            let answer = ''
            let count = 0
            check.forEach((c, i) => {
              if (count > 1) {
                answer = ''
              } else if (c === false) {
                answer = alphabeth[i]
                count = count + 1
              }
            })
            // console.log(check)
            result[key] = answer
          }
        })
      })
      // checking number 1 - 50
      for (let x = 1; x <= 50; x++) {
        if (!result[x]) {
          result[x] = ''
        }
      }
      return {
        status: 'success',
        data: result
      }
    } catch (error) {
      console.log('ini error answer', error)
      return {
        status: 'error',
        data: 'take another photo'
      }
    }
  } else {
    return {
      status: 'error',
      data: 'take another photo'
    }
  }
}

module.exports = answer
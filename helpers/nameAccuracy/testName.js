
// const text = 'Bin | Thu'

// function checkTglBlnThn(text) {
//   let textTglBlnThn = ['Tgl', 'Bln', 'Bin', 'Thn', 'Tg!', 'The', 'Tol']
//   for (let x = 0; x < textTglBlnThn.length; x++) {
//     let one = textTglBlnThn[x]
//     if (text.includes(one)) {
//       return true
//     }
//   }
//   return false
// }

// console.log('ini hasil', checkTglBlnThn(text))

// const text = '1IIIII'

// function checkCharI(text) {
//   let countI = 0
//   let splittedText = text.split('')
//   for (let x = 0; x < splittedText.length; x++) {
//     let char = splittedText[x]
//     if (char === 'I') {
//       countI++
//     }
//     console.log(char, countI)
//     if (countI > 1) {
//       return true
//     }
//   }
//   return false
// }

// console.log('ini hasil', checkCharI(text))

const arrText = [
  '10 ABCD.O', '10. ABDE',
  '13 ABD1E', '38 ABCDE',
  '1 ABCD1'
]
let result = []
arrText.forEach((text) => {
  let cleanText = text.replace(/[.,\s]/g, '')
  console.log(cleanText)
  let key = ''
  let value = ''
  let prevChar = ''
  let surpassKey = false
  cleanText.split('').forEach((char) => {
    console.log('char', char)
    console.log('keylength', key.length)
    if (!isNaN(+prevChar) && isNaN(+char)) {
      console.log('prevchar', prevChar)
      console.log('char', char)
      surpassKey = true
    }
    if (!isNaN(+char) && key.length < 2 && !surpassKey) {
      key += char
    } else {
      value += char
    }
    prevChar = char
  })
  result.push({[key]: value})
  console.log('result key,value', {[key]: value})
})
console.log(result)
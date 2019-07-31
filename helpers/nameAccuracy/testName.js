
const arrText = [
  '10 ABCD.O', '10. ABDE',
  '13 ABD1E', '38 ABCDE',
  '1 ABCD1'
]
let result = []
arrText.forEach((text) => {
  let cleanText = text.replace(/[.,\s]/g, '')
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
  result.push({[key]: value})
})
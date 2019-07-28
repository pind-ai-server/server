function answer(data) {
  let DATA = data.recognitionResults[0].lines
  let tes = []
  for (let i = 1; i <= 50; i++) {
    tes.push(`${i}`)
  }
  let index
  DATA.forEach((data, i) => {
    if (data.text === "JAWABAN (Hitamkan salah satu pilihan jawaban yang benar)") {
      index = i
    }
  })

  // check if jawaban dll blurry or not detected
  if (!index) {
    return {
      status: 'error',
      data: 'take another photo'
    }
  }

  let result = {}
  let newData = DATA.slice(index + 1)
  try {
    newData.forEach(data => {
      tes.forEach(num => {
        if (data.text.includes(num)) {
          data.text = data.text.replace(/ /g, '').replace('.', '')
          let key = '', value = ''
          data.text.split('').forEach((char) => {
            if (+char) {
              key += char
            } else {
              value += char
            }
          })
          let alphabeth = ['A', 'B', 'C', 'D', 'E']
          let check = [false, false, false, false, false]
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
    // console.log(newData)
    return {
      status: 'success',
      data: result
    }
  } catch (error) {
    console.log('ini error', error)
    return {
      status: 'error',
      data: 'take another photo'
    }
  }
}

module.exports = answer
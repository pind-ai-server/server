function answer(data) {
  let DATA = data.recognitionResults[0].lines
  let tes = []
  for (let i = 1; i <= 50; i++) {
    tes.push(`${i}`)
  }
  let found = false
  let index = 0
  DATA.forEach((data, i) => {
    if (data.text === "JAWABAN (Hitamkan salah satu pilihan jawaban yang benar)") {
      index = i,
      found = true
    }
  })
  if (found) {
    let result = {}
    let newData = DATA.slice(index + 1)
    try {
      newData.forEach(data => {
        tes.forEach(num => {
          if (data.text.includes(num)) {
            let alphabeth = ['A', 'B', 'C', 'D', 'E']
            let check = [false, false, false, false, false]
            let key = data.text.split('.')[0].replace(/ /g, '')
            let value = data.text.split('.')[1].replace(/ /g, '')
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
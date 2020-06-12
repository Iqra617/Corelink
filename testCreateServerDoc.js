/* eslint-disable no-unused-vars */
// V1.0.1.0

/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

const fs = require('fs')
const config = require('../../config/configure')
const inquirer = require('./lib/inquirer')
const corelink = require('../../clients/javascript/corelink.lib')

corelink.debug = false
let functions = null

function createTable(jsonfile) {
  let tableresult = ''

  let headers = '<thead><tr><th>field</th><th>result</th></tr></thead>'
  let contents = ''
  for (const key in final) { // go through the array of functions
      const func = final[key]
      for (const k1 in func){ // go through each field in the function
          //console.log(k1) // name of parameter
          //console.log(func[k1]) // value of parameter
          contents += '<tr class="active">'+ ' <td>'+k1+'</td> <td>'+JSON.stringify(func[k1], undefined, 4)+'</td> </tr>'
          
      }
      delete func.version // ignoring function version
      delete func.author // ignoring function author
      delete func.email // ignoring email
      delete func.doc_href // ignoring doc_href
      break; // only do one function's output
    }

  contents = '<tbody>'+ contents +'</tbody>'
  // create contents
  // pad headers and contents together
  return `<table class="table"> ${headers} ${contents} </table>`
}

const run = async () => {
  const credentials = await inquirer.askCredentials().catch((err) => {
    console.log(err)
  })
  if (
    await corelink.connect(credentials, config).catch((err) => {
      console.log(err)
    })
  ) {
    console.log('-----------')
    functions = await corelink.listFunctions().catch((err) => {
      console.log(err)
    })
    let i
    const description = []
    for (i = 0; i < functions.length; i += 1) {
      console.log(functions[i])

      // eslint-disable-next-line no-await-in-loop
      description[functions[i]] = await corelink
        .describeFunction(functions[i])
        .catch((err) => {
          console.log(err)
        })
    }
    let final = []

    for (const key in description) {
      const func = description[key]
      delete func.version // ignoring function version
      delete func.author // ignoring function author
      delete func.email // ignoring email
      delete func.doc_href // ignoring doc_href
      final.push(func)
    }
    // console.log(final);

    //final = JSON.stringify(final, undefined, 4)
    var result = createTable(final)
    
    fs.writeFile('test.md', result, (err) => {
      if (err) {
        console.log(err)
      }
      console.log('your file has been created!')
    })
    fs.close()

    await corelink.disconnect()
    process.exit()
  }
}

run()

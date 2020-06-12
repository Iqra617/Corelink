

const config = require("../../config/configure");
const inquirer = require("./lib/inquirer");
const corelink = require("../../clients/javascript/corelink.lib");

corelink.debug = false;
let functions = null;

const run = async () => {
  const credentials = await inquirer.askCredentials().catch(err => {
    console.log(err);
  });
  if (
    await corelink.connect(credentials, config).catch(err => {
      console.log(err);
    })
  ) {
    console.log("-----------");
    functions = await corelink.listFunctions().catch(err => {
      console.log(err);
    });
    let i;
    const description = [];
    for (i = 0; i < functions.length; i += 1) {
      console.log(functions[i]);

      // eslint-disable-next-line no-await-in-loop
      description[functions[i]] = await corelink
        .describeFunction(functions[i])
        .catch(err => {
          console.log(err);
        });
    }
    var final = [];
    for (var key in description) {
      var func = description[key];
      delete func.version;    //ignoring function version
      delete func.author;     //ignoring function author
      delete func.email;      //ignoring email
      delete func.doc_href;   //ignoring doc_href
      final.push(func);
    }
    //console.log(final);

    var fs = require("fs");
    final = JSON.stringify(final,undefined,4);
    fs.writeFile("test.txt", final, function(err) {
      if (err) {
        console.log(err);
      }
      console.log("your file has been created!");
    });
    fs.close();

    await corelink.disconnect();
    process.exit();
  }
};

run();

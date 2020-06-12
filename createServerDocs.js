// V1.0.0.0

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
    //var final = [];  //final is the array for all functions
    var final= ""
    for (var key in description) {
      var func = description[key];   //func is the individual function
      //console.log(func);             //look in the output
      //console.log("=");            //dont need it  
      delete func.version;         // a way of getting a param from func
      delete func.author;          
      delete func.email;
      delete func.doc_href;
      //to do :wrap html using func item
      var htmlcomponent= "<p>" + func.author + "</p>"
      final+=htmlcomponent + "/n";
      //final.push(func);
    }
    //console.log(final);

    var fs = require("fs");
    //final = JSON.stringify(final,undefined,4);  //this is to change final into a string

    fs.writeFile("default.md", final, function(err) {      //write the string final into default.md
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

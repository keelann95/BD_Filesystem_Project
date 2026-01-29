const fs = require("fs/promises");
const path = require("path");
const fsWatch = require('fs')
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const commandPath = path.resolve(__dirname, "..", process.env.COMMAND_FILE);
(async () => {
  try {
    //parser

    const parseCommand =  (command) =>{

        if(!command) return null

        const [action, ...rest] = command.split(/\s+/)
        return{
            action, args: rest.join(" ")
        }
    }

    //watcher

    let timeout;

    fsWatch.watch(commandPath, async() =>{
        clearTimeout(timeout)
        timeout = setTimeout(async()=>{
            const commandFileCont = await fs.readFile(commandPath, 'utf8')
            console.log("watching:", commandFileCont);

            const parsed = parseCommand(commandFileCont.trim())
            console.log(parsed);
            
            
        },100)
    })


  } catch (error) {
    console.error("Failed to read command file:", error.message);
    return null;
  }
})();

const fs = require("fs/promises");
const path = require("path");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const commandPath = path.resolve(__dirname, "..", process.env.COMMAND_FILE);
(async () => {
  try {
    //open the file
    const commandFileContent = await fs.readFile(commandPath, "utf8");

    console.log(commandFileContent);

    return commandFileContent.trim();

    //parser

    const parseCommand = async (command) =>{

        if(!command) return null

        const [action, ...rest] = await command.split(/\s+/)
        return{
            action, args: rest.join(" ")
        }
    }


    //watcher

    


  } catch (error) {
    console.error("Failed to read command file:", err.message);
    return null;
  }
})();

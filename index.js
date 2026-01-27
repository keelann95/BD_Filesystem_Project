const fs = require("fs/promises");

(async () => {



  //commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = 'delete a file'
  const RENAME_FILE = "rename the file"
  const ADD_TO_FILE = "add the file"

  const createFile = async (path) => {
    try {
      const existingPath = await fs.open(path, "r");
      await existingPath.close();
      console.log(`The file ${path} already exists`);
      return;
    } catch (error) {
      const createFileHandle = await fs.open(path, "w");
      console.log("A new file has been successfully created.");
      createFileHandle.close();
    }
  };

  const deletion = async (path) =>{
    try {
        
        await fs.unlink(path)
        console.log(`File ${path} deleted successfully`);
    } catch (error) {
     if(error.code ==='ENOENT'){
            console.log(`The file ${path} does not exist`);
        
     }else{
        console.error(error);
        
     }
    }
  }

  const renameFilePath = async (oldPath, newPath) =>{

    try {
        await fs.rename(oldPath, newPath)
        return  console.log(`Renamed ${oldPath} → ${newPath}`);
    } catch (error) {
        if(error.code === 'ENOENT'){
            console.log("source file does not exist");
        }
        else console.error(error);
        
    }
  }


  //read the file
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    //first we get the size in order to allocate enough buffer
    const contSize = (await commandFileHandler.stat()).size;

    //allocate the buffer to required size
    const buff = Buffer.alloc(contSize);

    //choose location where the buffer allocation starts from
    const offset = 0;

    //how many bytes to read
    const length = buff.byteLength;

    //the position that we start reading file from
    const position = 0;

    //we always want to read the whole content from start to end
    await commandFileHandler.read(buff, offset, length, position);

    const command = buff.toString("utf-8").trim();
    console.log(command);

    //create a file <path>
    if (command.startsWith(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1).trim();
      createFile(filePath);
    }
    //deleting a file <path>
    if(command.startsWith(DELETE_FILE)){
      const deleteFilePath = command.slice(DELETE_FILE.length + 1).trim();
    deletion(deleteFilePath);
    }


    //renaming a file

    if(command.startsWith(RENAME_FILE)){

        const renameFile = command.slice(RENAME_FILE.length + 1).trim()

        const [oldPath, newPath] = renameFile.split(/\s+/);
        if (!oldPath || !newPath){
    console.log("Usage: rename the file <old> <new>");
        return;

        }
        await renameFilePath(oldPath, newPath)
    }

  });



  //watches the file
  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();

const fs = require("fs/promises");

(async () => {
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

  //commands
  const CREATE_FILE = "create a file";

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

    const command = buff.toString("utf-8");
    console.log(command);

    //create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
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

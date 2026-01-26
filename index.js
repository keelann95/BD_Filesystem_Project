const fs = require('fs/promises');
(async()=>{
    //watches the file
    const watcher = fs.watch('./command.txt')
     //read the file
    const commandFileHandler =await fs.open("./command.txt", 'r')

    for await (const event of watcher){

        if(event.eventType ==="change"){
            //the file was changed
            
            //we want to read the content

            //first we get the size in order to allocate enough buffer
            const contSize = (await commandFileHandler.stat()).size
            
            //allocate the buffer to required size
            const buff = Buffer.alloc(contSize)

            //choose location where the buffer allocation starts from
            const offset = 0

            //how many bytes to read
            const length = buff.byteLength

            //the position that we start reading file from
            const position = 0

             //we always want to read the whole content from start to end
             const content = await commandFileHandler.read(buff,offset,length,position)
             console.log(content);
             
            
        }
    }
})()
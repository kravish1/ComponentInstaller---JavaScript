const fs = require('fs');
const Installer = require('./Installer');

fs.readFile('input.txt','utf-8',(err,commands)=>{
    commands = commands.split('\n');
    
    const ins = Installer();

    for(let i=0;i<commands.length;i++){
        ins.fileObj.write(commands[i]);
        ins.fileObj.write('\n');
        const command = commands[i].split(/\s+/);
            switch(command[0]){
                case "INSTALL":
                        ins.installComponent(command[1], true);
                    break;
                case "REMOVE":
                        ins.removeComponent(command[1]);
                    break;
                case "DEPEND":
                        ins.addDependency(command[1], command[2]);
                    break;
                case "LIST":
                        ins.printComponents();
                    break;
                case "END":
                        ins.fileObj.write('\n');
                    break;
                default:
                        ins.printInvalid();
                    break;
                    
        }
    }
});
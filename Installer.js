const Component = require('./Component');
const fs = require('fs');


const init = function(){
    let ins = new Installer();
    return{
        installComponent : function(name,isExplicitlyInstalled){ ins.installComponent(name,isExplicitlyInstalled)},
        addDependency : function(c1,c2){ ins.addDependency(c1,c2)},
        removeComponent : function(name){ ins.removeComponent(name)},
        printComponents : function(){ ins.printComponents()},
        printInvalid : function(){ ins.printInvalid()},
        fileObj : ins.fileObj,
    }
}
let Installer = function(){
    const outputFile = fs.createWriteStream('output.txt', {
        flags: 'a' // 'a' means appending (old data will be preserved)
      });
        this.components = new Map();
        this.fileObj = outputFile;


}


Installer.prototype.installComponent = function(name,isExplicitlyInstalled){
    let comp = this.getOrCreateComponent(name),
    parents = comp.getParents();
    

    if(comp.isInstalled()){
        this.fileObj.write("Already Installed " +comp.getName());
        this.fileObj.write('\n');
        return; 
    }
    this.fileObj.write("Installing "+comp.getName());
    this.fileObj.write('\n');

    for(let i=0;i<parents.length;i++){
        if(parents[i].isInstalled()){
            this.fileObj.write("Dependency "+parents[i].getName()+"already installed");
            this.fileObj.write('\n');
        }else{
            if(!parents[i])
                return;
            this.installComponent(parents[i].getName(),false);
        }
    }  
    comp.setInstalled(true);
	comp.setExplicitlyInstalled(isExplicitlyInstalled);
    this.fileObj.write("Installed "+comp.getName());
    this.fileObj.write('\n');
}

Installer.prototype.removeComponent = function(name){
    let comp = this.components.get(name);
    
    if(!comp || !comp.isInstalled()){
        let val = (typeof name === 'object') ? name.getName() : name;
        this.fileObj.write("Cannot Remove " +  val  +" component is null or not installed");
        this.fileObj.write('\n');
        return;
    }
    let result = new RemoveResult();
    this.removeComponentOut(comp,result);
    let removedList = result.getRemovedList();
    
    if(result.isSuccess()){
        removedList.forEach((removed)=>{
            removed.setExplicitlyInstalled(false);
            removed.setInstalled(false);				
            this.fileObj.write("Removed " + removed.getName());
            this.fileObj.write('\n');
        });
    }else{
            this.fileObj.write("Could not remove " + result.getFailedComp().getName());
            this.fileObj.write('\n');
    }
}

Installer.prototype.removeComponentOut = function(comp,result){
    if(!comp || !comp.isInstalled()){
        result.setErrorMsg("Cannot Remove " + comp.getName()+" component is null or not installed");
        result.setSuccess(false);
        result.setFailedComp(comp);
        
    }else if (!comp.getChildren().size === 0){
        result.setErrorMsg("Cannot Remove " + comp.getName()+" component has children");
        result.setSuccess(false);
        result.setFailedComp(comp);
    }else{
        comp.getParents().forEach((parent)=>{
            parent.removeChild(comp);
            if (parent.isInstalled() && !parent.isExplicitlyInstalled()) {
                this.removeComponent(parent, result);
                return;
            }
        });
        let removedList = result.getRemovedList();
        removedList.push(comp);
        result.setSuccess(true);
    }
}	



Installer.prototype.addDependency = function(c1,c2){
    let comp1 = this.getOrCreateComponent(c1),
    comp2 = this.getOrCreateComponent(c2);
    
    if(c1 === c2){
        this.fileObj.write("C1 and C2 are same");
        this.fileObj.write('\n');
    }else if(this.isCircularDependency(comp1, comp2)){
        this.fileObj.write("C1 and C2 are circularly dependent");
        this.fileObj.write('\n');
    }else{
        comp1.addChild(comp2);
        comp2.addParent(comp1);
        this.fileObj.write("Dependency added");
        this.fileObj.write('\n');
    }
}

Installer.prototype.isCircularDependency = function(c1,c2){
    //Search from c1 dependents
		let children = c1.getChildren();
		if(children.size === 0){
			return false;
		}if(children.has(c2)){
			return true;
		}
		children.forEach((c)=>{
            if(this.isCircularDependency(c,c2)){
				return true;
			}
        });
		
		return false;
}


Installer.prototype.getOrCreateComponent = function(name){
    let comp = this.components.get(name); 
    if(!comp){
        comp = this.addComponent(name); 
    }
    return comp;
}

Installer.prototype.addComponent = function(name){
    let component = new Component(name);
    this.components.set(name,component);
    return component;
}

Installer.prototype.printComponents = function(){
    [...this.components.keys()].forEach((item)=>{
        this.fileObj.write(item+ " ");
        this.fileObj.write('\n');
    });
}


Installer.prototype.printInvalid = function(){
    this.fileObj.write("Invalid Command");
    this.fileObj.write('\n');
}






let RemoveResult = function(){
    let success,
    removedList = [],
    failedComp = null,
    errorMsg;
    

    this.getErrorMsg = function() {
        return errorMsg;
    }

    this.setErrorMsg = function(value) {
        errorMsg = value;
    }

    this.isSuccess = function() {
        return success;
    }

    this.setSuccess = function(value) {
        success = value;
    }

    this.getRemovedList = function() {
        return removedList;
    }

    this.addRemovedComponent = function(value) {
        removedList.add(value);
    }

    this.getFailedComp = function() {
        return failedComp;
    }

    this.setFailedComp = function(value) {
        failedComp = value;
    }
}



module.exports = init;
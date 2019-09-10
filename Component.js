const Component = function(cname,cisInstalled=false,cisExplicitlyInstalled=false){
        let name = cname,
	    isInstalled = cisInstalled,
	    isExplicitlyInstalled = cisExplicitlyInstalled,
	    children = new Set(),
        parents = new Set();
        

        this.getName = function(){
            return name;
        }
        this.setName = function(value){
            name = value;
        }

        this.isInstalled = function(){
            return isInstalled;
        }
        this.setInstalled = function(value){          
            isInstalled = value;
        }

        this.isExplicitlyInstalled = function(){
            return isExplicitlyInstalled;
        }
        this.setExplicitlyInstalled = function(value){
            isExplicitlyInstalled = value;
        }

        this.getChildren = function() {
            return children;
        }
    
        this.addChild = function(value) {
            children.add(value);
        }
        
        this.getParents = function() {
            return parents;
        }
    
        this.addParent = function(value) {
            parents.add(value);
        }
        
        this.removeChild = function(value) {
            children.delete(value);
        }
        
        this.removeParent = function(value) {
            parents.delete(value);
        }
}

module.exports = Component;
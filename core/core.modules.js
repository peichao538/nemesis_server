/*
		Nemesis Application Core Module Loader
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the modules defined in 
		root.config.modules (defined by bootstrap.js).
 */
 
module.exports=load_modules;

function fileNotExists(fname){return require('fs').lstatSync(fname).isFile()}

function load_modules(){
		var o={}
		root.config.modules.forEach(
		function(m,i,a){
			if(typeof(m)=='object'){
				if(typeof(m.group)!='string'){
					throw new Error(root.error.messages.bootstrap.invModuleGroup.text);
				}
				if(typeof(m.name)!='string'){
					throw new Error(root.error.messages.bootstrap.invModuleName.text);
				}
				if(typeof(m.file)!='string'){
					throw new Error(root.error.messages.bootstrap.invModuleFile.text);
				}
				if(fileNotExists(m.file)){
					throw new Error(root.error.messages.bootstrap.missingModuleFile.text);
				}
			
				init_object=function(o){ if(typeof(o)==undefined) o={} };
				
				init_object(root.config.modules);
				init_object(root.config.modules[m.group]);
				init_object(root.config.modules[m.group][m.name]);
				
				root.config.modules[m.group][m.name]=require(m.file);
				
			}else{
				console.log("In "+module.filename+" root.errors is not yet defined.");
				throw new Error(root.error.messages.bootstrap.invalidModule.text);
			}
		}
	);
	if(root.debug){
		console.log("-----MODULES LOADED-----");
		console.dir(root.config.modules);
		console.log("------------------------");
	}
}
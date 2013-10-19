/*
		Nemesis Application Core Module Loader
		/srv/nemesis/core/core.modules.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the modules defined in 
		root.config.modules (defined by bootstrap.js).
 */
module.exports=init;
/*

 */
function init(){
	if(typeof(root.config)!='object'){
		throw new Error('root.config not defined as object');
	}
	if(typeof(root.config.app)!='object'){
		throw new Error('root.config.app not defined as object');
	}
	if(typeof(root.config.app.modules)!='string'){
		throw new Error('root.config.app.modules not defined as string');
	}
	fs=require('fs');
	if( !fs.statSync(root.config.app.modules).isDirectory() ){
		throw new Error('root.config.app.modules is not a valid directory');
	}
	
	root.modules={};
	root.modules.load=function(modName){
		console.log('loading '+modName);
		modInspect(modName,'noPreload');
		
	}
	root.modules.preload=function(modName){
		console.log('preloading '+modName);
		modInspect(modName,'preload');
	}
}
/*

 */
function missingDependencies(modName){
	if( (typeof(root.modules[modName].manifest.loader.dependencies)=='object') &&
		(typeof(root.modules[modName].manifest.loader.dependencies.forEach)=='function')){
		
		if(root.modules[modName].manifest.loader.dependencies.length == 0){
			return false; /*No dependencies specified.*/
		}else{
			root.modules[modName].manifest.loader.dependencies.forEach(function(d,i,a){
				if(typeof(d)!='string') 
					throw new Error('Bad dependency definition (expected string): '+d);
				if(typeof(root.modules[d])=='undefined'){
					return true;/*Missing dependency.*/
				}else{
					return false;/*This dependency is loaded.*/
				}
			});
		}		
	}else{
		if(typeof(root.modules[modName].manifest.loader.dependencies)=='undefined'){
			return false; /*No dependencies specified.*/
		}else{
			throw new Error('module ['+modName+'] manifest is missing dependency array.')
		}	
	}
}
/*

 */
function load_my_module(modName){
 	
 	if(missingDependencies(modName)){
		throw new Error('module '+modName+' is missing one or more dependencies.');
	}		

	var config_file=root.modules[modName].manifest.config;
	if(fs.statSync(config_file)) {
		root.config[modName]=require(config_file);
	}else{
		throw new Error ('config file not found: '+config_file);
	}
	
	var main_file=root.modules[modName].manifest.main;
	if( fs.statSync(main_file) ) {
		root.config[modName]=require(main_file);
	}else{
		throw new Error ('main file not found: '+main_file);
	}
	
	var error_file=root.modules[modName].manifest.errors;
	if( fs.statSync(error_file ) ){
		root.config[modName]=require(error_file);
	}else{
		throw new Error ('error file not found: '+error_file);
	}
	/*
		Add more objects from the manifest here.
	 */
}
/*

 */
function modInspect(modName,context){

	fs=require('fs');
		
	if(typeof(root.modules[modName])!=undefined){
		console.log('module ['+modName+'] exists.  Cannot load duplicate.');
	}
	/*init module object.*/
	root.modules[modName]={}
	
	var module_path=root.config.app.modules+modName;
	
	if( !fs.statSync(module_path).isDirectory() ) throw new Error('module ('+modName+') not found');

	var module_manifest=module_path+"manifest.json";
	if( fs.statSync(module_manifest).isFile() ) {
		try{
			root.modules[modName].manifest=require(modules_manifest);
		}catch(e){
			throw new Error('manifest.json failed to load');
		}
	}else{
		throw new Error('manifest.json not found');
	}
	/*Validate manifest JSON*/
	if(typeof(root.modules[modName].manifest)!='object')
		throw new Error('Invalid manifest detected for module '+modName);
	if(typeof(root.modules[modName].manifest.name)!='string')
		throw new Error('Invalid manifest name (expected string)  module:'+modName);
	if(typeof(root.modules[modName].manifest.group)!='group')
		throw new Error('Invalid manifest group (expected string) module:'+modName);
	if(typeof(root.modules[modName].manifest.loader)!='object')
		throw new Error('Invalid manifest loader object.  module:'+modName);
	if(typeof(root.modules[modName].manifest.loader.bootstrap)!='boolean')
		throw new Error('Invalid manifest bootstrap (expect boolean).  module:'+modName);
	if(typeof(root.modules[modName].manifest.loader.preload)!='boolean')
		throw new Error('Invalid manifest preload (expected boolean).  module:'+modName);
	if(typeof(root.modules[modName].manifest.main)!='string')
		throw new Error('Invalid manifest main (expected string).  module:'+modName);
	if(typeof(root.modules[modName].manifest.config)!='string')
		throw new Error('Invalid manifest config (expected string).  module:'+modName);
	if(typeof(root.modules[modName].manifest.errors)!='string')
		throw new Error('Invalid manifest errors (expected string).  module:'+modName);
	if(root.modules[modName].manifest.loader.preload){
		if(context.toLowerCase()=='preload'){
			load_my_module(modName);		
		}else{
			console.log('Not loading module ['+modName+'] not marked as preload.');
		}
	}else{
		if(context.toLowerCase()=='nopreload'){
			load_my_module(modName);
		}else{
			console.log('Not loading module ['+modName+'] marked as preload.');
		}
	}	
}
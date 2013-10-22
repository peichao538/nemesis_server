/*
	Nemesis Error Handling Constructor
	/srv/nemesis/core/core.error.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file will establish error handling as root.error.{messages,raise()}
	
*/
package.exports=init;
var util=require('util');

function init(){

	root.error.messages=require(root.conf_dir+"/errors/errors-"+root.config.language+".json");
	root.error.raise=function(e,detail){	
		
		util.log(Array(60).join('=')+"\nERROR:");
		switch(typeof(e)){
			case "object":
				util.log("      CODE:"+e.code);
				util.log("   MESSAGE:"+e.text);
				if(typeof(detail)=='string') util.log("    DETAIL:"+detail);  
				if((typeof(e.code.fatal)=='boolean') && e.code.fatal ){
					util.log("----STACK TRACE----");
					console.trace();
					/*
						Need a debugging stack trace.
					*/
					process.exit(e.code);
				}
				break;
				
			case "string":
			case "number":
			case "boolean":
				util.log("   MESSAGE:"+e);
				break;
				
			default:
				util.log("   UNEXPECTED ERROR TYPE:"+typeof(e));
				util.log("   MESSAGE:"+e);
				break;
		}
	}
}
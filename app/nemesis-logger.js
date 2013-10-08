/*
	/srv/nemsis/app/nemesis-logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates the Nemesis Logger, which will allow the application
	to write output to stdout or syslog with only a single change in this 
	file.
	
	While working on development, this file will simply write output to
	stdout.  It will take care of any formatting or other cosmetic issues.
	But before this project goes into production, syslog will be added so that
	daemonized processes can send their output to syslog without much effort.
*/
module.exports=logger;

function logger(){/* Constructor*/}

/*write(message,intend)*/
logger.write=function(m,i){console.log( Array((i==undefined)?0:i).join(" ")+m);}

/*draw(width). Default Width==40*/
logger.drawline=function(w){;console.log(Array((w==undefined)?40:w).join("-"));}

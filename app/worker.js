/*
	/srv/nemesis/app/worker.js
	Child-Process Wrapper Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This script is used by app.js to fork a new process where the Nemesis
	web services (audit, broker, cipher, keys) will run.  This wrapper script
	is intended to manage the web services and interact with the parent (master)
	process operated by app.js.
*/
var log=require('nemesis-logger.js');
	log.source="worker.js";
	
log.drawBanner('worker.js is starting...');

process.on('message', function(msg){
	log.write('worker.js has received a message from parent.');
	if(typeof(msg)!='object'){
		throw new Error('Non-object message passed from parent to child process.');
	}
	switch(msg.code){
		/*Process-Initialization Messages*/
		case 0:
				log.write("message {code:0} recieved.  Replying {code:1}");
				process.send({code:1});
				break;
		code 2:
				log.write("message {code:2} recieved.  Replying {code:[3,4]}");
				server=msg.data;
				if(typeof(server)=='object'){
					process.send({code:((server.start()==0)?3:4 ));
				}else{
					throw new Error('message {code:2} contained non-object data value');
				}
				break;
		/*Process-Monitoring Messages*/
		code 10:
				log.write ("{code:10} received");
				process.send({code:11,data:msg.data});
				break;
		code 12:log.write ("msg.code rec'd. Not implemented: {code:12}"); break;
		/*Process-Management Messages*/
		code 96:log.write ("msg.code rec'd. Not implemented: {code:96}"); break;
		code 98:log.write ("msg.code rec'd. Not implemented: {code:98}"); break;
		/*Catch-all*/
		default:
				throw new Error('Unrecognized or invalid message ('+msg.code+') passed to child.");
				break;
	}
});
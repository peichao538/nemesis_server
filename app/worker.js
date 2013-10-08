/*
	/srv/nemesis/app/worker.js
	Child-Process Wrapper Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This script is used by app.js to fork a new process where the Nemesis
	web services (audit, broker, cipher, keys) will run.  This wrapper script
	is intended to manage the web services and interact with the parent (master)
	process operated by app.js.
*/
var logger=require('/srv/nemesis/app/logger/logger.js');
var log=new logger("worker.js(main)");
	
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
		case 2:
				log.write("message {code:2} recieved.  Replying {code:[3,4]}");
				if(typeof(msg.data)!='object'){
					throw new Error('msg.data not an object in {code:2}');
				}
				if(typeof(msg.data.path)!='string'){
					throw new Error('msg.data.path is not a string in {code:2}');
				}
				if(typeof(msg.data.id)!='number'){
					throw new Error('msg.data.id is not a number in {code:2}');
				}
				if(typeof(msg.data.config)!='string'){
					throw new Error('msg.data.config is not a string');
				}
				log.write("validated {code:2} message content.");
				
				serverFactory=require(msg.data.path);
				server=new serverFactory(msg.data.id,msg.data.config);
				
				}else{
					if(msg.data==undefined){
						throw new Error('msg.data undefined in {code:2}');
					}else{
						throw new Error('msg.data not a string (expected) in {code:2}');
					}
				}
				if(typeof(server)=='object'){
					if(typeof(server.start)=='function'){
					
						serverFactory=require(workerPath);
						server=new serverFactory(index,data);
					
						process.send({code:((server.start()==0)?3:4 )});
					}else{
						log.write(server.prototype);
						throw new Error('server.start() not present or not a function.');
					}
				}else{
					throw new Error('message {code:2} contained non-object data value');
				}
				
				
				
				
				
				break;
		/*Process-Monitoring Messages*/
		case 10:
				log.write ("{code:10} received");
				process.send({code:11,data:msg.data});
				break;
		case 12:log.write ("msg.code rec'd. Not implemented: {code:12}"); break;
		/*Process-Management Messages*/
		case 96:log.write ("msg.code rec'd. Not implemented: {code:96}"); break;
		case 98:log.write ("msg.code rec'd. Not implemented: {code:98}"); break;
		/*Catch-all*/
		default:
			if(msg.code==undefined){
				throw new Error('msg.code is undefined when child processed message.');
			}else{
				throw new Error(
					'Unrecognized or invalid message ('+msg.code+') passed to child.'
				);
			}
			break;
	}
});

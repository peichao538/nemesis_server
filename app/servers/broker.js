/*
	broker worker
*/
module.exports=Broker;
var log=require('nemesis-logger.js');
	log.source="broker.js";

function Broker(id,config){
	
		
	if(config==undefined) throw new Error('config is not defined.');
	if(id==undefined) throw new Error('index is not defined.');
	if(typeof(config)!='object') throw new Error('config is not an object.  type:'+typeof(config));
	if(typeof(id)!='number') throw new Error('id must be a number.');
	
	log.write("           running Broker.main().");
	log.write("                ipAddress:"+config.ipAddress);
	log.write("                ipPort:   "+config.ipPort);
	log.write(" ");
	this.status=0;/*successful spawn.  Return non-zero for error codes.*/
	log.write('the server is instantiated.  But start() must be called to start it.');

}
Broker.start=function(){
	log.write('Attempting to start the server...');
	try {
	
		var http = require('http');
		http.createServer(function (req, res) {
		  res.writeHead(200, {'Content-Type': 'text/plain'});
		  res.end('Hello World.  I am broker#'+config.workerId+'\n');
		}).listen(config.ipPort, config.ipAddress);
	
	}catch(e){
	
		log.write('           Broker failed to open http listener');
		return 10;/*Fatal Error*/
		
	}
	log.write('Server started!');
	return 0;/*Successful start*/
}
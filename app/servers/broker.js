/*
	Nemesis Broker Server
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file defines the broker web service.
	
*/
module.exports=BrokerServer;

/*Return codes for server.start()*/
const SERVER_OK=0
const SERVER_FAIL=1

const E_CFG_NOT_DEFINED='BrokerServer(): config is not defined.';
const E_ID_NOT_DEFINED='BrokerServer(): id parameter not defined.';
const E_CFG_NOT_OBJ='BrokerServer(): config is not an object.';
const E_ID_NOT_NUMBER='BrokerServer(): id parameter must be a number';

function timestamp(){return "["+(new Date).toISOString()+"]";}
log={
	banner:function(m,w){log.line(w);log.write(m);log.line(w);console.log(" ");},
	line:function(w){console.log(Array(w).join('-'));},
	write:function(m){console.log(timestamp()+m)},
	list_pids:function(){
		for(i=0,p='';i<global.procs.length;i++){p=p+global.procs[i].pid+',';}
		log.write("   PID_List:["+p.substring(0,p.length-1)+"]");
	}
}

function BrokerServer(id,config,ssl_config){	
	if(typeof(config)=='undefined') throw new Error(E_CFG_NOT_DEFINED);
	if(typeof(id)=='undefined') throw new Error(E_ID_NOT_DEFINED);
	if(typeof(config)!='object') throw new Error(E_CFG_NOT_OBJ+' type:'+typeof(config));
	if(typeof(id)!='number') throw new Error(E_ID_NOT_NUMBER);
	log.write("BrokerServer():{ipAddress:'"+config.ipAddress+"',"
	         				   +"ipPort:"+config.ipPort+","
	         				   +"ssl:"+config.ssl+"}");
	this.status=0;/*successful spawn.  Return non-zero for error codes.*/
	this.start=function(){
		var server=(config.ssl)
			?require('https').createServer(ssl_config,function(req,res){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Hello World.  I am broker#'+config.workerId+'\n');
			})
			:require('http').createServer(function(req,res){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Hello World.  I am broker#'+config.workerId+'\n');
			});
		server.on('request',function(req,res){
			log.write('BrokerServer('+req+','+res+')[request];');
		});
		server.on('connection',function(socket){
			log.write('BrokerServer()[connection established]')
		});
		server.on('close',function(){
			log.write('BrokerServer()[connection closed]')
		});
		server.on('connect',function(request,socket,head){
			log.write('BrokerServer()[connect]');
		});
		server.on('clientError',function(exception,socket){
			log.write('clientError('+exception+','+socket+')');
		});
		try{			
			server.listen(config.ipPort,config.ipAddress);
			log.write('Server started!');
			return SERVER_OK;
		}catch(e){
			log.write("Broker failed to listen on "+config.ipAddress+":"+config.ipPort)
			return SERVER_FAIL;
		}
	}/*server.start();*/
}

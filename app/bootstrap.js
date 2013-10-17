/*
	/srv/nemesis/app/app.bootstrap.js
	Nemesis Web Services Master Process Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	root.app
	
	This is the master process (app.bootstrap.js) for the Nemesis web services.
	
	Each of the four (4) web services (audit,broker,cipher,keys) are launched
	using this app.js script, passing in a path and filename to the specific 
	web service's configuration file.  These config files contain a general 
	description of the environment to be established for the web service(s) 
	and the configuration data for each service's workers.

	This process is the command and control for all processes spawned
	as workers for the given web service.  The mission of this app.js
	script is to launch the required threads and then to monitor them
	in real time and respawn any worker process which may die or become
	unresponsive.
	
	---------------------------------------------------------------------------------
*/
/*
	Load the main configuration file.
*/
root.config=require('/srv/nemesis/etc/nemesis/app.conf.json');
root.messages:require(CONF_DIR+'messages/messages-'+root.config.language+'.json');
root.messages.error:require(CONF_DIR+'errors/errors-'+root.config.language+'.json');
/*
	Load the appropriate service configuration file.
*/
switch(process.argv[2]){
	case "audit": 	root.config.service=require(root.config.modules.svc_cfg.audit);break;
	case "broker":	root.config.service=require(root.config.modules.svc_cfg.audit);break;
	case "cipher":	root.config.service=require(root.config.modules.svc_cfg.audit);break;
	case "key":		root.config.service=require(root.config.modules.svc_cfg.audit);break;
	default: 
		throw new Error(root.messages.error.bootstrap.invalidArgument);
		process.exit(1);
		break;
}
/*
	Define the application
*/
root.app={
	log:new logger(module.filename,process.pid),
	root.app.main=require(),
	
	startService:require(root.config.modules.app.start),
	monitor:{
		heartbeat:require(root.config.modules.lib.monitor.heartbeat),
		statistics:require(root.config.modules.lib.monitor.statistics),
	}	
}
/*
	Launch the application
*/
root.app.main();
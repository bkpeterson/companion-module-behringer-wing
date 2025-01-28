module.exports = function (self) {
	var varArr = [
		{
			name: 'WING IP Address',
			variableId:  'm_ip',
		},
		{
			name: 'WING Name',
			variableId:  'm_name'
		},
		{
			name: 'WING Model',
			variableId:  'm_model'
		},
		{
			name: 'WING Serial Number',
			variableId:  'm_serial'
		},
		{
			name: 'WING Firmware',
			variableId:  'm_fw'
		}
	];

	/* Set up Channel variables */
	for(var i=1; i<=40; i++) {
		varArr.push({variableId: 'ch'+i, name: 'Channel '+i+' Name'});
		varArr.push({variableId: 'ch'+i+'_d', name: 'Channel '+i+' dB'});
		varArr.push({variableId: 'ch'+i+'_p', name: 'Channel '+i+' %'});

		/* Add the 16 bus sends */
		for(var j=1; j<=16; j++) {
			varArr.push({ variableId: 'ch'+i+'_bus'+j+'_d',  name: 'Channel '+i+' to Bus '+j+' dB' });
			varArr.push({ variableId: 'ch'+i+'_bus'+j+'_p',  name: 'Channel '+i+' to Bus '+j+' %' });	
		}

		/* Add the 4 main sends */
		for(var j=1; j<=4; j++) {
			varArr.push({ variableId: 'ch'+i+'_main'+j+'_d',  name: 'Channel '+i+' to Main '+j+' dB' });
			varArr.push({ variableId: 'ch'+i+'_main'+j+'_p',  name: 'Channel '+i+' to Main '+j+' %' });	
		}
	}

	/* Set up Aux variables */
	for(var i=1; i<=8; i++) {
		varArr.push({variableId: 'aux'+i, name: 'Aux '+i+' Name'});
		varArr.push({variableId: 'aux'+i+'_d', name: 'Aux '+i+' dB'});
		varArr.push({variableId: 'aux'+i+'_p', name: 'Aux '+i+' %'});

		/* Add the 16 bus sends */
		for(var j=1; j<=16; j++) {
			varArr.push({ variableId: 'aux'+i+'_bus'+j+'_d',  name: 'Aux '+i+' to Bus '+j+' dB' });
			varArr.push({ variableId: 'aux'+i+'_bus'+j+'_p',  name: 'Aux '+i+' to Bus '+j+' %' });	
		}

		/* Add the 4 main sends */
		for(var j=1; j<=4; j++) {
			varArr.push({ variableId: 'aux'+i+'_main'+j+'_d',  name: 'Aux '+i+' to Main '+j+' dB' });
			varArr.push({ variableId: 'aux'+i+'_main'+j+'_p',  name: 'Aux '+i+' to Main '+j+' %' });	
		}
	}

	/* Set up Bus variables */
	for(var i=1; i<=16; i++) {
		varArr.push({variableId: 'bus'+i, name: 'Bus '+i+' Name'});
		varArr.push({variableId: 'bus'+i+'_d', name: 'Bus '+i+' dB'});
		varArr.push({variableId: 'bus'+i+'_p', name: 'Bus '+i+' %'});

		/* Add the 4 main sends */
		for(var j=1; j<=4; j++) {
			varArr.push({ variableId: 'bus'+i+'_main'+j+'_d',  name: 'Bus '+i+' to Main '+j+' dB' });
			varArr.push({ variableId: 'bus'+i+'_main'+j+'_p',  name: 'Bus '+i+' to Main '+j+' %' });	
		}

		/* Add the 8 matrix sends */
		for(var j=1; j<=8; j++) {
			varArr.push({ variableId: 'bus'+i+'_mtx'+j+'_d',  name: 'Bus '+i+' to Matrix '+j+' dB' });
			varArr.push({ variableId: 'bus'+i+'_mtx'+j+'_p',  name: 'Bus '+i+' to Matrix '+j+' %' });	
		}

		/* Add the 8 bus sends */
		for(var j=1; j<=8; j++) {
			varArr.push({ variableId: 'bus'+i+'_bus'+j+'_d',  name: 'Bus '+i+' to Bus '+j+' dB' });
			varArr.push({ variableId: 'bus'+i+'_bus'+j+'_p',  name: 'Bus '+i+' to Bus '+j+' %' });	
		}
	}

	/* Set up Main variables */
	for(var i=1; i<=4; i++) {
		varArr.push({variableId: 'main'+i, name: 'Main '+i+' Name'});
		varArr.push({variableId: 'main'+i+'_d', name: 'Main '+i+' dB'});
		varArr.push({variableId: 'main'+i+'_p', name: 'Main '+i+' %'});

		/* Add the 8 matrix sends */
		for(var j=1; j<=8; j++) {
			varArr.push({ variableId: 'main'+i+'_mtx'+j+'_d',  name: 'Main '+i+' to Matrix '+j+' dB' });
			varArr.push({ variableId: 'main'+i+'_mtx'+j+'_p',  name: 'Main '+i+' to Matrix '+j+' %' });	
		}
	}

	/* Set up Matrix variables */
	for(var i=1; i<=8; i++) {
		varArr.push({variableId: 'mtx'+i, name: 'Matrix '+i+' Name'});
		varArr.push({variableId: 'mtx'+i+'_d', name: 'Matrix '+i+' dB'});
		varArr.push({variableId: 'mtx'+i+'_p', name: 'Matrix '+i+' %'});

		/* Add the 2 direct sends */
		for(var j=1; j<=2; j++) {
			varArr.push({ variableId: 'mtx'+i+'_dir'+j+'_d',  name: 'Matrix '+i+' to Direct In '+j+' dB' });
			varArr.push({ variableId: 'mtx'+i+'_dir'+j+'_p',  name: 'Matrix '+i+' to Direct In '+j+' %' });	
		}
	}

	self.setVariableDefinitions(varArr);
}

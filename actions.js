module.exports = function (self) {
	self.setActionDefinitions({
		"solo_mute": {
			name: "Solo Mute",
			options: [{
				type:	'dropdown',
				label:	'Value',
				id:		'set',
				default: '2',
				choices: [
					{id: '1', label: 'On'},
					{id: '0', label: 'Off'},
					{id: '2', label: 'Toggle'}
				]
			}],
			callback: async (action) => {
				var cmd = '/cfg/solo/mute';
				self.sendOSC(
					cmd, 
					{type: 'i', value: setToggle(cmd, action.options.set)}, 
					true
				);
			}
		},
		"solo_$dim": {
			name: "Solo Dim",
			options: [{
				type:	'dropdown',
				label:	'Value',
				id:		'set',
				default: '2',
				choices: [
					{id: '1', label: 'On'},
					{id: '0', label: 'Off'},
					{id: '2', label: 'Toggle'}
				]
			}],
			callback: async (action) => {
				var cmd = '/cfg/solo/$dim';
				self.sendOSC(
					cmd, 
					{type: 'i', value: setToggle(cmd, action.options.set)}, 
					true
				);
			}
		},
		"solo_$mono": {
			name: "Solo Mono",
			options: [{
				type:	'dropdown',
				label:	'Value',
				id:		'set',
				default: '2',
				choices: [
					{id: '1', label: 'On'},
					{id: '0', label: 'Off'},
					{id: '2', label: 'Toggle'}
				]
			}],
			callback: async (action) => {
				var cmd = '/cfg/solo/$mono';
				self.sendOSC(
					cmd, 
					{type: 'i', value: setToggle(cmd, action.options.set)}, 
					true
				);
			}
		},
		"clearsolo": {
			name: "Solo Clear",
			description: "Clear all active Solos",
			options: [],
			callback: async (action) => {
				for (var s of self.soloList) {
					self.sendOSC(
						s, 
						{type: 'i', value: 0 },
						true
					);
				}
			}
		},
		"talk": {
			name: 'Talkback',
			description: 'Turn Talkback On/Off',
			options: [
				{
					id: 'bus',
					type: 'dropdown',
					label: 'Bus',
					default: 'A',
					choices: [
						{ id: 'A', label: 'Talkback A' },
						{ id: 'B', label: 'Talkback B' }
					]
				},
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					default: '1',
					choices: self.CHOICES_ON_OFF
				}
			],
			callback: async (action) => {
				var cmd = '/cfg/talk/' + action.options.bus + '/$on';
				self.sendOSC(
					cmd, 
					{type: 'i', value: setToggle(cmd, action.options.on)}, 
					true
				);
			}
		},
		"talk_d": {
			name: 'Talkback Destination',
			description: 'Enable Talkback Destination',
			options: [
				{
					id: 'bus',
					type: 'dropdown',
					label: 'Bus',
					default: 'A',
					choices: [
						{ id: 'A', label: 'Talkback A' },
						{ id: 'B', label: 'Talkback B' }
					]
				},
				{
					id: 'dest',
					type: 'dropdown',
					label: 'Destination',
					choices: [
						{id: 'B1', label: 'Bus 1'},
						{id: 'B2', label: 'Bus 2'},
						{id: 'B3', label: 'Bus 3'},
						{id: 'B4', label: 'Bus 4'},
						{id: 'B5', label: 'Bus 5'},
						{id: 'B6', label: 'Bus 6'},
						{id: 'B7', label: 'Bus 7'},
						{id: 'B8', label: 'Bus 8'},
						{id: 'B9', label: 'Bus 9'},
						{id: 'B10', label: 'Bus 10'},
						{id: 'B11', label: 'Bus 11'},
						{id: 'B12', label: 'Bus 12'},
						{id: 'B13', label: 'Bus 13'},
						{id: 'B14', label: 'Bus 14'},
						{id: 'B15', label: 'Bus 15'},
						{id: 'B16', label: 'Bus 16'},
						{id: 'M1', label: 'Main 1'},
						{id: 'M2', label: 'Main 2'},
						{id: 'M3', label: 'Main 3'},
						{id: 'M4', label: 'Main 4'}
					],
					default: 'B1'
				},
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					default: '1',
					choices: self.CHOICES_ON_OFF
				}
			],
			callback: async (action) => {
				cmd = '/cfg/talk/' + action.options.bus + '/' + action.options.dest;
				self.sendOSC(
					cmd, 
					{type: 'i', value: setToggle(cmd, action.options.on)}, 
					true
				);
			}
		},
		"fdr": {
			name: 'Fader Set',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					type: 'number',
					label: 'Fader Level',
					id: 'fad',
					default: 0.0,
					min: -144,
					max: 10
				}
			],
			callback: async (action) => {
				var arg = [];
				var cmd = action.options.strip + '/fdr';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd. arg, true);
				}
			}
		},
		"fdr_a": {
			name: 'Fader Adjust',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					type:	 'number',
					tooltip: 'Adjust fader +/- percent.\n0% = -oo, 75% = 0db, 100% = +10db',
					label:	 'Adjust',
					id:		 'ticks',
					min:	 -100,
					max:	 100,
					default: 1
				}
			],
			callback: async (action) => {
				var arg = [];
				var cmd = action.options.strip + '/fdr';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd. arg, true);
				}
			}
		},
		"fdr_r": {
			name: 'Fader Recall',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					type:	 'dropdown',
					tooltip: 'Recall stored fader value',
					label:	 'From',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Strip"
						},
						...self.STORE_LOCATION
					]
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}				
			],
			callback: async (action) => {
				var arg = [];
				var cmd = action.options.strip + '/fdr';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd. arg, true);
				}
			}
		},
		"fdr_s": {
			name: 'Fader Store',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					type:	 'dropdown',
					tooltip: 'Store fader value for later recall',
					label:	 'Where',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Strip"
						},
						...self.STORE_LOCATION
					]	
				}			
			],
			callback: async (action) => {
				var arg = [];
				var cmd = action.options.strip + '/fdr';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd. arg, true);
				}
			}
		},
		"col": {
			name: 'Color',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					id: 'col',
					type: 'dropdown',
					label: 'Color',
					default: 1,
					choices: self.COLOR_VALUES
				}			
			],
			callback: async (action) => {
				var arg = {
					type: 'i',
					value: parseInt(action.options.col)
				};
				var cmd = action.options.strip + '/col';
				self.sendOSC(cmd, arg, true);
			}
		},
		"led": {
			name: 'LED',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}			
			],
			callback: async (action) => {
				var cmd = action.options.strip + '/led';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"icon": {
			name: 'Icon',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					id: 'icon',
					type: 'number',
					label: 'Icon ID',
					min: 0,
					max: 999,
					default: 0,
					range: false,
					required: true
				}			
			],
			callback: async (action) => {
				var arg = {
					type: 'i',
					value: parseInt(action.options.icon)
				};
				var cmd = action.options.strip + '/icon';				
				self.sendOSC(cmd, arg, true);
			}
		},
		"$solo": {
			name: 'Solo',
			options: [
				self.OPTIONS_STRIP_BASE,
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}			
			],
			callback: async (action) => {
				var cmd = action.options.strip + '/$solo';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"mute": {
			name: 'Mute',
			options: [
				self.OPTIONS_STRIP_ALL,
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}			
			],
			callback: async (action) => {
				var cmd = action.options.strip + '/mute';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"name": {
			name: 'Name',
			options: [
				self.OPTIONS_STRIP_ALL,
				{
					id: 'name',
					type: 'textinput',
					label: 'Name',
					tooltip: 'Maximum 16 characters'
				}			
			],
			callback: async (action) => {
				var arg = {
					type: "s",
					value: "" + action.options.name
				};
				var cmd = action.options.strip + '/name';
				self.sendOSC(cmd, arg, true);
			}
		},
		"send_bm_on": {
			name: 'Ch, Aux Send On',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source strip',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['ch'][0].id,
					choices: [
						...self.CHOICES_STRIP['ch'],
						...self.CHOICES_STRIP['aux']
					]
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bm'][0].id,
					choices: self.CHOICES_BUS['send_bm']
				},
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}				
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/on';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"send_m_on": {
			name: 'Main Send',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source Main',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['main'][0].id,
					choices: self.CHOICES_STRIP['main']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_m'][0].id,
					choices: self.CHOICES_BUS['send_m']
				},
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}				
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/on';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"send_bmm_on": {
			name: 'Bus Send',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source bus',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['bus'][0].id,
					choices: self.CHOICES_STRIP['bus']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bmm'][0].id,
					choices: self.CHOICES_BUS['send_bmm']
				},
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/on';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"direct_on": {
			name: 'Matrix Direct In',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Matrix',
					label: 'Matrix',
					id: 'matrix',
					default: self.CHOICES_STRIP['mtx'][0].id,
					choices: self.CHOICES_STRIP['mtx']
				},
				{
					TYPE: 'dropdown',
					tooltip: 'Direct Input',
					label: 'Input',
					id: 'source',
					default: self.CHOICES_BUS['direct'][0].id,
					choices: self.CHOICES_BUS['direct']
				},
				{
					id: 'on',
					type: 'dropdown',
					label: 'State',
					choices: self.CHOICES_ON_OFF,
					default: '1'
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/on';
				var arg = {
					type: 'i',
					value: self.setToggle(cmd, action.options.on)
				};
				self.sendOSC(cmd, arg, true);
			}
		},
		"send_bm_lvl_s": {
			name: 'Ch, Aux Send Level Store',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source strip',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['ch'][0].id,
					choices: [
						...self.CHOICES_STRIP['ch'],
						...self.CHOICES_STRIP['aux']
					]
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bm'][0].id,
					choices: self.CHOICES_BUS['send_bm']
				},
				{
					type:	 'dropdown',
					tooltip: 'Store level for later recall',
					label:	 'Where',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_m_lvl_s": {
			name: 'Main Send Level Store',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source Main',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['main'][0].id,
					choices: self.CHOICES_STRIP['main']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_m'][0].id,
					choices: self.CHOICES_BUS['send_m']
				},
				{
					type:	 'dropdown',
					tooltip: 'Store level for later recall',
					label:	 'Where',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				}				
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bmm_lvl_s": {
			name: 'Bus Send Level Store',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source bus',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['bus'][0].id,
					choices: self.CHOICES_STRIP['bus']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bmm'][0].id,
					choices: self.CHOICES_BUS['send_bmm']
				},
				{
					type:	 'dropdown',
					tooltip: 'Store level for later recall',
					label:	 'Where',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"direct_lvl_s": {
			name: 'Matrix Direct In Level Store',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Matrix',
					label: 'Matrix',
					id: 'matrix',
					default: self.CHOICES_STRIP['mtx'][0].id,
					choices: self.CHOICES_STRIP['mtx']
				},
				{
					TYPE: 'dropdown',
					tooltip: 'Direct Input',
					label: 'Input',
					id: 'source',
					default: self.CHOICES_BUS['direct'][0].id,
					choices: self.CHOICES_BUS['direct']
				},
				{
					type:	 'dropdown',
					tooltip: 'Store level for later recall',
					label:	 'Where',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bm_lvl": {
			name: 'Ch, Aux Send Level Set',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source strip',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['ch'][0].id,
					choices: [
						...self.CHOICES_STRIP['ch'],
						...self.CHOICES_STRIP['aux']
					]
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bm'][0].id,
					choices: self.CHOICES_BUS['send_bm']
				},
				{
					type:	'number',
					label:	'Level',
					id:		'fad',
					default: 0.0,
					min: -144,
					max: 10
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}				
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_m_lvl": {
			name: 'Main Send Level Set',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source Main',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['main'][0].id,
					choices: self.CHOICES_STRIP['main']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_m'][0].id,
					choices: self.CHOICES_BUS['send_m']
				},
				{
					type:	'number',
					label:	'Level',
					id:		'fad',
					default: 0.0,
					min: -144,
					max: 10
				},	
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}			
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bmm_lvl": {
			name: 'Bus Send Level Set',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source bus',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['bus'][0].id,
					choices: self.CHOICES_STRIP['bus']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bmm'][0].id,
					choices: self.CHOICES_BUS['send_bmm']
				},
				{
					type:	'number',
					label:	'Level',
					id:		'fad',
					default: 0.0,
					min: -144,
					max: 10
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"direct_lvl": {
			name: 'Matrix Direct In Level Set',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Matrix',
					label: 'Matrix',
					id: 'matrix',
					default: self.CHOICES_STRIP['mtx'][0].id,
					choices: self.CHOICES_STRIP['mtx']
				},
				{
					TYPE: 'dropdown',
					tooltip: 'Direct Input',
					label: 'Input',
					id: 'source',
					default: self.CHOICES_BUS['direct'][0].id,
					choices: self.CHOICES_BUS['direct']
				},
				{
					type:	'number',
					label:	'Level',
					id:		'fad',
					default: 0.0,
					min: -144,
					max: 10
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bm_lvl_a": {
			name: 'Ch, Aux Send Level Adjust',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source strip',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['ch'][0].id,
					choices: [
						...self.CHOICES_STRIP['ch'],
						...self.CHOICES_STRIP['aux']
					]
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bm'][0].id,
					choices: self.CHOICES_BUS['send_bm']
				},
				{
					type:	 'number',
					tooltip: 'Adjust level +/- percent.\n0% = -oo, 75% = 0db, 100% = +10db',
					label:	 'Adjust',
					id:		 'ticks',
					min:	 -100,
					max:	 100,
					default: 1
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}				
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_m_lvl_a": {
			name: 'Main Send Level Adjust',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source Main',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['main'][0].id,
					choices: self.CHOICES_STRIP['main']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_m'][0].id,
					choices: self.CHOICES_BUS['send_m']
				},
				{
					type:	 'number',
					tooltip: 'Adjust level +/- percent.\n0% = -oo, 75% = 0db, 100% = +10db',
					label:	 'Adjust',
					id:		 'ticks',
					min:	 -100,
					max:	 100,
					default: 1
				},	
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}			
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bmm_lvl_a": {
			name: 'Bus Send Level Adjust',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source bus',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['bus'][0].id,
					choices: self.CHOICES_STRIP['bus']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bmm'][0].id,
					choices: self.CHOICES_BUS['send_bmm']
				},
				{
					type:	 'number',
					tooltip: 'Adjust level +/- percent.\n0% = -oo, 75% = 0db, 100% = +10db',
					label:	 'Adjust',
					id:		 'ticks',
					min:	 -100,
					max:	 100,
					default: 1
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"direct_lvl_a": {
			name: 'Matrix Direct In Level Adjust',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Matrix',
					label: 'Matrix',
					id: 'matrix',
					default: self.CHOICES_STRIP['mtx'][0].id,
					choices: self.CHOICES_STRIP['mtx']
				},
				{
					TYPE: 'dropdown',
					tooltip: 'Direct Input',
					label: 'Input',
					id: 'source',
					default: self.CHOICES_BUS['direct'][0].id,
					choices: self.CHOICES_BUS['direct']
				},
				{
					type:	 'number',
					tooltip: 'Adjust level +/- percent.\n0% = -oo, 75% = 0db, 100% = +10db',
					label:	 'Adjust',
					id:		 'ticks',
					min:	 -100,
					max:	 100,
					default: 1
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bm_lvl_r": {
			name: 'Ch, Aux Send Level Recall',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source strip',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['ch'][0].id,
					choices: [
						...self.CHOICES_STRIP['ch'],
						...self.CHOICES_STRIP['aux']
					]
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bm'][0].id,
					choices: self.CHOICES_BUS['send_bm']
				},
				{
					type:	 'dropdown',
					tooltip: 'Recall stored value',
					label:	 'From',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}				
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_m_lvl_r": {
			name: 'Main Send Level Recall',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source Main',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['main'][0].id,
					choices: self.CHOICES_STRIP['main']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_m'][0].id,
					choices: self.CHOICES_BUS['send_m']
				},
				{
					type:	 'dropdown',
					tooltip: 'Recall stored value',
					label:	 'From',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				},	
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}			
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"send_bmm_lvl_r": {
			name: 'Bus Send Level Recall',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Source bus',
					label: 'source',
					id: 'source',
					default: self.CHOICES_STRIP['bus'][0].id,
					choices: self.CHOICES_STRIP['bus']
				},
				{
					type: 'dropdown',
					tooltip: 'Destination',
					label: 'Destination',
					id: 'bus',
					default: self.CHOICES_BUS['send_bmm'][0].id,
					choices: self.CHOICES_BUS['send_bmm']
				},
				{
					type:	 'dropdown',
					tooltip: 'Recall stored value',
					label:	 'From',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		},
		"direct_lvl_r": {
			name: 'Matrix Direct In Level Recall',
			options: [
				{
					type: 'dropdown',
					tooltip: 'Matrix',
					label: 'Matrix',
					id: 'matrix',
					default: self.CHOICES_STRIP['mtx'][0].id,
					choices: self.CHOICES_STRIP['mtx']
				},
				{
					TYPE: 'dropdown',
					tooltip: 'Direct Input',
					label: 'Input',
					id: 'source',
					default: self.CHOICES_BUS['direct'][0].id,
					choices: self.CHOICES_BUS['direct']
				},
				{
					type:	 'dropdown',
					tooltip: 'Recall stored value',
					label:	 'From',
					id:		 'store',
					default: 'me',
					choices: [
						{ 	id: 'me',
							label: "This Send"
						},
						...self.STORE_LOCATION
					]
				},
				{
					type: 'number',
					label: 'Fade Duration (ms)',
					id: 'duration',
					default: 0,
					min: 0,
					step: 10,
					max: 60000
				}
			],
			callback: async (action) => {
				var cmd = action.options.source + action.options.bus + '/lvl';
				var fVal = self.fadeTo(cmd, action.options);
				if (fVal != undefined) {
					var arg = {
						type: 'f',
						value: fVal
					};
					self.sendOSC(cmd, arg, true);
				}
			}
		}
	})
}

const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {

	/* Set up array to track mixer status */
	self.xStat = {
		"/cfg/solo/mute": {
			fbID: "solo_mute",
			varID: "f_solo",
			valid: false,
			polled: 0,
			isOn: false
		},
		"/cfg/solo/$dim": {
			fbID: "solo_$dim",
			varID: "f_solo",
			valid: false,
			polled: 0,
			isOn: false
		},
		"/cfg/solo/$mono": {
			fbID: "solo_$mono",
			varID: "f_solo",
			valid: false,
			polled: 0,
			isOn: false
		},
		"/$stat/solo": {
			fbID: "clearsolo",
			valid: false,
			polled: 0,
			isOn: false
		}
	};


	/*
		Add the talkback and destination options
	*/
	self.xStat["/cfg/talk/A/$on"] = {
		fbID: "talk",
		isOn: false,
		polled: 0,
		valid: false
	};
	self.xStat["/cfg/talk/B/$on"] = {
		fbID: "talk",
		isOn: false,
		polled: 0,
		valid: false
	};

	for(var i=1; i<=16; i++) {
		self.xStat["/cfg/talk/A/B" + i] = {
			fbID: "talk_d",
			isOn: false,
			polled: 0,
			valid: false
		};
		self.xStat["/cfg/talk/B/B" + i] = {
			fbID: "talk_d",
			isOn: false,
			polled: 0,
			valid: false
		};
	}
	for(var i=1; i<=4; i++) {
		self.xStat["/cfg/talk/A/M" + i] = {
			fbID: "talk_d",
			isOn: false,
			polled: 0,
			valid: false
		};
		self.xStat["/cfg/talk/B/M" + i] = {
			fbID: "talk_d",
			isOn: false,
			polled: 0,
			valid: false
		};
	}


	/*
		Add each channel's feedback options
	*/
	for(var i=1; i<=40; i++) {
		self.xStat["/ch/" + i + "/fdr"] = {
			valid: false,
			polled: 0,
			idx: 0,
			fdr: 0.0,
			dvID: "ch" + i
		};
		self.xStat["/ch/" + i + "/name"] = {
			valid: false,
			polled: 0,
			defaultName: "Channel " + i,
			name: "Channel " + i,
			dvID: "ch" + i + "_n"
		};
		self.xStat["/ch/" + i + "/col"] = {
			valid: false,
			polled: 0,
			color: 1,
			fbID: "col"
		};
		self.xStat["/ch/" + i + "/icon"] = {
			valid: false,
			polled: 0,
			icon: 0,
			fbID: "icon"
		};
		self.xStat["/ch/" + i + "/led"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "led"
		};
		self.xStat["/ch/" + i + "/$solo"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "$solo"
		};
		self.xStat["/ch/" + i + "/mute"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "mute"
		};

		/*
			Add each of 16 bus sends to the channel
		*/
		for(var j=1; j<=16; j++) {
			self.xStat["/ch/" + i + "/send/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bm_on"
			};
			self.xStat["/ch/" + i + "/send/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "ch" + i + "_bus" + j
			};
		}

		/*
			Add each of 4 main sends to the channel
		*/
		for(var j=1; j<=4; j++) {
			self.xStat["/ch/" + i + "/main/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bm_on"
			};
			self.xStat["/ch/" + i + "/main/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "ch" + i + "_main" + j
			};
		}
	}



	/*
		Add each aux's feedback options
	*/
	for(var i=1; i<=8; i++) {
		self.xStat["/aux/" + i + "/fdr"] = {
			valid: false,
			polled: 0,
			idx: 0,
			fdr: 0.0,
			dvID: "aux" + i
		};
		self.xStat["/aux/" + i + "/name"] = {
			valid: false,
			polled: 0,
			defaultName: "Aux " + i,
			name: "Aux " + i,
			dvID: "aux" + i + "_n"
		};
		self.xStat["/aux/" + i + "/col"] = {
			valid: false,
			polled: 0,
			color: 1,
			fbID: "col"
		};
		self.xStat["/aux/" + i + "/icon"] = {
			valid: false,
			polled: 0,
			icon: 0,
			fbID: "icon"
		};
		self.xStat["/aux/" + i + "/led"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "led"
		};
		self.xStat["/aux/" + i + "/$solo"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "$solo"
		};
		self.xStat["/aux/" + i + "/mute"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "mute"
		};

		/*
			Add each of 16 bus sends to the aux
		*/
		for(var j=1; j<=16; j++) {
			self.xStat["/aux/" + i + "/send/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bm_on"
			};
			self.xStat["/aux/" + i + "/send/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "aux" + i + "_bus" + j
			};
		}

		/*
			Add each of 4 main sends to the aux
		*/
		for(var j=1; j<=4; j++) {
			self.xStat["/aux/" + i + "/main/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bm_on"
			};
			self.xStat["/aux/" + i + "/main/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "aux" + i + "_main" + j
			};
		}
	}



	/*
		Add each bus's feedback options
	*/
	for(var i=1; i<=16; i++) {
		self.xStat["/bus/" + i + "/fdr"] = {
			valid: false,
			polled: 0,
			idx: 0,
			fdr: 0.0,
			dvID: "bus" + i
		};
		self.xStat["/bus/" + i + "/name"] = {
			valid: false,
			polled: 0,
			defaultName: "Bus " + i,
			name: "Bus " + i,
			dvID: "bus" + i + "_n"
		};
		self.xStat["/bus/" + i + "/col"] = {
			valid: false,
			polled: 0,
			color: 1,
			fbID: "col"
		};
		self.xStat["/bus/" + i + "/icon"] = {
			valid: false,
			polled: 0,
			icon: 0,
			fbID: "icon"
		};
		self.xStat["/bus/" + i + "/led"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "led"
		};
		self.xStat["/bus/" + i + "/$solo"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "$solo"
		};
		self.xStat["/bus/" + i + "/mute"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "mute"
		};

		/*
			Add each of 4 main sends to the bus
		*/
		for(var j=1; j<=4; j++) {
			self.xStat["/bus/" + i + "/main/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bmm_on"
			};
			self.xStat["/bus/" + i + "/main/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "bus" + i + "_main" + j
			};
		}

		/*
			Add each of 8 matrix sends to the bus
		*/
		for(var j=1; j<=8; j++) {
			self.xStat["/bus/" + i + "/send/MX" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bmm_on"
			};
			self.xStat["/bus/" + i + "/send/MX" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "bus" + i + "_mtx" + j
			};
		}

		/*
			Add each of 8 bus sends to the bus
		*/
		for(var j=1; j<=8; j++) {
			self.xStat["/bus/" + i + "/send/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_bmm_on"
			};
			self.xStat["/bus/" + i + "/send/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "bus" + i + "_bus" + j
			};
		}
	}



	/*
		Add each main's feedback options
	*/
	for(var i=1; i<=4; i++) {
		self.xStat["/main/" + i + "/fdr"] = {
			valid: false,
			polled: 0,
			idx: 0,
			fdr: 0.0,
			dvID: "main" + i
		};
		self.xStat["/main/" + i + "/name"] = {
			valid: false,
			polled: 0,
			defaultName: "Main " + i,
			name: "Main " + i,
			dvID: "main" + i + "_n"
		};
		self.xStat["/main/" + i + "/col"] = {
			valid: false,
			polled: 0,
			color: 1,
			fbID: "col"
		};
		self.xStat["/main/" + i + "/icon"] = {
			valid: false,
			polled: 0,
			icon: 0,
			fbID: "icon"
		};
		self.xStat["/main/" + i + "/led"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "led"
		};
		self.xStat["/main/" + i + "/$solo"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "$solo"
		};
		self.xStat["/main/" + i + "/mute"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "mute"
		};

		/*
			Add each of 8 matrix sends to the main
		*/
		for(var j=1; j<=8; j++) {
			self.xStat["/main/" + i + "/send/MX" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "send_m_on"
			};
			self.xStat["/main/" + i + "/send/MX" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "main" + i + "_mtx" + j
			};
		}
	}



	/*
		Add each matrix's feedback options
	*/
	for(var i=1; i<=8; i++) {
		self.xStat["/mtx/" + i + "/fdr"] = {
			valid: false,
			polled: 0,
			idx: 0,
			fdr: 0.0,
			dvID: "mtx" + i
		};
		self.xStat["/mtx/" + i + "/name"] = {
			valid: false,
			polled: 0,
			defaultName: "Matrix " + i,
			name: "Matrix " + i,
			dvID: "mtx" + i + "_n"
		};
		self.xStat["/mtx/" + i + "/col"] = {
			valid: false,
			polled: 0,
			color: 1,
			fbID: "col"
		};
		self.xStat["/mtx/" + i + "/icon"] = {
			valid: false,
			polled: 0,
			icon: 0,
			fbID: "icon"
		};
		self.xStat["/mtx/" + i + "/led"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "led"
		};
		self.xStat["/mtx/" + i + "/$solo"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "$solo"
		};
		self.xStat["/mtx/" + i + "/mute"] = {
			valid: false,
			polled: 0,
			isOn: false,
			fbID: "mute"
		};

		/*
			Add each of 2 direct sends to the matrix
		*/
		for(var j=1; j<=2; j++) {
			self.xStat["/mtx/" + i + "/dir/" + j + "/on"] = {
				valid: false,
				polled: 0,
				isOn: false,
				fbID: "direct_on"
			};
			self.xStat["/mtx/" + i + "/dir/" + j + "/lvl"] = {
				valid: false,
				polled: 0,
				idx: 0,
				lvl: 0.0,
				dvID: "mtx" + i + "_direct" + j
			};
		}
	}


	/* Now setup the feedbacks */
	self.setFeedbackDefinitions({
		"solo_mute": {
			type: 'boolean',
			name: 'Solo Bus Mute on',
			label: 'Color on Solo Bus Mute',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			callback: function(feedback) {
				var fbType = feedback.type;
				var stat = self.xStat[fb2stat[fbType]];
				return stat.isOn;
			}
		},
		"solo_$dim": {
			type: 'boolean',
			name: 'Solo Bus Dim on',
			label: 'Color on Solo Bus Dim',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(0, 150, 200),
				color: combineRgb(255, 255, 255),
			},
			callback: function(feedback) {
				var fbType = feedback.type;
				var stat = self.xStat[fb2stat[fbType]];
				return stat.isOn;
			}
		},
		"solo_$mono": {
			type: 'boolean',
			name: 'Solo Bus Mono on',
			label: 'Color on Solo Bus Mono',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(0, 150, 200),
				color: combineRgb(255, 255, 255),
			},
			callback: function(feedback) {
				var fbType = feedback.type;
				var stat = self.xStat[fb2stat[fbType]];
				return stat.isOn;
			}
		},
		"clearsolo": {
			type: 'boolean',
			name: 'Any Solo Active',
			options: [
				{
					type: 	'checkbox',
					label: 	'Blink?',
					id:		'blink',
					default: 0
				}
			],
			defaultStyle: {
				bgcolor: combineRgb(168, 168, 0),
				color: combineRgb(0, 0, 0),
			},
			callback: function(feedback) {
				var opt = feedback.options;
				var fbType = feedback.type;
				var stat = self.xStat[self.fbToStat[fbType]];

				if (stat.isOn) {
					if (opt.blink) {		// wants blink
						if (self.blinkingFB[stat.fbID]) {
							self.blinkingFB[stat.fbID] = false;
						} else {
							self.blinkingFB[stat.fbID] = true;
						}
					}
				} else if (self.blinkingFB[stat.fbID]) {
					delete self.blinkingFB[stat.fbID];
				}

				return stat.isOn;
			}
		},
		"talk": {
			type: 'boolean',
			name: 'Color for Talkback On',
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
				}
			],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = '/cfg/talk/' + feedback.options.bus + '/$on';
				var stat = self.xStat[theNode];
				return stat.isOn;
			}
		},
		"talk_d": {
			type: 'boolean',
			name: 'Color for Talkback Destination On',
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
				}
			],
			defaultStyle: {
				bgcolor: combineRgb(0, 102, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = '/cfg/talk/' + feedback.options.bus + '/' + feedback.options.dest;
				var stat = self.xStat[theNode];
				return stat.isOn;
			}
		},
		"col": {
			type: 'advanced',
			name: 'Color of Strip',
			label: 'Set button text to Color of Strip',
			options: [],
			callback: function(feedback) {
				var theChannel = feedback.options.strip + '/' + feedback.type;
				var stat = self.xStat[theChannel];
				return { color: self.COLOR_VALUES[stat.color - 1].fg };
			}
		},
		"led": {
			type: 'advanced',
			name: 'Color on LED',
			label: 'Set button color when LED On',
			options: [],
			callback: function(feedback) {
				var color = self.xStat[feedback.options.strip + '/col'].color;
				var stat = self.xStat[feedback.options.strip + '/led']
				if (stat.isOn) {
					return { bgcolor: self.COLOR_VALUES[color - 1].fg };
				}
			}
		},
		"$solo": {
			type: 'advanced',
			name: 'Show Strip Solo',
			label: 'Show border if Strip is Soloed',
			options: [],
			callback: function(feedback) {
				var theNode = feedback.options.strip + '/' + feedback.type;
				var stat = self.xStat[theNode];
				if (stat.isOn) {
					return {  png64: self.ICON_SOLO };
				}
			}
		},
		"mute": {
			type: 'boolean',
			name: 'Color on Strip Mute',
			label: 'Set button color if Strip Mute is On',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = feedback.options.strip + '/' + feedback.type;
				var stat = self.xStat[theNode];
				return stat.isOn;
			}
		},
		"send_bm_on": {
			type: 'boolean',
			name: 'Color on Ch, Aux Send OFF',
			label: 'Set button color if Ch, Aux Send is OFF',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = feedback.options.source + feedback.options.bus + '/on';
				var stat = self.xStat[theNode];
				return !stat.isOn;
			}
		},
		"send_m_on": {
			type: 'boolean',
			name: 'Color on Main Send OFF',
			label: 'Set button color if Main Send is OFF',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = feedback.options.source + feedback.options.bus + '/on';
				var stat = self.xStat[theNode];
				return !stat.isOn;
			}
		},
		"send_bmm_on": {
			type: 'boolean',
			name: 'Color on Bus Send OFF',
			label: 'Set button color if Bus Send is OFF',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = feedback.options.source + feedback.options.bus + '/on';
				var stat = self.xStat[theNode];
				return !stat.isOn;
			}
		},
		"direct_on": {
			type: 'boolean',
			name: 'Color on Matrix Direct In OFF',
			label: 'Set button color if Matrix Direct In is OFF',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: combineRgb(255, 255, 255)
			},
			callback: function(feedback) {
				var theNode = feedback.options.source + feedback.options.bus + '/on';
				var stat = self.xStat[theNode];
				return !stat.isOn;
			}
		},

	})
}




'use strict';
const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

var OSC = require('osc');
var stripDef = require('./defstrip.json');
//var actDef = require('./defaction.json');
var busDef = require('./defbus.json');

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal);

		var self = this;
	
		this.ICON_SOLO = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUcSURBVHic7ZpLaFxVGIC//96ZTNKkqSnGN+JzUS3oyqi1ogstqKAIuhIVFEUUtOBGhC5UxI2FgigYKLqpFRdV8FFsN1rFbtoGWwyl1lStsa+0NjNJzsy5M7+LuXdyZzKT00zSJpTzwYU573O/+c859w4jeQ0UTytMsNgzWOp4QQ4y6YQijyrl4cWazFIgIHgHeDJJ1wkKKf/dLRy64LNaQuSV8XTaLzEHXpADL8iBF+TAC3LgBTnwghx4QQ68IAdekAMvyIEX5MALcuAFOfCCHHhBDrwgB16QAy/IgRfkwAty4AU58IIceEEOvCAHXpADL8iBF+TAC3LgBTnwghx4QQ68IAcNf8GjfzEmoUpfucgalJUIY2VhpKODYRHa+gduZPhY4XpVjnd08dS8JpfXQJNrXIORgnL5vDqcIyXDC9ZQsAZtuE5Ehofa6dMafrUGLRlG5to2r8FgyslUbYmJgsB1SrBzXLm0nYnNldIkAwIfAd1NivsryhUXYh6zURPUYStINaBXC8GOs8rK8z54wLOpOWxEuVfgEYQ3YYn8mTQJpzgkdaJcC699/yl953Nsa9gRL6eTjWWqBKqsaMjrskXesIY91jBqDfut4T1tmGerJaZKr53i7bh81BqGbJENqtMR3LjE6gTNlBT+clJZvtBiUjeyLR43iqZ4WpVsq7qqdFjDj032KrWG31S5JNXvDEGqLLeGoabti+xWpbOZoBnHvABZWyGoKKB3dhJuP6H0LKya2mB74k+hCp9GJf61hi+iIk+okktXjYq8CqyN5/g7yrvAUFy8qlzkrdmGiopsAG6Lkwfi9gcBUAaiEq83bZjXQAupCEpfE2VJImnXMW26kc4LVfoiw+EWUbHfGG5I6iZRYQ1lY7gxbr/CGsbj/NOq1f2sWQRZw7G43pSOVw8hneQaa7Bx/sHYx+wRlKbDKmE1ku7pRrYlYbhQiHAmLHEHsAk401C8OqzmEy+9W+P84c5ODsftzwI/xfl9xnBts3F0giuh9viyW3o5BSDLOIrWovBmbRIEVUGzPI5la5LkgQLyZWPozxfpZSzbyWuZHJeh3CfC5lTxOlVCoIfp024s3V6lerMAYVi/qScUQ3pTyVN1hVLrT5isqwec46tG1iphWQFZV0C2zraZtosIUbaLHzI5ngN2JUMzQT8wwfTXWHdiSeoEq1TIN+s7V6GQStafzOkTcNnM9uf8LpaNapIeiyVlnI0cWMPGkuFlVTpq863KTx5UK3QzLkKJZEOFW3SSq+O6XcCaOH88l+PPpgN1MZqKlAGNT2bN049wO4DAiEidSGCOL6spSY8XCLbMV5IqVwl8EBX5xxq+iopsjooMAaviKvtEmKR6B1vivDAK+LpkWB8V+Y44IgQ+F6HcbBwRVJTP4mRPVGJ7ybA+yvAtVL8c1Vr/9eQ10EKl+SnW6pqMJHl3+yQ5OdqhNMXWWcYpR4aHUzKXWcPeZnVLhiNamH6HbPEctDIyHGox1oEkquZ0irUiiSSBZyYIBtuVlLW8ovAS8L3AH0CJ6mm2A+XBTCffJHVFmMzkuB94X+EIYIFRgcFsmbukh+O1urAb2Inyc6r96dByt8CHwFHAKvwFbMrkWCvSfP+SvAYqCrlSZc43GGWEKBSAwR4qL7b788RSIq/BIPB8nDTzEgQQhUKUEUCHQfYu1EQXkQHgpvjztKDqq0V7VAJBZUEmt9QwGQAVKIcX5x3Ol4xUH8LaRqt9CNVN86JCYep/T6xGm2u0hEsAAAAASUVORK5CYII=';

		self.myMixer = {
			ip: '',
			name: '',
			model: '',
			serial: '',
			fw: ''
		};
	
		// mixer state
		self.xStat = {};

		// level/fader value store
		self.tempStore = {};
	
		self.actionDefs = {};
		self.toggleFeedbacks = {};
		self.colorFeedbacks = {};
		self.variableDefs = [];

		self.soloList = new Set();
		self.fLevels = {};
		self.FADER_STEPS = 1540;
		self.fLevels[self.FADER_STEPS] = [];
		self.blinkingFB = {};
		self.crossFades = {};
		self.needStats = true;
	
		self.PollTimeout = 800;
		self.PollCount = 7;
	
		self.build_choices();
	}

	async init(config) {
		var self = this;
	
		self.config = config
		self.updateStatus(InstanceStatus.Connecting)

		// cross-fade steps per second
		self.fadeResolution = 20;

		self.updateActions();
		self.updateVariableDefinitions();
		self.updateFeedbacks();
	//	self.init_presets();

		self.log('debug', Object.keys(self.xStat).length + " status addresses generated");
		self.init_osc();
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')

		if (this.heartbeat) {
			clearInterval(this.heartbeat);
			delete this.heartbeat;
		}
		if (this.blinker) {
			clearInterval(this.blinker);
			delete this.blinker;
		}
		if (this.fader) {
			clearInterval(this.fader);
			delete this.fader;
		}
		if (this.oscPort) {
			this.oscPort.close();
		}
	}

	async configUpdated(config) {
		var self = this;

		self.config = config;
		if (config.analyze) {
			self.analyzing = true;
			self.detVars = { startCount: 5, startTimeout: 200, endCount: 12, endTimeout: 4000 }
			self.passCount = 5;
			self.PollCount = 5;
			self.passTimeout = 200;
			self.PollTimeout = 200;
			self.varCounter = 0;
			self.firstPoll();
			self.log('info', `Sync Started (${self.PollCount}/${self.PollTimeout})`);
			self.config.analyze = false;
		} else {
			self.PollCount = 7;
			self.PollTimeout = 800;
			self.init();
		}
	};

	/**
	 * heartbeat to request updates, subscription expires every 10 seconds
	 */
	pulse() {
		var self = this;
		self.sendOSC("/*s", []);
		self.log('debug', 're-subscribe');

		// any leftover status needed?
		if (self.myMixer.model == '') {
			self.sendOSC("/?", []);
		}

		if (self.needStats) {
			self.pollStats();
		}
	}

	/**
	 * blink feedbacks
	 */
	blink() {
		var self = this;
		for (var f in self.blinkingFB) {
			self.checkFeedbacks(f);
		}
	}

	/**
	 * timed fades
	 */
	doFades() {
		var self = this;
		var arg = { type: 'f' };
		var fadeDone = [];

		for (var f in self.crossFades) {
			var c = self.crossFades[f];
			c.atStep++;
			var atStep = c.atStep;
			var newVal = c.startVal + (c.delta * atStep)
			var v = (Math.sign(c.delta)>0) ? Math.min(c.finalVal, newVal) : Math.max(c.finalVal, newVal);

			arg.value = self.faderToDB(v);

			self.sendOSC(f, arg);

			var newObj;
			newObj[self.xStat[f].dvID + '_p'] = Math.round(v * 100);
			newObj[self.xStat[f].dvID + '_d'] = self.faderToDB(v,true);
			self.setVariableValues(newObj);

			if (atStep > c.steps) {
				fadeDone.push(f);
			}
		}

		// delete completed fades
		for (f in fadeDone) {
			self.sendOSC(fadeDone[f],[]);
			delete self.crossFades[fadeDone[f]];
		}
	}

	/////////////////////////////////  Update this /////////////////////////////
	/*
	init_presets() {
		var self = this;

		var presets = [
			{
				category: 'Channels',
				label: 'Channel 1 Label\nIncludes Label, Color, Mute toggle, Mute feedback, Solo feedback',
				bank: {
					style: 'png',
					text: '$(wing:l_ch1)',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: 0
				},
				actions: [
					{
						action: 'mute',
						options: {
							type: '/ch/',
							num: 1,
							mute: 2
						}
					}
				],
				feedbacks: [
					{
						type: 'c_ch',
						options: {
							theChannel: 1
						}
					},
					{
						type: 'ch',
						options: {
							fg: 16777215,
							bg: self.rgb(128,0,0),
							theChannel: 1
						}
					},
					{
						type: 'solosw_ch',
						options: {
							theChannel: 1
						}
					}
				]
			},
			{
				category: 'Channels',
				label: 'Channel 1 Level\nIncludes Fader dB, Color, Solo toggle, Solo feedback',
				bank: {
					style: 'png',
					text: '$(wing:f_ch1_d)',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: 0
				},
				actions: [
					{
						action: 'solosw_ch',
						options: {
							num: 1,
							solo: 2
						}
					}
				],
				feedbacks: [
					{
						type: 'c_ch',
						options: {
							theChannel: 1
						}
					},
					{
						type: 'solosw_ch',
						options: {
							theChannel: 1
						}
					}
				]
			}
		];
		// self.setPresetDefinitions(presets);
	}
	*/
	//////////////////////////////////////////////////////////////

	pollStats() {
		var self = this;
		var stillNeed = false;
		var counter = 0;
		var timeNow = Date.now();
		var timeOut = timeNow - self.PollTimeout;
		var varCounter = self.varCounter;

		function ClearVars() {
			for (var id in self.xStat) {
				self.xStat[id].polled = 0;
				self.xStat[id].valid = false;
			}
		}

		var id;

		for (id in self.xStat) {
			if (!self.xStat[id].valid) {
				stillNeed = true;
				if (self.xStat[id].polled < timeOut) {
					self.sendOSC(id);
					self.xStat[id].polled = timeNow;
					counter++;
					if (counter > self.PollCount) {
						break;
					}
				}
			}
		}

		if (self.analyzing) {
			if (varCounter < 200) {
				self.varCounter = varCounter;
			} else {
				stillNeed = false;
			}
		}

		if (!stillNeed) {
			if (self.analyzing) {
				//pause counting while resetting data
				self.needStats = false;
				var d = (timeNow - self.timeStart) / 1000;
				self.log('info', 'Pass complete (' + varCounter + '@' + (varCounter / d).toFixed(1) + ')');
				if (self.passTimeout < self.detVars.endTimeout) {
					self.passTimeout += 200;
					self.PollTimeout = self.passTimeout;
					self.varCounter = 0;
					self.timeStart = Date.now();
					stillNeed = true;
				} else if (self.passCount < self.detVars.endCount) {
					self.passTimeout = self.detVars.startTimeout;
					self.PollTimeout = self.passTimeout;
					self.passCount += 1;
					self.varCounter = 0;
					self.PollCount = self.passCount;
					self.timeStart = Date.now();
					stillNeed = true;
				} else {
					self.analyzing = false;
				}
				if (self.analyzing) {
					ClearVars();
					self.log('info', `Sync Started (${self.PollCount}/${self.PollTimeout})`);
				}
			} else {
				self.status(self.STATUS_OK,"Mixer Status loaded");
				var c = Object.keys(self.xStat).length;
				var d = (timeNow - self.timeStart) / 1000;
				self.log('info', 'Sync complete (' + c + '@' + (c / d).toFixed(1) + ')');
			}
		}
		self.needStats = stillNeed;
	}

	firstPoll() {
		var self = this;

		self.timeStart = Date.now();
		self.sendOSC('/?',[]);
		self.pollStats();
		self.pulse();
	}

	stepsToFader(i, steps) {
		var res = i / ( steps - 1 );

		return Math.floor(res * 10000) / 10000;
	}

	faderToDB(f, asString) {
	// “f” represents OSC float data. f: [0.0, 1.0]
	// “d” represents the dB float data. d:[-oo, +10]

		// float Lin2db(float lin) {
		// 	if (lin <= 0.0) return -144.0;
		// 	if (lin < 0.062561095) return (lin - 0.1875) * 30. / 0.0625;
		// 	if (lin < 0.250244379) return (lin - 0.4375) / 0.00625;
		// 	if (lin < 0.500488759) return (lin - 0.6250) / 0.0125;
		// 	if (lin < 1.0) return (lin - 0.750) / 0.025;
		// 	return 10.;

		var self = this;
		var d = 0;
		var steps = self.FADER_STEPS;

		if (f <= 0.0) {
			d = -144;
		} else if (f < 0.062561095) {
			d = (f - 0.1875) * 30.0 / 0.0625;
		} else if (f < 0.250244379) {
			d = (f - 0.4375) / 0.00625;
		} else if (f < 0.500488759) {
			d = (f - 0.6250) / 0.0125;
		} else if (f < 1.0) {
			d = (f - 0.750) / 0.025;
		} else {
			d = 10.0;
		}

		d = (Math.round(d * (steps - 0.5)) / steps)

		if (asString) {
			return (f==0 ? "-oo" : (d>=0 ? '+':'') + d.toFixed(1));
		} else {
			return d;
		}
	}

	dbToFloat(d) {
		// “d” represents the dB float data. d:[-144, +10]
		// “f” represents OSC float data. f: [0.0, 1.0]
		var f = 0;

		if (d <= -90) {
			f = 0;
		} else if (d < -60.) {
			f = (d + 90.) / 480.;
		} else if (d < -30.) {
			f = (d + 70.) / 160.;
		} else if (d < -10.) {
			f = (d + 50.) / 80.;
		} else if (d <= 10.) {
			f = (d + 30.) / 40.;
		}

		return f;
	}

	init_osc() {
		var self = this;

		if (self.oscPort) {
			self.oscPort.close();
		}
		if (self.config.host === undefined) {
			self.updateStatus(InstanceStatus.BAD_CONFIG,'No host IP');
			self.log('error','No host IP');
		} else {
			self.oscPort = new OSC.UDPPort ({
				localAddress: "0.0.0.0",
				localPort: 2223,
				remoteAddress: self.config.host,
				remotePort: 2223,
				metadata: true
			});

			// listen for incoming messages
			self.oscPort.on('message', function(message, timeTag, info) {
				var args = message.args;
				var node = message.address;
				var leaf = node.split('/').pop();
				var v = 0;

				if (!self.needStats) {
					self.log('debug', "received " + message + " from " + info);
				}
				if (self.xStat[node] !== undefined) {
					if (args.length>1) {
						v = args[1].value;
					} else {
						v = args[0].value;
					}
					switch (leaf) {
					case 'on':
						self.xStat[node].isOn = (v == 1);
						self.checkFeedbacks(self.xStat[node].fbID);
						break;
					case 'mute':
					case 'led':
					case '$solo':
						self.xStat[node].isOn = (v == 1);
						if ('led' == leaf) {
							self.checkFeedbacks('col');
						}
						if ('$solo' == leaf) {
							var gs = true;
							if (v == 1){
								self.soloList.add(node);
							} else {
								self.soloList.delete(node);
								gs = (self.soloList.size > 0);
							}
							self.xStat['/$stat/solo'].isOn = gs;
						}
						self.checkFeedbacks(self.xStat[node].fbID);
						break;
					case 'fdr':
					case 'lvl':
						v = Math.floor(v * 10000) / 10000;
						self.xStat[node][leaf] = v;
						var newObj;
						newObj[self.xStat[node].dvID + '_p'] = Math.round(v * 100);
						newObj[self.xStat[node].dvID + '_d'] = self.faderToDB(v,true);
						self.setVariableValues(newObj);
						self.xStat[node].idx = self.fLevels[self.FADER_STEPS].findIndex((i) => i >= v);
						break;
					case 'name':
						// no name, use behringer default
						if (v=='') {
							v = self.xStat[node].defaultName;
						}
						if (node.match(/\/main/)) {
							v = v;
						}
						self.xStat[node].name = v;
						var newObj;
						newObj[self.xStat[node].dvID] = v;
						self.setVariableValues(newObj);
						break;
					case 'col':
						self.xStat[node].color = parseInt(args[0].value)
						self.checkFeedbacks(self.xStat[node].fbID);
						self.checkFeedbacks('led');
						break;
					case '$mono':
					case '$dim':
						self.xStat[node].isOn = (v == 1);
						self.checkFeedbacks(self.xStat[node].fbID);
						break;
					default:
						if ( node.match(/\$solo/)
						|| node.match(/^\/cfg\/talk\//)
						|| node.match(/^\/\$stat\/solo/) ) {
							self.xStat[node].isOn = (v == 1);
							self.checkFeedbacks(self.xStat[node].fbID);
						}
					}
					self.xStat[node].valid = true;
					self.varCounter += 1;
					if (self.needStats) {
						self.pollStats();
					}
				} else if (leaf == '*') {
					// /?~~,s~~WING,192.168.1.71,PGM,ngc‐full,NO_SERIAL,1.07.2‐40‐g1b1b292b:develop~~~~
					var mixer_info = args[0].value.split(',');
					self.myMixer.ip = mixer_info[1]
					self.myMixer.name = mixer_info[2];
					self.myMixer.model = mixer_info[3];
					self.myMixer.serial = mixer_info[4];
					self.myMixer.fw = mixer_info[5];
					if ('WING_EMU' == mixer_info[4]) {
						self.PollTimeout = 3200;
						self.PollCount = 7;
					}
					self.setVariableValues({
						'm_ip':	self.myMixer.ip,
						'm_name': self.myMixer.name,
						'm_model': self.myMixer.model,
						'm_serial': self.myMixer.serial,
						'm_fw': self.myMixer.fw
					});
				}
			});

			self.oscPort.on('ready', function() {
				self.updateStatus(InstanceStatus.Ok);

				self.log('info', `Sync Started (${self.PollCount}/${self.PollTimeout})`);
				self.firstPoll();
				self.heartbeat = setInterval( function () { self.pulse(); }, 9000);
				self.blinker = setInterval( function() { self.blink(); }, 1000);
				self.fader = setInterval( function() { self.doFades(); }, 1000 / self.fadeResolution);
			});

			self.oscPort.on('close', function() {
				self.updateStatus(InstanceStatus.Disconnected);

				if (self.heartbeat) {
					clearInterval(self.heartbeat);
					delete self.heartbeat;
				}
				if (self.blinker) {
					clearInterval(self.blinker);
					delete self.blinker;
				}
				if (self.fader) {
					clearInterval(self.fader);
					delete self.fader;
				}
			});

			self.oscPort.on('error', function(err) {
				self.log('error', "Error: " + err.message);
				self.updateStatus(InstanceStatus.ConnectionFailure, err.message);

				if (self.heartbeat) {
					clearInterval(self.heartbeat);
					delete self.heartbeat;
				}
				if (self.blinker) {
					clearInterval(self.blinker);
					delete self.blinker;
				}
				if (self.fader) {
					clearInterval(self.fader);
					delete self.fader;
				}
			});

			self.oscPort.open();
		}
	}

	sendOSC(node, arg, echo=false) {
		var self = this;

		if (self.oscPort) {
			self.oscPort.send({
				address: node,
				args: arg
			});
			if(echo) {
				self.oscPort.send({
					address: node,
					args: []
				});
			}
		}
	}

	sendUDP(data) {
		var self = this;
		var bytes = Buffer.from(data, 'hex');

		if (self.udpPort) {
			self.udpPort.send(data);
		}
	}

	build_choices() {
		var self = this;
		var strips;

		// discreet float values for faders (1540)
		for (var i = 0; i < self.FADER_STEPS; i++) {
			self.fLevels[self.FADER_STEPS][i] = self.stepsToFader(i,self.FADER_STEPS);
		}

		self.STORE_LOCATION = [];

		for (var i = 1; i <=10; i++) {
			var i2 = ('0' + i.toString()).slice(-2);

			self.STORE_LOCATION.push( {
				label: `Global ${i}`,
				id: `gs_${i2}`
			})
		}

		self.CHOICES_ON_OFF = [
			{id: '1', label: 'On'},
			{id: '0', label: 'Off'},
			{id: '2', label: 'Toggle'}
		]

		strips = {
			type:     'dropdown',
			label:    'Strip',
			id:       'strip',
			choices:  [	],
			default:  ''
		};

		self.CHOICES_STRIP = {};

		for (var d in stripDef) {
			var s = stripDef[d];
			self.CHOICES_STRIP[d] = [];
			for (var i = s.min; i <= s.max; i++) {
				self.CHOICES_STRIP[d].push( {
					id: '/' + s.id + '/' + i,
					label: s.label + ' ' + i
				});
			}
		}

		for (var d in stripDef) {
			var s = stripDef[d];
			for (var i=s.min; i <= s.max; i++) {
				if (s.act == 'baseActions') {
					strips.choices.push( {
						id: '/' + s.id + '/' + i,
						label: s.label + ' ' + i
					});
				}
			}
		}

		strips.default = strips.choices[0].id;

		self.OPTIONS_STRIP_BASE = { ...strips };

		strips.choices = [];
		for (var d in stripDef) {
			var s = stripDef[d];
			for (var i=s.min; i <= s.max; i++) {
				strips.choices.push( {
					id: '/' + s.id + '/' + i,
					label: s.label + ' ' + i
				});
			}
		}

		self.OPTIONS_STRIP_ALL = { ...strips };

		self.CHOICES_BUS = {};

		for (var b in busDef) {
			var bus = busDef[b];
			self.CHOICES_BUS[b] = [];
			for (var d in bus) {
				var s = stripDef[d];
				for (var i=1; i<=bus[d]; i++) {
					self.CHOICES_BUS[b].push( {
						id: '/' + s.sendID +  i,
						label: s.label + ' ' + i
					});
				}
			}
		}

		self.FADER_VALUES = [
			{ label: '- ∞',        id: '0.0' },
			{ label: '-50 dB: ',   id: '0.1251' },
			{ label: '-30 dB',     id: '0.251' },
			{ label: '-20 dB',     id: '0.375' },
			{ label: '-18 dB',     id: '0.4' },
			{ label: '-15 dB',     id: '0.437' },
			{ label: '-12 dB',     id: '0.475' },
			{ label: '-9 dB',      id: '0.525' },
			{ label: '-6 dB',      id: '0.6' },
			{ label: '-3 dB',      id: '0.675' },
			{ label: '-2 dB',      id: '0.7' },
			{ label: '-1 dB',      id: '0.725' },
			{ label: '0 dB',       id: '0.75' },
			{ label: '+1 dB',      id: '0.775' },
			{ label: '+2 dB',      id: '0.8' },
			{ label: '+3 dB',      id: '0.825' },
			{ label: '+4 dB',      id: '0.85' },
			{ label: '+5 dB',      id: '0.875' },
			{ label: '+6 dB',      id: '0.9' },
			{ label: '+9 dB',      id: '0.975' },
			{ label: '+10 dB',     id: '1.0' }
		];

		self.COLOR_VALUES = [
			{ label: 'Gray blue',	id: '1'},
			{ label: 'Medium blue',	id: '2'},
			{ label: 'Dark blue',	id: '3'},
			{ label: 'Turquoise',	id: '4'},
			{ label: 'Green',		id: '5'},
			{ label: 'Olive green',	id: '6'},
			{ label: 'Yellow',		id: '7'},
			{ label: 'Orange',		id: '8'},
			{ label: 'Red',			id: '9'},
			{ label: 'Coral',		id: '10'},
			{ label: 'Pink',		id: '11'},
			{ label: 'Mauve',		id: '12'}
		];

		self.TAPE_FUNCITONS = [
			{ label: 'STOP',                id: '0' },
			{ label: 'PLAY PAUSE',          id: '1' },
			{ label: 'PLAY',                id: '2' },
			{ label: 'RECORD PAUSE',        id: '3' },
			{ label: 'RECORD',              id: '4' },
			{ label: 'FAST FORWARD',        id: '5' },
			{ label: 'REWIND',              id: '6' }
		];
	}

	// calculate new fader/level float
	// returns a 'new' float value
	// or undefined for store or crossfade
	fadeTo(cmd, opt) {
		var stat = self.xStat[cmd]
		var node = cmd.split('/').pop();
		var opTicks = parseInt(opt.ticks);
		var steps = self.FADER_STEPS;
		var span = parseFloat(opt.duration);
		var oldVal = stat[node];
		var oldIdx = stat.idx;
		var byVal = opTicks * steps / 100;
		var newIdx = Math.min(steps-1,Math.max(0, oldIdx + Math.round(byVal)));
		var slot = opt.store == 'me' ? cmd : opt.store;
		var r, byVal, newIdx;

		switch (subAct) {
			case '_a':			// adjust +/- (pseudo %)
				byVal = opTicks * steps / 100;
				newIdx = Math.min(steps-1,Math.max(0, oldIdx + Math.round(byVal)));
				r = self.fLevels[steps][newIdx];
			break;
			case '_r':			// restore
				r = slot && self.tempStore[slot] !== undefined ? self.tempStore[slot] : -1;
			break;
			case '_s':			// store
				if (slot) {		// sanity check
					self.tempStore[slot] = stat[node];
				}
				r = undefined;
				// the 'store' actions are internal to this module only
				// r is left undefined since there is nothing to send
			break;
			default:			// set new value
				r = self.dbToFloat(opt.fad);
		}
		// set up cross fade?
		if (span>0 && r >= 0) {
			var xSteps = span / (1000 / self.fadeResolution);
			var xDelta = Math.floor((r - oldVal) / xSteps * 10000) / 10000;
			if (xDelta == 0) { // already there
				r = undefined;
			} else {
				self.crossFades[cmd] = {
					steps: xSteps,
					delta: xDelta,
					startVal: oldVal,
					finalVal: r,
					atStep: 1
				}
				// start the xfade
				r = oldVal + xDelta;
				needEcho = false;
			}
		}
		self.log('debug', `---------- ${oldIdx}:${oldVal} by ${byVal}(${opTicks}) fadeTo ${newIdx}:${r} ----------`);
		if (r !== undefined) {
			r = self.faderToDB(r)
		}
		return r;
	}

	// internal function for action (not anonymous)
	// self is properly scoped to next outer closure
	setToggle(cmd, opt) {
		return 2 == parseInt(opt) ? (1-(self.xStat[cmd].isOn ? 1 : 0)) : parseInt(opt);
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				tooltip: 'The IP of the WING console',
				width: 6,
				regex: Regex.IP,
			}
		]
	}

	updateActions() {
		UpdateActions(this)
	}
	
	updateFeedbacks() {
		UpdateFeedbacks(this)
	}
	
	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts);

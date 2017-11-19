// core.runtime.fools
var District = function () {
	function District(name) {
		var self = this;
		self.name = name;
		self.routes = new Map();
		self.add_message_handler = function add_message_handler(message_type, handler) {
			if (!self.routes.has(message_type)) {
				self.routes.set(message_type, []);
			}
			self.routes.get(message_type).push(handler);
		};
		self.send = function send(message) {
			var handlers = self.routes.get(message.constructor);
			if (!handlers) return;
			for (var idx in handlers) {
				handlers[idx](message);
			}
		};
	}
	District.static_fn = function () {
	};
	return District;
}();

function merge() {
	result = new Map();
	for (var idx in arguments) {
		for (var k in arguments[idx]) {
			result[k] = arguments[idx][k];
		}
	}
	return result;
};

var ProgramFlow = function () {
	function Invocation(args) {
		var self = this;
		self.args = args;
	};

	return {
		Invocation: Invocation
	};
}();

var Communications = function () {
	function Tell(message) {
		var self = this;
		self.message = message;
	};

	function TellBackChannel(message, level, source) {
		var self = this;
		self.message = message;
		self.level = level;
		self.source = source;
	};

	return {
		Tell: Tell,
		TellBackChannel: TellBackChannel,
	};
}();

var CommandLineUser = function (Communications, ProgramFlow) {
	var districts = {
		user: new District("user"),
	};

	function display_message(show) {
		console.log(show.message);
	}

	function create_initial_fools(city) {
		city.districts.user.add_message_handler(Communications.Tell, display_message);
	}

	return {
		districts: districts,
		bind: create_initial_fools,
	};
}(Communications, ProgramFlow);

var HelloWorld = function (Communications, ProgramFlow) {
	var _city;
	function go() {
		_city.districts.user.send(new Communications.Tell("hello, world"));
	};

	function create_initial_fools(city) {
		_city = city;
		city.districts.user.add_message_handler(ProgramFlow.Invocation, go);
	}

	return {
		districts: {},
		bind: create_initial_fools,
	};
}(Communications, ProgramFlow);

var city = { districts: merge(CommandLineUser.districts, HelloWorld.districts) };
CommandLineUser.bind(city);
HelloWorld.bind(city);

city.districts.user.send(new ProgramFlow.Invocation([]));

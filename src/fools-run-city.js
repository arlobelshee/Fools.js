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
			for (idx in handlers) {
				handlers[idx](message);
			}
		};
	}
	District.static_fn = function () {
	};
	return District;
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

var CommandLineProgram = function (Communications) {
	var districts = {
		user: new District("user"),
	};

	function display_message(show) {
		console.log(show.message);
	}

	function init_city(city) {
		city.districts.user.add_message_handler(Communications.Tell, display_message);
	}

	return {
		districts: districts,
		init: init_city,
	};
}(Communications);

var districts = CommandLineProgram.districts;

var starting_points = function init_module(Communications, districts) {
	return [
		function go() {
			districts.user.send(new Communications.Tell("hello, world"));
		},
	];
}(Communications, districts);

CommandLineProgram.init({ districts: districts });
for (idx in starting_points) {
	starting_points[idx]();
}


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

var districts = {
	user: new District("user"),
};

function Show(message) {
		var self = this;
		self.message = message;
};

function display_message(show) {
	console.log(show.message);
}

districts.user.add_message_handler(Show, display_message);

districts.user.send(new Show("hello, world"));

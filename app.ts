interface Window { peer: any; conn: any; }
declare var $, Peer;

window.onload = () => {
	// window.peer = new Peer({ key: 'q4mb7wppdhg2e29' });

	// window.peer.on('open', function(id) {
	// 	console.log("Opened with ID " + id);
	// });

	// window.peer.on('connection', function(conn) {
	// 	window.conn = conn;
	// 	window.conn.on('open', function() {
	// 		console.log("Client connected");
	// 	});
	// 	window.conn.on('data', function(data) {
	// 		console.log('Received', data);
	// 	});
	// });

	var game = new GameModule.Game();
};

function connectTo(id, data) {
	var peer = new Peer({ key: 'q4mb7wppdhg2e29' });
	var conn = peer.connect(id);
	conn.on('open', function() {
		console.log("Connected to host");
		console.log("Sending...");
		window.conn.send(data);
	});
}
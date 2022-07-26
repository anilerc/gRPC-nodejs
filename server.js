const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader"); // automatically load to compiled protofiles

const packageDefinition = protoLoader.loadSync("chat.proto", {}); // get the package definition
const grpcObject = grpc.loadPackageDefinition(packageDefinition); // get the object from package definition
const { chat } = grpcObject; // get the package from the object

const server = new grpc.Server(); // instantiate server from grpc.Server();
server.bind("localhost:3001", grpc.ServerCredentials.createInsecure()); // createSsl can be used for secure.

server.addService(chat.SimpleService.service, {
  // register the service you want to implement from the protobuf package you want.
  simpleCommunication: simpleCommunication,
  streamFromServer: streamFromServer,
});

server.start();

function simpleCommunication(call, callback) {
  // call is the whole TCP connection between server and client.
  // we can get the data sent using client.request
  // callback defines what to return back.
  callback(null, { text: "Greetings from server!" });
}
// the data sent back should be in accordance with the proto definitions.

function streamFromServer(call, callback) {
  for (let i = 0; i < 10; i++) {
    call.write({ text: i + "" });
  }
  call.end();
}

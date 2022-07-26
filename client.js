const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("chat.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const { chat } = grpcObject;

// same until now

// in order to connect the client, instantiate a new object using the service provided

const client = new chat.SimpleService(
  "localhost:3001",
  grpc.credentials.createInsecure()
); // NOT server credential but client credential

// now free to call methods:

client.simpleCommunication(null, (err, response) => {
  if (err) {
    console.log("ERROR! Veri gelemedi!");
  }

  console.log("Received from server " + JSON.stringify(response));
});

/* call returns the whole TCP connection. call.on("data") means every time a data is transferred from the server
 stream. */

const call = client.streamFromServer();
call.on("data", (item) => {
  console.log("Received item: ", JSON.stringify(item));
});

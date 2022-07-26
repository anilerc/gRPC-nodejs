const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader"); // compile edilen protobuffer dosyalarını otomatik yüklemek için

const packageDefinition = protoLoader.loadSync("chat.proto", {}); // protoloader üstünden paket tanımını yükle
const grpcObject = grpc.loadPackageDefinition(packageDefinition); // paket tanımını yükleyip objeyi elde et
const { chat } = grpcObject; // grpc objesi üstünden pakedi al.

// şimdiye kadarki kurulum kısmı client için aynı: kullanacağımız proto dosyasını protoloader üzerinden elde edeceğiz yine. fakat şimdi biz server kurmayacağız; bunun yerine servera bağlanacağız.

// clientı bağlamak için paketimizin servisi üstünden yeni bir obje oluştururuz.

const client = new chat.SimpleService(
  "localhost:3001",
  grpc.credentials.createInsecure()
); // server credential değil, client credential üstünden

// artık client üstünden metotlarımızı çağırabiliriz:

client.simpleCommunication(null, (err, response) => {
  if (err) {
    console.log("ERROR! Veri gelemedi!");
  }

  console.log("Received from server " + JSON.stringify(response));
});

const call = client.streamFromServer();
call.on("data", (item) => {
  console.log("Received item: ", JSON.stringify(item));
});

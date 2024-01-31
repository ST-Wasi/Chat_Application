const { Server } = require("socket.io");

function startSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  console.log('Socket Connected');
  io.on('connection',(socket)=>{
    console.log(socket.id);
  })
}

module.exports = startSocket;


// USers --> can do Login --- > can do signup --> Can add any person in DM with username ---> Can chat with multiple person --> can send Photos and Videos --> jab offline ho to vo users dikhne chahiye jo users se usne baat ki or jo chat usne ki 

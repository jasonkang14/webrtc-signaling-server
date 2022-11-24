const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const port = 8000
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin : 'http://localhost:3000'
    }
})

const offerMap = new Map();  

io.on('connection', (socket) => {
    console.log("socket connected: ", socket.id);
    socket.on('join', ({roomId}) => {
        socket.join(roomId);
        const prevOffer = offerMap.get(roomId);
        socket.emit('remote-offer', {offer: prevOffer});
    })
    
    socket.on('new-offer', ({offer, roomId}) => {
        offerMap.set(roomId, offer);
    })

    socket.on('new-answer', ({answer, roomId}) => {
        socket.to(roomId).emit('remote-answer', {answer})
    })

    socket.on('new-ice', ({iceCandidates, roomId}) => {
        socket.to(roomId).emit('remote-ice', {iceCandidates})
    })

})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
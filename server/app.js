//server for handling socket connections
let port = process.env.PORT
if (port == null || port == "") {
    port = 8000;
  }
const io = require('socket.io')(port,"0.0.0.0",{cors:{origin:"*"}})

const user = {};
var people = [];
var socketIdx= [];
var prevMsg = [];
//io.on=>will help to listen multiple connections 
//socket.on => will help to interact through a specific socket
io.on('connection',socket=>{

    //event notifying for joining of new user
    socket.on('new-user-joined',name=>{
        
        user[socket.id] = name;
        socketIdx.push(socket.id);
        people.push(name)
        console.log(user);

        socket.broadcast.emit('user-joined',name);
        io.to(socket.id).emit('updatePeople',people);
        var i;
        for(i=0;i<prevMsg.length;i++)
        {
            io.to(socket.id).emit('receive',prevMsg[i]);
        }
    });

    //event notifying for sending message
    socket.on('send',message => {
        console.log(message);
        message.name = user[socket.id];
        
        var peoples = message.people.split(',');
        console.log(peoples.length,typeof(peoples.length),peoples);
        if(peoples[0].length==0)
        {
            console.log('broadcast');
            socket.broadcast.emit('receive',message);
            prevMsg.push(message);
        }
        else
        {
            var i;
            for(i=0;i<peoples.length;i++)
            {
            
                io.to(socketIdx[parseInt(peoples[i])]).emit('receive',message);
            }
        }
        

        
    });
    //EVENT 
    socket.on('disconnect',message => {

        socket.broadcast.emit('left',user[socket.id]);
        delete user[socket.id];
    });

    
})
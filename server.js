const express = require('express')
const socketio = require('socket.io')
const mongoose = require('mongoose');
const userSchema = require('./schema/User');
const privMSchema = require('./schema/Private');
const groupMSchema = require('./schema/Group');

// see if we already register

const DB_CONNECTION = '';
mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
    console.log('Successful Mongodb connection');
}).catch(err => {
    console.log('Error on Mongodb connection');
});


const app = express()
const SERVER_PORT = 3000
const server = app.listen(SERVER_PORT, () =>{
    console.log('Chat Server running on http://localhost:3000/')
})
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//login
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/login.html')
})

app.post("/login", async(req,res) => {
    try {
        const { username, password } = req.body;
        
        const found = await userSchema.findOne({
            username: username,
            password: password,
        });

        if (found) {
            // go to chat room if they have log in
            res.sendFile(__dirname + '/views/chat.html')
    
        } else {
            res.status(401).send("that username doesnt exist ");
        }
    } catch (error) {
        res.status(500).send("couldnt log in " + error.message);
    }
});

//signup 
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + '/views/signup.html')
})
//post for signup
app.post("/signup", async(req, res) => {
    const user = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
    };
    try{
    console.log("got the data to sign up")
    const newUser = await userSchema.create(user);
    console.log(newUser);
    // go to login if they succesfully sign up 
    res.sendFile(__dirname + '/views/login.html')
    }catch(error){
        console.error("error :", error);
        res.status(500).send('error signup');
    }
})

app.get("/group", (req, res) => {
    res.sendFile(__dirname + '/views/group_chat.html')
})


const io = socketio(server)

io.on('connection', (socket) => {
    console.log(`New Socket: ${socket.id}`)

 
    socket.on('message', (data)=>{
        console.log(`Message from ${socket.username || socket.id}: ${data}`)
    })

    socket.on('disconnect', ()=> {
        console.log(`User disconnect ${socket.id}`)
    })

    socket.on('chat_message', (data) => {
        data.clientId = socket.id
        console.log(JSON.stringify(data))
        io.emit('chat_message', data)
    })
    socket.on('join_group', (roomName) => {
        console.log(`User ${socket.id} joined room ${roomName}`)
        socket.join(roomName)
    })
    socket.on('leave_group', (roomName) => {
        socket.leave(roomName)
    })
    socket.on('group_message', (data) => {
        console.log(`User ${socket.id} sent message to room ${data.group}`)
        data.clientId = socket.id
        io.to(data.group).emit('group_message', data)
    })
})
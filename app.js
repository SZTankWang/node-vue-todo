const express = require("express");
const cors = require("cors");

const {MongoClient} = require("mongodb");
const {
    checkUserExist,
    createUser,
    getToDo,
    addToDo,
    removeToDo
    } = require('./user');



function cleanUp(client){
    // console.log("disconnect database...")
    client.close().
    then(()=>{
        console.log("database disconnected")
        process.exit(0);
            }).
    catch(()=>console.log("error closing"));
}
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

// connect to mongodb
const uri = "mongodb+srv://zhenmingwang:sfls2012101@cluster0.mgy0es3.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);





app.post("/login",(req,res)=>{
    //username
    // console.log(req.body);
    let username = req.body.username;


    //does this exist? 
    client.connect()
    .then((resolve)=>{
        return checkUserExist(client,username);

    })
    .then((resolve)=>{
        console.log("exist",resolve);
        if(resolve){
            //retrieve list of todos
            return Promise.resolve(1);
        }else{
            //create user
            // res.send("0");
            return createUser(client,username);

        }
    })
    .then((resolve)=>{
        // client.close();
        console.log("user creation result:",resolve);
        //handle error
        if(resolve==false){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
        // res.send(resolve);
        client.close();
    });


})

app.post("/addToDo",(req,res)=>{
    let taskName = req.body.task;
    let username = req.body.user;
    client.connect()
    .then((resolve)=>{
        let result = addToDo(client,taskName,username);
        result.then((resolve)=>{
            console.log("insertion result:",resolve);
            if(resolve){
                res.status(200);
            }
            else{
                res.status(500);
            }
            res.send(resolve);
            client.close().then(()=>console.log("disconnected db"));
        })
    
    });
})

app.get("/getToDo",(req,res)=>{
    let username = req.query.name;
    client.connect()
    .then((res)=>{
        //getToDo
        return getToDo(client,username);
    })
    .then((resolve)=>{
        console.log("query result:",resolve);
        if(resolve.length==0){
            res.status(404);
        }
        else{
            res.status(200);
        }
        res.send(resolve);
        client.close();
    })

})

app.post("/removeToDo",(req,res)=>{
    client.connect()
    .then((resolve)=>{
        return removeToDo(client,req.body.task,req.body.name);
    })
    .then((resolve)=>{
        console.log("deletion:",resolve);
        client.close();
        if(resolve=="success"){
            res.status(200);

        }else{
            res.status(500);
        }
        res.send(resolve);
    })
})

  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

process.on("SIGINT",()=>{cleanUp(client)});
process.on("exit",()=>{cleanUp(client)});
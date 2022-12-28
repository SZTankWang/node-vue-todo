 function createUser(){
    //add a new user to mongoDB
}


async function checkUserExist(client,username){
    
    let db = client.db("vue-users");
    let collection = db.collection("my-collection");
    console.log("querying db",username);
    const count = await collection.countDocuments({name:username});
    if(count == 0){
        return 0;
    }
    else{
        return 1;
    }

};

async function createUser(client,username){
    let db = client.db("vue-users");
    let collection = db.collection("my-collection");
    console.log("creating user",username);
    const result = await collection.insertOne({name:username});
    if(result.acknowledged){
        console.log("inserted user, id is",result.insertedId);
    
        return result.insertedId;
    }
    else{
        return false;
    }
}

async function getToDo(client,username){
    let db = client.db("vue-users");
    let collection = db.collection("todos");
    console.log("querying todo for",username);
    const cursor =  collection.find({name:username,done:{$eq:false}});
    let result = [];
    await cursor.forEach((doc)=>{
        result.push(doc);
    })
    return result;
}

async function addToDo(client,task,username){
    let db = client.db("vue-users");
    let collection = db.collection("todos");
    let doc = {
        task:task,
        name:username,
        done:false
    }
    let result = await collection.insertOne(doc);
    if(result.acknowledged){
        return result.insertedId;
    }
    else{
        return false;
    }
}

async function removeToDo(client,task,username){
    let db = client.db("vue-users");
    let collection = db.collection("todos");
    let query = {
        task:task,
        name:username
    };
    let result = await collection.deleteOne(query);
    if(result.acknowledged){
        console.log("deletion count:",result.deletedCount);
        if(result.deletedCount == 1){
            return "success"
        }
        else{
            return "error"
        }
    
    }
    else{
        console.log("deletion not acknowledged");
    }
}

module.exports = {checkUserExist,createUser,getToDo,addToDo,removeToDo};
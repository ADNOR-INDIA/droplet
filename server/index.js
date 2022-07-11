const express = require('express')
const {MongoClient} = require('mongodb')
const {v4:uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const uri = process.env.URI


// we are calling express naming it app, to use app the features of express.
const app = express()

app.use(cors({origin:'*'}))
app.use(express.json())

const PORT = 5000
// using the method get, used for getting server /database from server. 
app.get('/', (req, res)=>{
    // .json() is helping to send the response to localhost:5000/
    res.json('hello!')
})

// this will be pos request as we sending/posting data to our database
app.post('/signup', async(req, res)=>{
    // res.json('sending data to database')
    // 
    const client = new MongoClient(uri)
    //console.log(req.body)
    // we made a post request in authmodal in client and took here to write in db.
    const {email, password} = req.body


//  for generating a unique id.
    const generatedId = uuidv4()
    // hashing the password
    const hashedpassword = await bcrypt.hash(password, 10)

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({email})
        if(existingUser){
            return res.status(409).send('user with this email already exist')
        } 

        const sanitizedEmail = email.toLowerCase()
        const data ={
            // lhs should be same modal as we wrote in our database
            user_id: generatedId,
            email: sanitizedEmail,
            hashed_password : hashedpassword
        }
        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {expiresIn:60*24})
        res.status(201).json({token, userId:generatedId})
    }
    catch(error){
        console.log(error)
    }
})

app.post('/login', async(req, res)=>{
    const client = new MongoClient(uri)
    const {email, password} = req.body
    
    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({email})
        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if(user&&correctPassword){
            const token = jwt.sign(user, email, {
                expiresIn:60*24
            })
            res.status(201).json({token, userId:user.user_id})
        }
        res.status(400).send('Invalid Credentials')
    }
    catch(error){
        console.log(error)
    }
})

// getting a user data from database for chat-container in dashboard purpose.
app.get('/user', async(req, res)=>{
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id:userId}
        const user = await users.findOne(query)
        res.send(user)
    }
    finally{
        await client.close()
    }
})

// update a user with a match
app.put('/addmatch', async(req, res)=>{
    const client = new MongoClient(uri)
    const {userId, matchedUserId} = req.body

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id:userId}
        const updateDocument = {
            $push:{matches:{user_id:matchedUserId}}
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    }
    finally{
        await client.close()
    }
})

//sample just to check whether we were able to fetch users from db or not.
app.get('/users', async(req, res)=>{
    const client = new MongoClient(uri)
    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    }
    finally{
        await client.close()
    }
})
//get all users by userIds in the db
// app.get('/users', async(req, res)=>{
//     const client = new MongoClient(uri)
//     const userIds = JSON.parse(req.query.userIds)
//     console.log("these are user ids "+userIds)

//     try{
//         await client.connect()
//         const database = client.db('app-data')
//         const users = database.collection('users')

//         const pipeline=
//         [
//             {
//                 '$match':{
//                     'user_id':{
//                         '$in':userIds
//                     }
//                 }
//             }
//         ]
//         const foundUsers = await users.aggregate(pipeline).toArray()
//         console.log("found users " +foundUsers)
//         res.send(foundUsers)
//     }
//     finally{
//         await client.close()
//     }
// })

// getting the users from db on the basis of gender
app.get('/gendered-users', async(req, res)=>{
    const client = new MongoClient(uri)
    const gender = req.query.gender

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {gender_identity:{$eq:gender}}
        const foundUsers = await users.find(query).toArray()

        res.json(foundUsers)
    }
    finally{
        await client.close()
    }
})

// updating info in the databse of a user once it has created the account(info of onboarding page)
app.put('/user', async(req,res)=>{
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id:formData.user_id}
        const updateDocument = {
            $set:{
                first_name:formData.first_name,
                last_name:formData.last_name,
                dob_day:formData.dob_day,
                dob_month:formData.dob_month,
                dob_year:formData.dob_year,
                show_gender:formData.show_gender,
                gender_identity:formData.gender_identity,
                gender_interest:formData.gender_interest,
                url:formData.url,
                about:formData.about,
                matches:formData.matches
            },
        }
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    }
    finally{
        await client.close()
    }

})

app.post('/message', async(req,res)=>{
    const client = new MongoClient(uri)
    const message = reqbody.message

    try{
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')
        const insertedMessage= await message.insertOne(message)
        res.send(insertedMessage)
    }
    finally{
        await client.close()
    }
})

app.get('/messages', async(req, res)=>{
    const client = new MongoClient(uri)
    const {userId, correspondingUserId} = req.query
    console.log(userId, correspondingUserId)

    try{

        const database = client.db('app-data')
        const messages = database.collection('messages')

    const query = {
        from_userId: userId, to_userId:correspondingUserId
    }
    const foundMessages = await messages.find(query).toArray()
    res.send(foundMessages)
    }
    finally{
        await client.close()
    }

})

//using the method listen to listen to the port
app.listen(PORT, ()=>console.log('Server running on PORT:'+ PORT))
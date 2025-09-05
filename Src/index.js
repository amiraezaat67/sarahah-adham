import 'dotenv/config';
import express from "express";
import crypto from "crypto";
/** @commet : see the clean up video to re-construct the project structure due to the scalability of the project */
import userRouter from "./Modules/Users/user.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import dbconnection from "./DB/db.connection.js";
import { RoleEnum } from "./Common/enums/user.enum.js";
/** @commet : write comments before each block of code to explain what it does */
const app = express();

// parse request body to json
app.use(express.json());

// connect to database
dbconnection();

// Handle controllers
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// Global error handling middleware
app.use(async (err,req, res,next) => {
    console.log(err.stack);
    // abort transaction if exists
    if(req.session && req.session.inTransaction()){
        await req.session.abortTransaction()
        req.session.endSession()
        console.log(`The transaction is aborted`);
    }
    res.status(err.cause || 500).json({ message: "Somthing Broke!!!",error:err.message,stack:err.stack });
});

// Handle not found routes
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

// listen to port
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});

/** @commet : remove all logs before commiting except the descriptive logs like server running , db connected */
console.log(Buffer.from(crypto.randomBytes(16)),'utf-8');
console.log(RoleEnum);


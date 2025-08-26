import 'dotenv/config';
import express from "express";
import userRouter from "./Modules/Users/user.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import dbconnection from "./DB/db.connection.js";
import crypto from "crypto";
import { RoleEnum } from "./Common/enums/user.enum.js";
const app = express();

app.use(express.json());
dbconnection();


app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);


app.use(async (err,req, res,next) => {
    console.log(err.stack);
    if(req.session && req.session.inTransaction()){
        await req.session.abortTransaction()
        req.session.endSession()
        console.log(`The transaction is aborted`);
    }
    res.status(err.cause || 500).json({ message: "Somthing Broke!!!",error:err.message,stack:err.stack });
});

app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});

console.log(Buffer.from(crypto.randomBytes(16)),'utf-8');

console.log(RoleEnum);


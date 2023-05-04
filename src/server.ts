import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';
import { dbConnect } from './config/db.config';
//router path
import foodsRouter from './router/foods.router'
import usersRouter from './router/users.router'
import orderRouter from './router/order.router'
//seed router path to create bunch of data inside cluster
import foodSeedRouter from './seed/food.seed'
import userSeedRouter from './seed/user.seed'

const app = express();

//port
const PORT = 5000 || process.env.PORT;
const HOST = 'localhost' || process.env.HOST;
//middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));
//router api
app.use('/api/foods',foodsRouter);
app.use('/api/users',usersRouter);
app.use('/api/orders',orderRouter);
//seed
app.use('/api/seed',foodSeedRouter);
app.use('/api/seed',userSeedRouter);


//connect to db
dbConnect();
//running server 
app.listen(PORT,HOST,() => {
    console.log(`server running succesfully on: http://${HOST}:${PORT}`);
});
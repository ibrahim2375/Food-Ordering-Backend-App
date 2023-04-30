
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'
//data
import { sample_foods, sample_tags, sample_users } from './data';

const app = express();

//port
const PORT = 5000 || process.env.PORT;
const HOST = 'localhost' || process.env.HOST;
//middlewares
app.use(express.json())
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));
//!:-------------------------------------------------foods----------------------------------------------------
// get all foods data
app.get('/api/foods',(req, res) => {
    res.send(sample_foods);
})
// get  foods by id 
app.get('/api/food/:id',(req, res) => {
    const id = req.params.id;
    const food = sample_foods.find(food => food.id === id);
    res.send(food);
})
// get  foods data by search
app.get('/api/foods/search/:query',(req, res) => {
    const query = req.params.query;
    const foods_results = sample_foods.filter(food => food.name.toLowerCase().includes(query.toLowerCase()));
    res.send(foods_results);
})
// get all tags data
app.get('/api/foods/tags',(req, res) => {
    res.send(sample_tags);
})
// get all foods by tags data
app.get('/api/foods/tag/:tag',(req, res) => {
    const tag = req.params.tag;
    const foods_by_tag = sample_foods.filter(food => food.tags.includes(tag));
    res.send(foods_by_tag);
})
//!:------------------------------------------------------users-----------------------------------------------
// login method
app.post('/api/users/login',(req, res) => {
    const {email, password} = req.body;
    let user = sample_users.find(user => user.email == email && user.password == password);
    //generate token
    if(user) {
        const token = jwt.sign({email: email, isAdmin:user.isAdmin},"76298rhyuoefeyou873yl8r873bbyryn93",{expiresIn:"10d"});
        user.token = token;
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send({error:"password or email not vaild"});
    }
})
app.listen(PORT,HOST,() => {
    console.log(`server running succesfully on: http://${HOST}:${PORT}`);
});
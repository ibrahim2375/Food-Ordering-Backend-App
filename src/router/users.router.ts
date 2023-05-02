import { Router } from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import AsyncHandler from 'express-async-handler'
import { UserModel } from '../models/user.model';
const router = Router();

// login method
router.post('/login',AsyncHandler(
    async (req, res) => {
        const {email, password} = req.body;
        await UserModel.findOne({ email}).then( async (user) => {
            //decript password after find user
            if(user){
                await bcrypt.compare(password,user.password).then(checked => {
                    //check password
                    if (!checked) { return res.status(400).send("incorrect password") }
                    //if its ok create token
                    const token = jwt.sign({email: email, isAdmin:user.isAdmin},process.env.SECRET_JWT!,{expiresIn:"10d"});
                    // user.token = token;
                   //generate data
                    const userData = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        address: user.address,
                        isAdmin: user.isAdmin,
                        token: token
                    };
                    return res.status(200).send(userData);
                })
            }else {
                //if somthing wrong with password or user
                res.status(404).send("Username or password is invalid!");
            }
        }).catch(error => {
                return res.status(500).send("user not founded");
        })
    }
))

router.post('/register', AsyncHandler(
    async (req, res) => {
        const {name,email, password,address} = req.body;
        // check if user already exists or not 
        await UserModel.findOne({email}).then(async (user) => {
            if(user) return res.status(404).send('this user already exists');
            if(!user){
                // check if there is a password 
                if (password) {
                //  encript this password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    //create new user
                    const user = new UserModel({
                        name,
                        email,
                        password: hashedPassword,
                        address,
                        isAdmin:false
                    })
                    user.save().then(async(result) => {
                        // const {} = result;
                        res.status(201).send(result);
                    }).catch((error) => {
                        return res.status(500).send(error);
                    })
                }
            }
        })
    }
))

export default router;
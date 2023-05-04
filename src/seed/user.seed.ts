import { Router } from 'express';
import AsyncHandler from 'express-async-handler';
import { sample_users } from '../data';
import { UserModel } from '../models/user.model';

const router = Router();
//seed data to cluster 
router.get('/users', AsyncHandler(
    async (req, res) => {
        const foodCount = await UserModel.countDocuments();
        if(foodCount > 0) {
            res.send('user seed already done!');
            return;
        }
        await UserModel.create(sample_users);
        res.send('User Seed Done!');
    }
))

//delete data to cluster 
router.get('/users/delete-all', AsyncHandler(
    async (req, res) => {
        await UserModel.deleteMany();
        res.send('Users deleted Done!');
    }
))
export default router;
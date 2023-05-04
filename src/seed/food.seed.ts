import { Router } from 'express';
import AsyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';
import { sample_foods } from '../data';

const router = Router();
//seed data to cluster 
router.get('/foods', AsyncHandler(
    async (req, res) => {
        const foodCount = await FoodModel.countDocuments();
        if (foodCount > 0) {
            res.send('food seed already done!');
            return;
        }
        await FoodModel.create(sample_foods);
        res.send('Food Seed Done!');
    }
))

//delete data to cluster 
router.get('/foods/delete-all', AsyncHandler(
    async (req, res) => {
        await FoodModel.deleteMany();
        res.send('Food deleted Done!');
    }
))

export default router;
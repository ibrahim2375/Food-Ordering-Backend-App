import { Router } from 'express';
import AsyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';
const router = Router();

// get all foods data
router.get('/', AsyncHandler(
    async (req, res) => {
        await FoodModel.find().then(foods => {
            if (!foods) return res.status(200).send({ messaage: "no products founded" });
            return res.status(200).send(foods);
        }).catch(error => {
            return res.status(404).send(error);
        })
}))

// get  foods data by search
router.get('/search/:query',AsyncHandler(
    async (req, res) => {
        const query = req.params.query;
        const queryRegex = new RegExp(query,'i');
        await FoodModel.find({name:{$regex:queryRegex}}).then((result) => {
                if (!result) {
                    return res.status(403).send({ message: 'somthing wrong' });
                }
                return res.status(200).send(result);
            }).catch((error) => {
                return res.status(403).send(error);
            });
    }
))
// get all tags data
router.get('/tags', AsyncHandler(
    async (req, res) => {
    const tags = await FoodModel.aggregate([
    {
        $unwind:'$tags'
    },
    {
        $group:{
        _id: '$tags',
        count: {$sum: 1}
        }
    },
    {
        $project:{
        _id: 0,
        name:'$_id',
        count: '$count'
        }
    }
    ]).sort({count: -1});

    const all = {
    name : 'All',
    count: await FoodModel.countDocuments()
    }
    tags.unshift(all);
    res.status(200).send(tags);
    }
))
// get all foods by tags data
router.get('/tag/:tag',AsyncHandler(
    async (req, res) => {
        const tag = req.params.tag;
        FoodModel.find({tags:tag}).then((food) => {
                if (!food) {
                    return res.status(403).send({ message: 'somthing wrong' });
                }
                return res.status(200).send(food);
            }).catch((error) => {
                return res.status(403).send(error);
            });
    }
))
    

// get  foods by id 
router.get('/:id',AsyncHandler( 
    async (req, res) => {
    const id = req.params.id;
    FoodModel.findById(id).then((food) => {
        if (!food) {
            return res.status(403).send({ message: 'somthing wrong' });
        }
            return res.status(200).send(food);
        }).catch((error) => {
            return res.status(403).send(error);
        });
    }
))
//get most viewd
router.get('/views/most', AsyncHandler( 
    async (req, res) => {
        await  FoodModel.find().sort({ views: -1 }).limit(20).then((result) => {
                if (!result) {
                    return res.status(403).send('somthing wrong');
                }
                //get most views
                return res.status(200).send(result);
            
        }).catch((error) => {
                return res.status(403).send(error);
        });
    }
));
//get latest foods
router.get('/latest/food', AsyncHandler( 
    async (req, res) => {
        await  FoodModel.find().sort({ createdAt: -1 }).limit(20).then((result) => {
                if (!result) {
                    return res.status(403).send('somthing wrong');
                }
                //get most views
                return res.status(200).send(result);
            
        }).catch((error) => {
                return res.status(403).send(error);
        });
    }
));
export default router;

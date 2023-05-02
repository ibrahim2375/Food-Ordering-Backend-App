import { Router } from 'express';
import AsyncHandler from 'express-async-handler';
import { OrderModel } from '../models/order.model';
import auth from '../middleware/auth';
const router = Router();

//user middleware to check user token

router.use(auth);

router.post('/create',
AsyncHandler(async (req:any, res:any) => {
    const requestOrder = req.body;

    if(requestOrder.items.length <= 0){
        res.status(404).send('Cart Is Empty!');
        return;
    }

    await OrderModel.deleteOne({
        user: req.user.id,
        status: 'new'
    });

    const newOrder = new OrderModel({...requestOrder,user: req.user.id});
    await newOrder.save();
    res.status(200).send(newOrder);
})
)

export default router;
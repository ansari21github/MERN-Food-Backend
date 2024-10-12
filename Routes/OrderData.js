// const express = require('express')
// const router = express.Router()
// const Order = require('../models/Orders')


// router.post('/orderData', async (req, res) => {
//     let data = req.body.order_data
//     await data.splice(0, 0, { order_date: req.body.order_data})
//     // if email not existing in db then create: else: InsertMany()
//     let eId = await Order.findOne({ 'email': req.body.email})
//     console.log(eId)
//     if (eId === null){
//         try {
//             await Order.create({
//                 email: req.body.email,
//                 order_data: [data]
//             }).then (() =>{
//                 res.json({ success: true})
//             })
//         } catch (error){
//             console.log(error.message)
//             // res.send("Server Error", error.message)
//             res.status("Server Error").send(error.message)
//         }
//     }
//     else{
//         try{
//             await Order.findOneAndUpdate({ email: req.body.email },
//                 {$push: { order_data: data } }).then(() => {
//                     res.json({success: true })
//                 })
//         }catch (error){
//             res.send("Server Error", error.message)
//         }
//     }
// })

// router.post('/myorderData', async (req, res) => {
//     try{
//         let myData = await Order.findOne({ 'email': req.body.email })
//         res.json({ orderData: myData})
//     } catch (error){
//         res.send("Server Error", error.message)
//     }
// })

// module.exports = router;
const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')

router.post('/orderData', async (req, res) => {
    try {
        let data = req.body.order_data;

        // Check if data is an array before using splice
        if (!Array.isArray(data)) {
            data = [data]; // If not an array, create a new array with a single element
        }

        data.splice(0, 0, { order_date: req.body.order_date });

        // Check if email exists in the database
        let eId = await Order.findOne({ 'email': req.body.email });

        if (eId === null) {
            // If email not existing in db then create
            await Order.create({
                email: req.body.email,
                order_data: data
            });

            res.json({ success: true });
        } else {
            // If email exists, use findOneAndUpdate to push data into order_data array
            await Order.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data: data } });

            res.json({ success: true });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});

router.post('/myorderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ 'email': req.body.email });
        res.json({ orderData: myData });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});

module.exports = router;

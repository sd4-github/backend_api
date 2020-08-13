const ProductModel = require('../model/product');
const mongodb = require('mongodb');
const CartModel = require('../model/cartModel');
const OrderModel = require('../model/orderModel');


exports.showProd = (req, res, next) => {

    ProductModel.find().sort({ pname: 1 })
        .then(showResult => {
            res.status(200).json({
                success: true,
                message: "product succesfully fetched",
                data: showResult
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                message: "fetch unsuccessfull!"
            })
        });

}

exports.searchProd = (req, res, next) => {
    const q = req.query.search;

    ProductModel.find({ pname: { $regex: q, $options: 'i'} }).sort({ pname: 1 })
        .then(searchResult => {
            if (q) {
                res.status(200).json({
                    success: true,
                    message: "search results",
                    data: searchResult,
                    sessiondata: req.session.userData
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "search unsuccessfull!"
            })
        });

}

exports.detailsProd = (req, res, next) => {
    const _id = req.params._id;

    ProductModel.findById(_id)
        .then(detailsResult => {
            console.log(detailsResult);
            res.status(200).json({
                success: true,
                message: "product details",
                data: detailsResult,
                sessiondata: req.session.userData
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                message: "search unsuccessfull!"
            })
        })

}

exports.showCart = (req, res, next) => {
    const user_id = req.session.userData._id;
    // console.log(user_id);

    CartModel.find({ user_id: user_id })
        .then(showcartresult => {
            console.log(showcartresult);
            res.status(200).json({
                success: true,
                message: "cart details",
                data: showcartresult,
                sessiondata: req.session.userData
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "cart fetch unsuccessfull!"
            })
        })

}


exports.addToCart = (req, res, next) => {
    const p_id = req.body._id;
    const quantity = req.body.quantity;
    const user_id = req.session.userData._id;

    ProductModel.findById(p_id)
        .then(result => {
            // console.log(result);
            const pname = result.pname;
            const pvalue = result.pvalue;
            const pimage = result.pimage

            CartModel.find({ user_id: user_id, p_id: p_id })
                //cartvalue is array
                .then(cartvalue => {
                    console.log(cartvalue);
                    if (cartvalue[0]!=null && p_id===cartvalue[0].p_id) {
                        cartvalue[0].quantity++;
                        cartvalue[0].save()
                            .then(addCartResult => {
                                console.log('product quantity updated to cart!')
                                res.status(200).json({
                                    success: true,
                                    message: "product quantity updated to cart!",
                                    data: addCartResult,
                                    sessiondata: req.session.userData
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json({
                                    success: false,
                                    message: "cart add unsuccessfull!"
                                })
                            })

                    } else {              
                    let cartproduct = cartvalue[0];
                    const Cart = new CartModel({ user_id: user_id, p_id: p_id, quantity: quantity, pname: pname, pvalue: pvalue, pimage: pimage })

                    Cart.save()
                        .then(addCartResult => {
                            console.log('product added to cart!')
                            res.status(200).json({
                                success: true,
                                message: "product added to cart!",
                                data: addCartResult,
                                sessiondata: req.session.userData
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json({
                                success: false,
                                message: "cart add unsuccessfull!"
                            })
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({
                        success: false,
                        message: "cart add unsuccessfull!"
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "cart add unsuccessfull!"
            })
        })

}

exports.updateCart = (req, res, next) => {
    const p_id = req.body.p_id;
    const quantity = req.body.quantity;
    const user_id = req.session.userData._id;

    CartModel.find({ user_id: user_id, p_id: p_id })
        //cartvalue is array
        .then(cartvalue => {
            console.log(cartvalue);
            let cartproduct = cartvalue[0];
            if (p_id == cartproduct.p_id) {
                cartproduct.quantity = quantity;
            }

            cartproduct.save()
                .then(updateResult => {
                    console.log('product updated to cart!');
                    res.status(200).json({
                        success: true,
                        message: "cart updated!",
                        data: updateResult,
                        sessiondata: req.session.userData
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({
                        success: false,
                        message: "cart update unsuccessfull!"
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "cart update unsuccessfull!"
            })
        })
}

exports.deleteCartProd = (req, res, next) => {
    const p_id = req.params.p_id;
    CartModel.deleteOne({ p_id: p_id })
        .then(deleteResult => {
            console.log(deleteResult);
            res.status(200).json({
                success: true,
                message: "cartproduct succesfully deleted",
                data: deleteResult
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "cartproduct delete unsuccessfull!"
            })
        })

}

exports.getCheckout = (req, res, next) => {

    const user_id = req.session.userData._id;

    CartModel.find({ user_id: user_id })
        .then(cartItem => {
            console.log('cartitems', cartItem);
            res.status(200).json({
                success: true,
                message: "cartitems!",
                data: cartItem,
                sessiondata: req.session.userData
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "checkout unsuccessfull!"
            })
        });

}

exports.postCheckout = (req, res, next) => {
    const user_id = req.session.userData._id;
    const name = req.body.name;
    const email = req.body.email;
    const mobilenum = req.body.mobilenum;
    const address = req.body.address;

    CartModel.find({ user_id: user_id })
        .then(cartproduct => {
            console.log(cartproduct);
            let total = 0;
            if (cartproduct[cartproduct.length - 1]) {

                for (var i = 0; i < cartproduct.length; i++) {                
                    let p = cartproduct[i].pvalue;
                    console.log(p);
                    let quan = cartproduct[i].quantity;
                    let mul = (p * quan);
                    total = total + mul;
                }
            }
            if (cartproduct != null) {
                const orderData = new OrderModel({ name: name, email: email, mobilenum: mobilenum, address: address, user_id: user_id, total: total, orderproduct: cartproduct })
                orderData.save()
                    .then(saveResult => {
                        console.log('order succesfull!', saveResult);  
                        res.status(200).json({
                            success: true,
                            message: "order succesfull!",
                            data: saveResult,
                            sessiondata: req.session.userData
                        })                    
                    })
                    .then(deleteResult => {
                        CartModel.deleteMany({ user_id: user_id })

                            .then(postDeleteResult => {
                                console.log('cart clear!', postDeleteResult)
                                    // res.redirect('/order');
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json({
                                    success: false,
                                    message: "order unsuccessfull!"
                                })
                            })

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({
                            success: false,
                            message: "order unsuccessfull!"
                        })
                    })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "order unsuccessfull!"
            })
        })
}

exports.order = (req, res, next) => {

    const user_id = req.session.userData._id;

    OrderModel.find({ user_id: user_id })
        .then(orderDetails => {
            console.log('orderdetails', orderDetails);
            res.status(200).json({
                success: true,
                message: "order succesfull!",
                data: orderDetails,
                sessiondata: req.session.userData
            })  
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "order unsuccessfull!"
            })
        });

}






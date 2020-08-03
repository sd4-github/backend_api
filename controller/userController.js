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

    ProductModel.find({ pname: q }).sort({ pname: 1 })
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
            res.render('user/cart', {
                prod: showcartresult,
                pageTitle: 'cart',
                path: '/addtocart',
                data: req.session.userData
            })
        })
        .catch(err => {
            console.log(err);
        })

}


exports.addToCart = (req, res, next) => {
    const p_id = req.body.p_id;
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
                    let cartproduct = cartvalue[0];
                    //insert item
                    // if (!cartvalue) {
                    const Cart = new CartModel({ user_id: user_id, p_id: p_id, quantity: quantity, pname: pname, pvalue: pvalue, pimage: pimage })

                    Cart.save()
                        .then(updateResult => {
                            console.log('product added to cart!')
                            res.redirect('/addtocart');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    // }
                    // else{
                    //     cartproduct.quantity=quantity;

                    //     //update item   
                    //     cartproduct.save()
                    //         .then(updateResult => {
                    //             console.log('product added to cart!')
                    //             res.redirect('/addtocart');
                    //         })
                    //         .catch(err => {
                    //             console.log(err);
                    //         })
                    // }


                })

                .catch(err => {
                    console.log(err)
                })

        })
        .catch(err => {
            console.log(err);
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
                    console.log('product updated to cart!')
                    res.redirect('/addtocart');
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err)
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
            res.render('user/checkout', {
                prod: cartItem,
                pageTitle: 'checkout',
                path: '/getcheckout',
                data: req.session.userData

            });
        })
        .catch(err => {
            console.log(err);
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
                    })
                    .then(deleteResult => {
                        CartModel.deleteMany({ user_id: user_id })

                            .then(postDeleteResult => {
                                console.log('cart clear!', postDeleteResult),
                                    res.redirect('/order');
                            })
                            .catch(err => {
                                console.log(err);
                            })

                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        })
        .catch(err => {
            console.log(err);
        })
}

exports.order = (req, res, next) => {

    const user_id = req.session.userData._id;

    OrderModel.find({ user_id: user_id })
        .then(orderDetails => {
            console.log('orderdetails', orderDetails);
            res.render('user/order', {
                prod: orderDetails,
                pageTitle: 'order',
                path: '/order',
                data: req.session.userData

            });
        })
        .catch(err => {
            console.log(err);
        });

}






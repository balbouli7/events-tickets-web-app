const express =require("express")
const { upload } = require("../config/cloudinary");
const { verifyToken } = require("../middlewares/authMiddleware")
const { authorizedRoles } = require("../middlewares/roleMiddleware")
const { getUserProfile, updateUserProfile, deleteUserAccount, getUserById } = require("../controllers/userControllers")
const { getAllUsers, deleteUser} = require("../controllers/adminControllers")
const { createEvent, updateEvent, deleteEvent, getAllEvents, getEventById } = require("../controllers/eventControllers")
const { createOrder, getUserOrders, getOrderById, getAllOrders, deleteOrder } = require("../controllers/orderControllers")
const { buyTicket, generateQRCode, getUserTickets } = require("../controllers/ticketControllers")
const { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById } = require("../controllers/categoryControllers")
const { initiatePayment, verifyPayment, refundPayment, stripeWebhook } = require("../controllers/paymentControllers")
const router=express.Router()
router.get('/admin',verifyToken,authorizedRoles("admin"),(req,res)=>{
    res.json("Hello admin")
})
router.get('/user',verifyToken,authorizedRoles("admin","user"),(req,res)=>{
    res.json("Hello user")
})
//user routes
router.get('/users/details/:id',verifyToken,getUserProfile );
router.get('/users/:id',getUserById);
router.put('/users/updateUser/:id',updateUserProfile );
router.delete('/users/deleteUser/:id',verifyToken,deleteUserAccount );
router.get('/events',getAllEvents)
router.post('/createOrder',verifyToken, createOrder) 
router.get('/userOrder',verifyToken,getUserOrders) 
router.get('/orders/:id',verifyToken, getOrderById) 
router.delete('/deleteOrders/:id',verifyToken, deleteOrder) 
router.post('/buyTicket',verifyToken, buyTicket)
router.get('/userTicket',verifyToken, getUserTickets) 
router.get('/qrcode/:id',verifyToken, generateQRCode) 
router.get('/allCategory', verifyToken,getAllCategories); 
router.get('/category/:id',verifyToken, getCategoryById); 
router.post('/initiate-payment',verifyToken, initiatePayment);
router.post('/verify-payment',verifyToken, verifyPayment);
router.post('/refund-payment',verifyToken, refundPayment);
router.get('/events/:id',verifyToken,getEventById)
// router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

//admin routes
router.get('/admin/users', verifyToken, authorizedRoles("admin"), getAllUsers);
router.get('/admin/orders',verifyToken,authorizedRoles("admin"),getAllOrders);
router.delete('/admin/deleteUser/:id',verifyToken,authorizedRoles("admin"),deleteUser);
router.post('/admin/addEvent',verifyToken,authorizedRoles("admin"),upload.single("image"), createEvent)
router.put('/admin/update-event/:id',verifyToken,authorizedRoles("admin"),upload.single('image'), updateEvent)
router.delete('/admin/delete-event/:id',verifyToken,authorizedRoles("admin"), deleteEvent)
router.post('/admin/createCategory',verifyToken,authorizedRoles("admin"),createCategory)
router.put('/admin/updateCategory/:id',verifyToken,authorizedRoles("admin"), updateCategory)
router.delete('/admin/deleteCategory/:id',verifyToken,authorizedRoles("admin"), deleteCategory)

module.exports=router
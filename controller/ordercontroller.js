import Razorpay from 'razorpay';
import { RAZORPAY_KEY,RAZORPAY_SECRET} from "../config";


const instance = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET
})

const ordercontroller = {
    async order(req,res){ 
    	//const data= JSON.parse(req.body);
    	//console.log(req);
    	console.log(req.body.data);
    	const amount = req.body.data.total;
    	const currency="INR";
    	const receipt="receipwief";
    	const notes="";
    	//return res.json({msg:"sab thik hai"});
    	instance.orders.create({amount, currency, receipt, notes},(error,order)=>{
    		if(error){
    			console.log(error);
    			return res.status(500).json(error);
    		}else{
    			console.log(order);
    			return res.status(200).json(order);
    		}
    	});
    	//res.json({msg:"sab ok hai"});
	},
	async status(req,res){ 
    	//const data= JSON.parse(req.body);
    	//console.log(req);
    	console.log(req.body);
    	return res.json("hello status");
    	//res.json({msg:"sab ok hai"});
	},
    
} 

export default ordercontroller;
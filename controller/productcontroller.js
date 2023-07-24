import {Product} from '../models';
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler';
import fs from 'fs';
import Joi from 'joi';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb



const productcontroller = {
    async store(req,res,next){ 

        //multipart form data
        handleMultipartData(req,res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filepath = req.file.path;
            const fileurlpath = filepath.replace(/\\/g, "/");
                      // we have to conver file path to url and url path to file path according to situation        //.replace(/\\/g, "/")
            console.log(req.file);

            // req validation
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price:Joi.number().required(),
                size: Joi.string().required(),
             });

            const {error} = productSchema.validate(req.body);
    
            if(error){

                // validate baad me kar rahe hai file upload ho gayi hai to delete karenge file ko
                fs.unlink(`${APP_ROOT}/${filepath}`,(err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                });
                console.log("file deletion me error hai");
                return next(error);
            }
            const {name,price,size}=req.body;
            let document;
            try {
                document = await Product.create({
                    name:name,
                    price:price,
                    size:size,
                    image:fileurlpath
                });
            } catch (error) {
                return next(error);
            }

            res.status(201).json(document);

        });

    },
    async update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

             // req validation
             const productSchema = Joi.object({
                name: Joi.string().required(),
                price:Joi.number().required(),
                size: Joi.string().required(),
                image: Joi.string(),
             });

            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${APP_ROOT}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        price,
                        size,
                        ...(req.file && { image: filePath.replace(/\\/g, "/") }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },
    async destroy(req,res,next){
        console.log(" bhai pauch gaya destroy me ");
        const document = await Product.findOneAndRemove({_id:req.params.id});
        if(!document){
            return next(new Error(" nothing to delete"));
        }
        
        //image delete
        const imagepath = document._doc.image;     // convert url path to file path
        fs.unlink(`${APP_ROOT}/${imagepath}`,(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError());
            }
        });
        res.json(document);
    },

    async index(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {
            documents = await Product.find()
                .select('-updatedAt -__v')
                .sort({ _id: -1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async show(req, res, next) {
        let document;
        try {
            document = await Product.findOne({ _id: req.params.id }).select(
                '-updatedAt -__v'
            );
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    },
    
} 

export default productcontroller;
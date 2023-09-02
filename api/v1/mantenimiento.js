import express from "express";
import { ObjectId} from "mongodb";
import {con}from "../../db/atlas.js";


// const appMantenimiento = express();
// appMantenimiento.use(express.json());
// appMantenimiento.use(LimitQuery());

/* appMantenimiento.get("/", middlewareVerify, async (req, res) => {
    
}); */
export async function getAllMantenimientos(req, res) {
    let db = await con();
    let collection = db.collection("mantenimiento");
    let result = await collection.find({}).toArray();
    if (!result || result.length === 0) {
        res.status(404).json({
            status: 404,
            message: "Not Found"
        });
    } else {
        res.send(result);
    }
}
export async function  getDataEmpleado(req, res) {
    try {
        let db = await con();
    const id = Math.floor(req.params._id)
    let collection = db.collection("mantenimiento");
    let result = await collection.aggregate([
        {
            $match: { _id: id }
        },
        {
          $lookup: {
            from: "empleados",
            localField: "_id",
            foreignField: "_id",
            as: "mantenimeinto_FK",
          },
        },
         {
          $project: {
            "mantenimeinto_FK._id": 0,
            "mantenimeinto_FK.id_area": 0,
           
      
          },
        },
        {
          $unwind: "$mantenimeinto_FK",
        },
         
      ]).toArray();
    if (!result || result.length === 0) {
        res.status(404).json({
            status: 404,
            message: "Not Found"
        });
    } else {
        res.send(result);
    }
    } catch (error) {
        console.log(error);
    }
}


/* appMantenimiento.post("/post", middlewareVerify, proxyMantenimientos, DTOData, async (req, res) => {
    
}); */
export async function postMantenimiento(req, res) {
    try {
        const db = await con();
        const collection = db.collection('mantenimiento');
        const insertDocument = {
            ...req.body,
            fecha_mantenimiento: new Date(req.body.fecha_mantenimiento)
        };
        await collection.insertOne(insertDocument);
        res.status(201).json({
            satus: 201,
            message: "Mantenimiento Registrado Exitosamente :)"
        });
    } catch (e) {
        res.status(500).json({
            satus: 500,
            message: "Internal Server Error :(",
            error: e.message
        });
    }
}

/* appMantenimiento.put("/update/:id", middlewareVerify, proxyMantenimientos, DTOData, async (req, res) => {
    
}); */
export async function putMantenimiento(req, res) {
    try {
        let _id = parseInt(req.params.id);
        const db = await con();
        const collection = db.collection('mantenimiento');
        const updateData ={
            $set: {
                ...req.body,
                fecha_mantenimiento: new Date(req.body.fecha_mantenimiento)
            }
        }
        let result = await collection.updateOne({ _id: _id }, updateData) 
        result.matchedCount === 1 ? 
            res.send({ message: "Mantenimiento Exitosamente Actualizado :)" }):
            res.send({ message: "No se encontró Data" });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            satus: 500,
            message: `Internal Server Error :(`,
            error: e.message
        });
    }
}

/* appMantenimiento.delete("/delete/:id", middlewareVerify, async (req, res) => {
    
}); */
export async function deleteManteniemiento(req, res) {
    try {
        let id = parseInt(req.params.id);
        const db = await con();
        const collection = db.collection('mantenimiento');
        await collection.deleteOne({
            _id: id
        });
        res.status(201).json({
            satus: 201,
            message: "Mantenimiento Eliminado Exitosamente :)"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            satus: 500,
            message: `Internal Server Error :(`,
            error: error.message
        });
    }
}
export default appMantenimiento;
import express from "express";
import { getAllBodegas, getBodegaById, postBodegas, putBodegas, deleteBodegas } from "../api/v1/bodegas.js";
import { proxyBodegas, middlewareVerify, DTOData, middlewareParamBodegas } from "../middleware/proxyBodegas.js";
import { LimitQuery } from "../helpers/config.js";
import passportHelper from "../helpers/passportHelper.js"
import { appVerify } from "../helpers/token.js";

const appBodegas = express();
appBodegas.use(express.json());
appBodegas.use(LimitQuery());
appBodegas.use((req, res, next) => {
    const apiVersion = req.headers["x-api"];
    if (apiVersion === "1.0") {
        next();
    } else {
        res.status(400).json({
            status: 400,
            message: "API Version No Compatible :("
        });
    }
});
appBodegas.use(passportHelper.authenticate("bearer", {session: false}));

appBodegas.get("/all",  getAllBodegas);
appBodegas.get("/:id", middlewareParamBodegas,(req, res, next) => {
    const bodegaId = req.params.id; 
    getBodegaById(req, res, bodegaId)
});
appBodegas.post("/post",  proxyBodegas,  postBodegas, );
appBodegas.put("/update/:id", proxyBodegas, async (req, res) => {
    const bodegaId = req.params.id; 
    putBodegas(req, res, bodegaId)
});
appBodegas.delete("/delete/:id", async (req, res) => {
    const bodegaId = req.params.id; 
    deleteBodegas(req, res, bodegaId)
});

export default appBodegas;
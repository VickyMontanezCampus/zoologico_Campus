import express from "express";
import { getAllIncidentes, getIncidenteById, postIncidentes, putIncidentes, deleteIncidentes } from "../api/v1/incidentes.js";
import { proxyIncidentes, middlewareVerify, DTOData, middlewareParamIncidentes } from "../middleware/proxyIncidentes.js";
import { LimitQuery } from "../helpers/config.js";
import passportHelper from "../helpers/passportHelper.js"
import { appVerify } from "../helpers/token.js";

const appIncidentes = express();
appIncidentes.use(express.json());
appIncidentes.use(LimitQuery());
appIncidentes.use((req, res, next) => {
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

appIncidentes.use(passportHelper.authenticate("bearer", {session: false}));
appIncidentes.get("/all",  getAllIncidentes);
appIncidentes.get("/:id",  middlewareParamIncidentes,(req, res, next) => {
    const incidenteId = req.params.id; 
    getIncidenteById(req, res, incidenteId)
});
appIncidentes.post("/post",  proxyIncidentes,  postIncidentes);
appIncidentes.put("/update/:id",  proxyIncidentes,  async (req, res) => {
    const incidenteId = req.params.id; 
    putIncidentes(req, res, incidenteId)
});
appIncidentes.delete("/delete/:id", async (req, res) => {
    const incidenteId = req.params.id; 
    deleteIncidentes(req, res, incidenteId)
});

export default appIncidentes;
import express from 'express';
import { SearchUniversalresults } from '../Controller/apicontroller.js';



const apiroute = express.Router();

apiroute.post("/searchAll",SearchUniversalresults)



export default apiroute


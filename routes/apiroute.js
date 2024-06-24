import express from 'express';
import { SearchUniversalresults,specificesearch2  } from '../Controller/apicontroller.js';



const apiroute = express.Router();

apiroute.post("/searchAll",SearchUniversalresults)
apiroute.post('/search-specific2', specificesearch2);


export default apiroute


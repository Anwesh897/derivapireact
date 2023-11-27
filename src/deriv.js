// Smaller bundle size, dealing only with the low-level library
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic.js';
//import WebSocket from 'ws';
import { Observable } from 'rxjs';

// app_id 1089 is for testing, create your own app_id and use it here.
// go to api.deriv.com to register your own app.
const app_id = 51526;
const token = 'oTFzEY0IoR4p1ax';
const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
const api = new DerivAPIBasic({ connection });

api.ping().then(console.log);




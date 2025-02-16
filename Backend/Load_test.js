import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 1000 },  
    { duration: '20s', target: 4500 },  
    { duration: '10s', target: 0 },     
  ],
};

export default function () {
    for (let i = 0; i < 5; i++) {
        http.post('http://localhost:5000/Chat', JSON.stringify({ message: "thor" }), {
          headers: { 
            'Content-Type': 'application/json',
            'origin': "http://localhost:5173",
            'X-Forwarded-For': `192.168.1.${Math.floor(Math.random() * 255)}` 
          }
        });
       sleep(0.1); 
    }    
}

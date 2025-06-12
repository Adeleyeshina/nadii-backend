import cron from 'node-cron'
import axios from 'axios'


cron.schedule('*/2 * * * *', async () => {
    try {
        const response = await axios.get('https://nadii-backend.onrender.com')
        console.log(`Health check response: ${response.status}`);
        
    } catch (error) {
        console.error(`Health check error : ${error.messge}`)
    }
})
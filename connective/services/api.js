import axios from "axios"
export const sendMessage = async (type, message) => {
    if(type === 'SMTP')
    {
        try {
            const res = await axios.post('/api/notifications/mail', {
                header: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                data: message
            })
    
            // if(res)
            // {
            //     return true
            // }
            // return false
        } catch (error) {
            console.log('Failed'+error);
        }
    }
    else
    {

    }


}
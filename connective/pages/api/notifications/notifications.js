import SendGrid from './mail'

export async function email(to, content){
    try {
        const sendGrid = await SendGrid.send({to, content})
        console.log(sendGrid);
    } catch (error) {
        console.log(error);
    }
}
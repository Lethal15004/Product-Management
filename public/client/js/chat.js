var socket=io();
const formSendMessage=document.querySelector('[send-message]');
formSendMessage.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=e.target.elements[0].value;
    if(message.trim()!==''){
        socket.emit('CLIENT_SEND_MESSAGE',message);
        e.target.elements[0].value='';
    }
})

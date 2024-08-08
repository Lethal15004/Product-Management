import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
var socket=io();

//Sự kiện thanh kéo cho chat
const bodyChat=document.querySelector('.chat .inner-body');
if(bodyChat){
    bodyChat.scrollTop=Number(bodyChat.scrollHeight) + 56 ;
}


//Sư kiện 1 phía
const formSendMessage=document.querySelector('[send-message]');
formSendMessage.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=e.target.elements[0].value;
    if(message.trim()!==''){
        socket.emit('CLIENT_SEND_MESSAGE',message);
        e.target.elements[0].value='';
    }
    
})

//Sự kiện cho tất cả mọi nên viêt cẩn thận
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const idUserCurrent=document.querySelector('[my-id]').getAttribute('my-id');
    const newDiv=document.createElement('div');
    if(data.userId===idUserCurrent){
        newDiv.classList.add('inner-outgoing');
        newDiv.innerHTML=`<div class="inner-content">${data.content}</div>`
    }else{
        newDiv.classList.add('inner-incoming');
        newDiv.innerHTML=`
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-content">${data.content}</div>`
    }
    const innerBodyChat=document.querySelector('.chat .inner-body');
    innerBodyChat.appendChild(newDiv);
    if(data.userId===idUserCurrent){
        innerBodyChat.scrollTop=innerBodyChat.scrollHeight
    }
})


// Add icon in chat
const emojiPicker= document.querySelector('emoji-picker');
if(emojiPicker){
    emojiPicker.addEventListener('emoji-click',(e)=>{
        formSendMessage.elements[0].value+=e.detail.unicode;
    })
}

//Show Popup Icon
const buttonIcon=document.querySelector('[button-icon]');
const tooltip=document.querySelector('.tooltip');
if(buttonIcon && tooltip){
    Popper.createPopper(buttonIcon, tooltip)
    buttonIcon.addEventListener('click',()=>{
        tooltip.classList.toggle('shown');
    })
}

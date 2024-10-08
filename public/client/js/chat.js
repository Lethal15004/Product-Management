import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

//Sự kiện thanh kéo cho chat
const bodyChat=document.querySelector('.chat .inner-body');
if(bodyChat){
    bodyChat.scrollTop=Number(bodyChat.scrollHeight) + 56 ;
}


//Sư kiện 1 phía
const formSendMessage=document.querySelector('[send-message]');
if(formSendMessage){

    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images',{
        multiple: true,
        maxFileCount: 6,
    });// Phần này là thư viện của file-upload-with-preview upload nhiều ảnh

    formSendMessage.addEventListener('submit',(e)=>{
        e.preventDefault();
        const images=upload.cachedFileArray;
        const message=e.target.elements[0].value;
        if(message.trim()!=='' || images.length>0){
            socket.emit('CLIENT_SEND_MESSAGE',{
                message:message,
                images:images
            });
            e.target.elements[0].value='';
            upload.resetPreviewPanel();
            socket.emit('CLIENT_SEND_TYPING',"hidden");

        }
    })
}

//Sự kiện cho tất cả mọi nên viêt cẩn thận
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const listTyping=document.querySelector('.chat .inner-list-typing');
    const idUserCurrent=document.querySelector('[my-id]').getAttribute('my-id');
    const newDiv=document.createElement('div');
    let htmlFullName='';
    let htmlContent='';
    let htmlImages='';

    if(data.userId===idUserCurrent){
        newDiv.classList.add('inner-outgoing');
    }else{
        newDiv.classList.add('inner-incoming');
        htmlFullName=`<div class="inner-name">${data.fullName}</div>`;
    }

    if(data.content.trim()!==''){
        htmlContent=`<div class="inner-content">${data.content}</div>`;
    }
    
    if(data.images.length>0){
        htmlImages+=`<div class="inner-images">`;
        for(const image of data.images){
            htmlImages+=`<img src="${image}" alt="image">`
        }
        htmlImages+=`</div>`;
    }

    newDiv.innerHTML=`
            ${htmlFullName}
            ${htmlContent}
            ${htmlImages}
        `
    const innerBodyChat=document.querySelector('.chat .inner-body');
    innerBodyChat.insertBefore(newDiv,listTyping);
    if(data.userId===idUserCurrent){
        innerBodyChat.scrollTop=innerBodyChat.scrollHeight
    }
    new Viewer(newDiv);
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


//Typing event 
    //Khó 
if(formSendMessage){
    const inputMessage=formSendMessage.querySelector('input');
    var typingTimeOut;
    if(inputMessage){
        inputMessage.addEventListener('keyup',()=>{
            socket.emit('CLIENT_SEND_TYPING',"show");
            clearTimeout(typingTimeOut);
            typingTimeOut=setTimeout(()=>{
                socket.emit('CLIENT_SEND_TYPING',"hidden");
            },3000)
        })
    }
}


socket.on('SERVER_RETURN_TYPING',(data)=>{
    const listTyping=document.querySelector('.chat .inner-list-typing');
    if(data.type==='show'){
        const existDiv=listTyping.querySelector(`[user-id="${data.userId}"]`);//Kiểm tra xem đã có div này chưa
        if(!existDiv){
            const newDiv=document.createElement('div');
            newDiv.classList.add('box-typing');
            newDiv.setAttribute('user-id',data.userId);
            newDiv.innerHTML=`
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots"><span></span><span></span><span></span></div>
            `
            listTyping.appendChild(newDiv);
        }
    }else{
        const existDiv=listTyping.querySelector(`[user-id="${data.userId}"]`);
        if(existDiv){
            listTyping.removeChild(existDiv);
        }
    }

})

// Preview Image
if(bodyChat){
    new Viewer(bodyChat);
}

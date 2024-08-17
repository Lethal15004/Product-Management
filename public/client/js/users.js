//Chức năng gửi yêu cầu kết bạn
const listBtnAddFriend=document.querySelectorAll('[btn-add-friend]');
if(listBtnAddFriend){
    listBtnAddFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            btn.closest('.box-user').classList.add('add');
            const userId=btn.getAttribute('btn-add-friend');
            socket.emit('CLIENT_ADD_FRIEND',userId);
        })
    })
}

const listBtnCancelAddFriend=document.querySelectorAll('[btn-cancel-friend]');
if(listBtnCancelAddFriend){
    listBtnCancelAddFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            btn.closest('.box-user').classList.remove('add');
            const userId=btn.getAttribute('btn-cancel-friend');
            socket.emit('CLIENT_CANCEL_ADD_FRIEND',userId);
        })
    })
}
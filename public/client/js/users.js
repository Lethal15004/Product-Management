//Chức năng gửi yêu cầu kết bạn trong trang Danh sách người dùng
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
//Hết chức năng gửi yêu cầu kết bạn trong trang Danh sách người dùng

//Chức năng hủy yêu cầu kết bạn trong trang Lời mời đã gửi
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
//Hết chức năng hủy yêu cầu kết bạn trong trang Lời mời đã gửi

//Chức năng từ chối yêu cầu kết bạn trong trang Lời mời đã nhận
const listBtnRefuseFriend=document.querySelectorAll('[btn-refuse-friend]');
if(listBtnRefuseFriend){
    listBtnRefuseFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            //Thêm class refuse
            btn.closest('.box-user').classList.add('refuse');

            //Gửi lên server userId của người dùng B
            const userId=btn.getAttribute('btn-refuse-friend');
            socket.emit('CLIENT_REFUSE_FRIEND',userId);
        })
    })
}
//Hết chức năng từ chối yêu cầu kết bạn trong trang Lời mời đã nhận

//Chức năng chấp nhận yêu cầu kết bạn trong trang Lời mời đã nhận
const listBtnAcceptFriend=document.querySelectorAll('[btn-accept-friend]');
if(listBtnAcceptFriend){
    listBtnAcceptFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            //Thêm class accepted
            btn.closest('.box-user').classList.add('accepted');

            //Gửi lên server userId của người dùng B
            const userId=btn.getAttribute('btn-accept-friend');
            socket.emit('CLIENT_ACCEPT_FRIEND',userId);
        })
    })
}
//Hết chức năng chấp nhận yêu cầu kết bạn trong trang Lời mời đã nhận


//Chức năng cập nhật số lượng khi A gửi kết bạn trong trang Lời mời đã nhận
socket.on('SERVER_RETURN_LENGTH_ACCEPT_FRIEND',(userB)=>{
    const id=userB._id;
    const badgeUsersAccept =document.querySelector(`[badge-users-accept="${id}"]`);
    if(badgeUsersAccept){
        badgeUsersAccept.innerHTML = userB.acceptFriends.length;
    }
})
//Hết chức năng cập nhật số lượng khi A gửi kết bạn trong trang Lời mời đã nhận

//Chức năng thêm mới user khi A gửi kết bạn trong trang Lời mời đã nhận
socket.on('SERVER_RETURN_INFO_ACCEPT_FRIEND',data=>{
    const rowElement=document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if(rowElement){
        const newUser=document.createElement('div');
        newUser.classList.add('col-6');
        newUser.setAttribute('user-id',data.infoA._id);
        newUser.innerHTML=
        `
        <div class="box-user add">
            <div class="inner-avatar">
                <img src="https://robohash.org/hicveldicta.png" alt="${data.infoA.fullName}"/>
            </div>
            <div class="inner-info">
                <div class="inner-name">${data.infoA.fullName}</div>
                <div class="inner-buttons">
                    <button
                        class="btn btn-sm btn-primary mr-1"
                        btn-accept-friend=${data.infoA._id}
                    > Chấp nhận </button>
                    <button
                        class="btn btn-sm btn-secondary mr-1"
                        btn-refuse-friend=${data.infoA._id}
                    > Xóa </button>
                    <button
                        class="btn btn-sm btn-secondary mr-1"
                        btn-deleted-friend
                        disabled
                    > Đã xóa </button>
                    <button
                        class="btn btn-sm btn-primary mr-1"
                        btn-accepted-friend
                        disabled
                    > Đã chấp nhận </button>
                </div>
            </div>
        </div>
        `
        rowElement.appendChild(newUser);

        //Bắt sự kiện click vào nút chấp nhận sau khi thêm mới user
        const btnAcceptFriend=newUser.querySelector(`[btn-accept-friend="${data.infoA._id}"]`);
        if(btnAcceptFriend){
            btnAcceptFriend.addEventListener('click',async (e)=>{
                //Thêm class accepted
                btnAcceptFriend.closest('.box-user').classList.add('accepted');
    
                //Gửi lên server userId của người dùng B
                const userId=btnAcceptFriend.getAttribute('btn-accept-friend');
                socket.emit('CLIENT_ACCEPT_FRIEND',userId);
            })
        }
       
        //Bắt sự kiện click vào nút từ chối sau khi thêm mới user
        const btnRefuseFriend=newUser.querySelector(`[btn-refuse-friend="${data.infoA._id}"]`);
        if(btnRefuseFriend){
            btnRefuseFriend.addEventListener('click',async (e)=>{
                //Thêm class refuse
                btnRefuseFriend.closest('.box-user').classList.add('refuse');
    
                //Gửi lên server userId của người dùng B
                const userId=btnRefuseFriend.getAttribute('btn-refuse-friend');
                socket.emit('CLIENT_REFUSE_FRIEND',userId);
            })
        }
    }
})
//Hết chức năng thêm mới user khi A gửi kết bạn trong trang Lời mời đã nhận

//Chức năng xóa user khi A hủy gửi yêu cầu kết bạn trong trang Lời mời đã nhận của B
socket.on('SERVER_RETURN_ID_CANCEL_FRIEND',(data)=>{
    const rowElement=document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if(rowElement){
        const userElement=rowElement.querySelector(`[user-id="${data.userIdA}"]`);
        if(userElement){
            rowElement.removeChild(userElement);
        }
    }
})
//Hết chức năng xóa user khi A hủy gửi yêu cầu kết bạn trong trang Lời mời đã nhận của B

//Chức năng xóa user A khỏi trang Danh sách người dùng của B khi A gửi kết bạn
socket.on('SERVER_RETURN_ID_ACCEPT_FRIEND',(data)=>{
    const rowElement=document.querySelector(`[data-users-not-friend="${data.userIdB}"]`);
    if(rowElement){
        const userElement=rowElement.querySelector(`[user-id="${data.userIdA}"]`);
        if(userElement){
            rowElement.removeChild(userElement);
        }
    }
})
//Hết chức năng xóa user A khỏi trang Danh sách người dùng của B khi A gửi kết bạn
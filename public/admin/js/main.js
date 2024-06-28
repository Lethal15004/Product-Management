//Button Status
const listBtnFilter=document.querySelectorAll('[button-status]')

//Bộ lọc frondend
if(listBtnFilter.length>0){
    let url= new URL(window.location.href);

    listBtnFilter.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const status=btn.getAttribute('button-status');
            btn.classList.add('active');
            if(url.searchParams.get('page')){
                url.searchParams.delete('page');
            }
            if(status){
                url.searchParams.set('status',status);
            }
            else{
                url.searchParams.delete('status');
                if(url.searchParams.get('keyword')){
                    url.searchParams.delete('keyword');
                }   
            }
            window.location.href=url.href;
        })
    })

    let currentStatus=url.searchParams.get('status') || "";
    let btnCurrent=document.querySelector(`[button-status="${currentStatus}"]`);
    if(btnCurrent){
        btnCurrent.classList.add('active');
    }
  
}
//End Bộ lọc

//Tìm kiếm frontend
const formSearch=document.querySelector('[form-search]');
if(formSearch){
    const url= new URL(window.location.href);
    formSearch.addEventListener('submit',(e)=>{
        e.preventDefault();
        const inputElement=document.querySelector('#search-keyword');
        console.log(inputElement.value)
        if(inputElement.value)
        {
            url.searchParams.set('keyword',inputElement.value);
        }else{
            url.searchParams.delete('keyword');
        }
        window.location.href=url.href;
    })
 
}
//End Tìm kiếm


//Phân trang
const listButtonPagination=document.querySelectorAll('[button-pagination]');
if(listButtonPagination.length>0){
    const url=new URL(window.location.href);
    listButtonPagination.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            let page=btn.getAttribute('button-pagination');
            if(page!=='1'){
                url.searchParams.set('page',page);
            }else{
                url.searchParams.delete('page');
            }
            window.location.href=url.href;
        })
    })
}

//Thay đổi trạng thái
const listBtnChangeStatus=document.querySelectorAll('[product-id]');
if(listBtnChangeStatus.length>0){
    listBtnChangeStatus.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const link = btn.getAttribute('link');
            const id = btn.getAttribute('product-id');
            const status = btn.getAttribute('product-status');
            const productChange={
                id: id,
                status: status
            }
            fetch(link,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(productChange)
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.code===200){
                    window.location.reload();
                }
            })
        })
    })
}


//Xử lý các chọn các sản phẩm để update
const checkAll=document.querySelector('input[name=checkAll]');
const checkItems=document.querySelectorAll('input[name=checkItem]');
const statusGroup=document.querySelector('[box-actions]');

    //Xử lý nút check all
if(checkAll){
    checkAll.addEventListener('click',(e)=>{
        checkItems.forEach(item=>{
            item.checked=checkAll.checked;
        })
    })
}
    //Xử lý nút check item
if(checkItems.length>0){
    checkItems.forEach(item=>{
        item.addEventListener('click',(e)=>{
            const isCheckAll=document.querySelectorAll('input[name=checkItem]:checked');
            if(isCheckAll.length===checkItems.length)
                checkAll.checked=true;
            else
                checkAll.checked=false;
        })
    })
}
if(statusGroup){
    const buttonUpdateMany=statusGroup.querySelector('button');
    const chooseStatus=statusGroup.querySelector('select');
    if(chooseStatus&&buttonUpdateMany){
        buttonUpdateMany.addEventListener('click',(e)=>{
        const updateProducts={};
        updateProducts.status=chooseStatus.value;
        updateProducts.ids=[...checkItems].reduce((accumulate,curr)=>{
            if(curr.checked){
                let id= curr.closest('tr').querySelector('[product-id]').getAttribute('product-id');
                accumulate.push(id);
            }
            return accumulate;
        },[])
        if(updateProducts.status!==''&&updateProducts.ids.length>0){
            const link = buttonUpdateMany.getAttribute('link');
            fetch(link,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(updateProducts)
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.code===200){
                        window.location.reload();
                }
             })
         }
        })
    }
}

// Xử lý xóa mềm sản phẩm 
const listButtonsDelete=document.querySelectorAll('[button-delete]');
if(listButtonsDelete.length>0){
    listButtonsDelete.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const link = btn.getAttribute('button-delete');
            fetch(link,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.code===200){
                    window.location.reload();
                }
            })
        })
    })
}

//Xử lý thay đổi position
const listButtonPosition=document.querySelectorAll('input[type=number]');
listButtonPosition.forEach(btn=>{
    btn.addEventListener('change',(e)=>{
        const link=btn.getAttribute('link')+`/${btn.value}`;
        fetch(link,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
        })
    })
})

//Ẩn alert
const alertSuccess=document.querySelector('[show-alert]');
if(alertSuccess){
    const time= Number(alertSuccess.getAttribute('show-alert'))||3000;
    setTimeout(()=>{
        alertSuccess.classList.add('hidden');
    },time)
}

//Khôi phục 1 sản phẩm
const listButtonRestore=document.querySelectorAll('[button-restore]');
if(listButtonRestore.length>0){
    listButtonRestore.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const link = btn.getAttribute('button-restore');
            fetch(link,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.code===200)
                    window.location.reload();
            })
        })
    })
}

//Xóa vĩnh viễn 1 sản phẩm
const listButtonRemove=document.querySelectorAll('[button-remove]');
if(listButtonRemove.length>0){
    listButtonRemove.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const link = btn.getAttribute('button-remove');
            fetch(link,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.code===200)
                    window.location.reload();
            })
        })
    })
}

//Xử lý preview ảnh
const uploadImage=document.querySelector('[upload-image]');
if(uploadImage){
    const inputImage=uploadImage.querySelector('[upload-image-input]');
    const previewImage=uploadImage.querySelector('[upload-image-preview]');
    if (inputImage && previewImage){
        inputImage.addEventListener('change',(e)=>{
            const [file]=inputImage.files;
            if(file){
                console.log(URL.createObjectURL(file));
                previewImage.src=URL.createObjectURL(file);
            }
        })
    }
}
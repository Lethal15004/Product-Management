//Button Status
const listBtnFilter=document.querySelectorAll('[button-status]')

//Bộ lọc
if(listBtnFilter.length>0){
    let url= new URL(window.location.href);

    listBtnFilter.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const status=btn.getAttribute('button-status');
            btn.classList.add('active');
            if(status){
                url.searchParams.set('status',status);
            }
            else{
                url.searchParams.delete('status');
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

//Tìm kiếm
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
            console.log("Vào");
            url.searchParams.delete('keyword');
        }
        window.location.href=url.href;
    })
 
}
//End Tìm kiếm

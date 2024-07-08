const createTree=(categories,parentId ='')=>{ //Đệ quy
    const newArray=[];
    categories.forEach(category=>{
        if(category.parent_id === parentId ){
            const children=createTree(categories,category.id);
            if(children.length>0)
            {
                category.children=children;
            }
            newArray.push(category);
        }
    })
    return newArray;
}
module.exports=(categories,parentId='')=>
{
    const tree= createTree(categories,parentId);
    return tree;
}
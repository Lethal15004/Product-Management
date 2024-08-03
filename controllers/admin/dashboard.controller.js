const Category=require('../../models/admin/product-category.model');
const Product=require('../../models/admin/product.model');
const Account=require('../../models/admin/account.model');
const User=require('../../models/client/user.model');
module.exports.index= async (req,res)=>{
    const modelArray=[Category,Product,Account,User];
    const statistic={}
    for(const model of modelArray){
        const total= await model.countDocuments({deleted:false});
        const active= await model.countDocuments({status:'active',deleted:false});
        const inactive= await model.countDocuments({status:'inactive',deleted:false});
        statistic[model.modelName]={
            total:total,
            active:active,
            inactive:inactive
        }
    }
    res.render('admin/pages/dashboard/index',{
        title:'Dashboard',
        statistic:statistic
    });
}

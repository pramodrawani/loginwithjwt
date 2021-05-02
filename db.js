var  mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/edu_mar_intern',{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log('connection successful:')
}).catch(()=>{
    console.log('connection failure:')
})

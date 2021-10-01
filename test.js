const x = function(callback){
    callback("test")
}

let theCallback = (data,data2)=>{
    console.log(this)
    console.log(data)
    console.log(data2)
}

x(theCallback.bind(null,"um"))

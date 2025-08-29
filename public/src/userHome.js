'use strict'

const addEventOnElem= function (elem,type,callback){
    if (elem.length){
        for (let i=0;i<elem.length;i++){
            elem[i].addEventListener(type,callback);
        }
    }else{
        elem.addEventListener(type,callback);
    }
}

const threedash=document.querySelector('.three-dash')
const sidebar=document.querySelector('.side-bar-container')
const routes=document.querySelector('.routes')

const sidebar_function=function (){
    sidebar.classList.toggle("active")
}

addEventOnElem(threedash,'click',sidebar_function);

document.addEventListener('click', function(event) {
  if (!sidebar.contains(event.target) && !threedash.contains(event.target)) {
    sidebar.classList.remove('active');
  }
});

window.addEventListener("scroll",function (){
    if (window.scrollY>20){
        routes.classList.add("active");
    }
    else{
        routes.classList.remove("active");
    }
});







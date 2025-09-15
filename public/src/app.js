'use strict';
const sidebar=document.querySelector(".sdbr");
const search0=document.querySelector(".srch");
const sidebar2=document.querySelector(".btn1");
const search=document.querySelector(".btn2");
const settings=document.querySelector(".btn4");
const setting=document.querySelector(".stgs");
const newchat=document.querySelector(".nwct");
const newchats=document.querySelector(".btn3");
const langToggleBtn = document.getElementById("langToggleBtn");

function change() {
  document.getElementsByClassName("container")[0].classList.toggle("active");
    document.querySelector(".container2").classList.toggle("active");
    document.querySelector(".navbar").classList.toggle("active");
    document.querySelector("input").classList.toggle("active");
}   

sidebar.addEventListener("click", change);
sidebar2.addEventListener("click", change);
search0.addEventListener("click", change);
setting.addEventListener("click", change);
langToggleBtn.addEventListener("click", change);

search.addEventListener("click",()=>{
    document.querySelector(".input2").classList.add("active");
})

search0.addEventListener("click",()=>{
    document.querySelector(".input2").classList.add("active");
})

sidebar.addEventListener("click",()=>{
    document.querySelector(".input2").classList.remove("active");
})

settings.addEventListener("click",()=>{
    document.querySelector(".settings-list").classList.toggle("active");
})

sidebar.addEventListener("click",()=>{
    document.querySelector(".settings-list").classList.remove("active");
})



document.querySelector(".stngs").addEventListener("click", () => {
  fetch("/language", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      alert(`Language changed to: ${data.language}`);
    })
    .catch(err => console.error(err));
});









/*const addEventOnElem= function (elem,type,callback){
    if (elem.length>1){
        for (let i=0;i<elem.length;i++){
            elem[i].addEventListener(type,callback);
        }
    }else{
            elem.addEventListener(type,callback);   
        }
}

const sidebar=document.querySelector(".sdbr");
const search=document.querySelectorAll("srch");
const settings=document.querySelector("stgs");

const toggleNavbar = function (){
    sidebar.classList.toggle("active");  
}

*/
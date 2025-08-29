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

/* The eye-icon toggle for password display */
const togglers = document.querySelectorAll('.toggler');
const fields = document.querySelectorAll('.input-field');

const password_shower=function(event){
    const toggler=event.target;
    const container=toggler.closest(".input-container");
    const field=container.querySelector(".input-field");

    if (field.type=="password"){
        field.type="text";
        toggler.classList.remove("fa-eye");
        toggler.classList.add("fa-eye-slash");

    }else{
        field.type="password";
        toggler.classList.add("fa-eye");
        toggler.classList.remove("fa-eye-slash");
    }
}

addEventOnElem(togglers, "click", password_shower);
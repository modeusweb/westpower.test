"use strict";document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".js-input-switcher").forEach((e=>{e.addEventListener("click",(function(){let e=this.dataset.status,t=document.querySelector(this.dataset.target);t.disabled=!t.disabled,this.dataset.status="save"===e?"change":"save"}))}));document.querySelectorAll('[type="tel"]').forEach((e=>{IMask(e,{mask:"+{7}(000)000-0000"})}));document.querySelectorAll(".accordion").forEach((e=>{e.querySelector(".accordion__head").addEventListener("click",(function(){e.classList.toggle("opened")}))}))}));
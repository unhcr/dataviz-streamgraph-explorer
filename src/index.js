function detectMobile() {
   if(window.innerWidth <= 800 && window.innerHeight <= 600) {
     return true;
   } else {
     return false;
   }
}

const device = detectMobile() ? "mobile" : "desktop";
console.log("We are on a " + device);


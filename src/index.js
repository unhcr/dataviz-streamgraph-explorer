import detectMobile from './detectMobile';
const device = detectMobile() ? 'mobile' : 'desktop';
console.log('We are on a ' + device);


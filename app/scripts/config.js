var dev = false;
var enabled = !dev;

var imgName = 'cam.jpg';
var imgRefreshTime = dev ? 999999 : 300;

var URLs = {
  local: {
    baseURL: "",
    streamBaseURL: "http://172.17.1.58:8080/",
    openDoors: "/red/prende",
    saveAlias: "/red/alias",
    login: "/red/login",
    talk: "/red/say",
    announceFood: "/red/vianda",
    cameraFix: "/red/camera"
  },
  dev: {
    baseURL: "http://172.17.1.58:1880/",
    streamBaseURL: "http://172.17.1.58:8080/",
    openDoors: "http://172.17.1.58:1880/red/prende",
    saveAlias: "http://172.17.1.58:1880/red/alias",
    login: "http://172.17.1.58:1880/red/login",
    talk: "http://172.17.1.58:1880/red/say",
    announceFood: "http://172.17.1.58:1880/red/vianda",
    cameraFix: "http://172.17.1.58:1880/red/camera"
  }
};

if(dev){
  var SVC_URL = URLs.dev;
}
else{
  var SVC_URL = URLs.local;
}

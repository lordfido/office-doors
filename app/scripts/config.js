var dev = false;

var URLs = {
  local: {
    baseURL: "",
    streamBaseURL: "http://172.17.1.58:8080/",
    openDoors: "/red/prende",
    login: "/red/login"
  },
  dev: {
    baseURL: "http://172.17.1.58:1880/",
    streamBaseURL: "http://172.17.1.58:8080/",
    openDoors: "http://172.17.1.58:1880/red/prende",
    login: "http://172.17.1.58:1880/red/login"
  }
};

if(dev){
  var SVC_URL = URLs.dev;
}
else{
  var SVC_URL = URLs.local;
}

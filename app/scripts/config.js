var dev = false;

var URLs = {
  local: {
    baseURL: "",
    streamBaseURL: "http://172.17.1.58:8080/",
    openDoors: "/red/prende",
    login: "/red/login",
    talk: "/red/say",
    announceFood: "https://slack.com/api/chat.postMessage"
  },
  dev: {
    baseURL: "http://172.17.1.58:1880/",
    streamBaseURL: "http://172.17.1.58:8080/",
    openDoors: "http://172.17.1.58:1880/red/prende",
    login: "http://172.17.1.58:1880/red/login",
    talk: "http://172.17.1.58:1880/red/say",
    announceFood: "https://slack.com/api/chat.postMessage"
  }
};

if(dev){
  var SVC_URL = URLs.dev;
}
else{
  var SVC_URL = URLs.local;
}

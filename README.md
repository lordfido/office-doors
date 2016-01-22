# office-doors
Small webapp to open office doors

# How to install:
1) Clone this repo
2) Run <code>npm install</code> on root folder
3) Run <code>bower install</code> on root folder
4) Run <code>gulp</code> on root folder

That's it! :)

# Some configs
1) Under app/office-doors.js, at the end, you can set <code>$rootScope.enabled</code> to true|false.
  1.a) If <code>true</code>, it makes an AJAX call to the server, and display an animation when server answers the door has been opened.
  1.b) If <code>false</code>, it doesn't make an AJAX call, and display an animation anyways (for debugging purposes).
  
2) Under app/config.js, at the very top, you can set <code>var dev = true|false</code>.
  2.a) If <code>true</code>, application will force absolute URLs (NOT running on the server).
  2.b) If <code>false</code>, application will use relative URLs (running on the server).

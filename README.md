# office-doors
<p>Small webapp to open office doors</p>

# How to install:
<ol>
  <li>Clone this repo</li>
  <li>Run <code>npm install</code> on root folder</li>
  <li>Run <code>bower install</code> on root folder</li>
  <li>Run <code>gulp</code> on root folder</li>
</ol>

<p>That's it! :)</p>

# Some configs
<ol>
  <li>Under app/office-doors.js, at the end, you can set <code>$rootScope.enabled</code> to true|false.</li>
  <ol>
    <li>If <code>true</code>, it makes an AJAX call to the server, and display an animation when server answers the door has been opened.</li>
    <li>If <code>false</code>, it doesn't make an AJAX call, and display an animation anyways (for debugging purposes).</li>
  </ol>
  
  <li>Under app/config.js, at the very top, you can set <code>var dev = true|false</code>.</li>
    <ol>
      <li>If <code>true</code>, application will force absolute URLs (NOT running on the server).</li>
      <li>If <code>false</code>, application will use relative URLs (running on the server).</li>
  </ol>

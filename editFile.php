<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Indic Language Writer</title>
<link rel="stylesheet" href="./style.css">
<script>
  function dispFile(contents) {
    tinyMCE.activeEditor.setContent(contents);
  }
  function clickElem(elem) {
      // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
      var eventMouse = document.createEvent("MouseEvents")
      eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      elem.dispatchEvent(eventMouse)
  }
  function openFile(func) {
      readFile = function(e) {
          var file = e.target.files[0];
          if (!file) {
              return;
          }
          var reader = new FileReader();
          reader.onload = function(e) {
              var contents = e.target.result;
              fileInput.func(contents)
              document.body.removeChild(fileInput)
          }
          reader.readAsText(file)
      }
      fileInput = document.createElement("input")
      fileInput.type='file'
      fileInput.style.display='none'
      fileInput.onchange=readFile
      fileInput.func=func
      document.body.appendChild(fileInput)
      clickElem(fileInput)
  }
</script>

</head>
<body>
<!-- partial:index.partial.html -->
<br>
<br>
<input type="hidden" id="hdFullHtml">
<input type="hidden" id="currentFileName" value="noValue">
<button onclick="openFile(dispFile)">Open a file</button>
<form onsubmit="saveTextAsFile()">
<textarea id="full-featured">
</textarea>
</form>
<!-- partial -->
<script src="https://cdn.tiny.cloud/1/b180wmb12hu5scbjbkk59lr5fr2v60ry13hn5q089c4omg0j/tinymce/5/tinymce.min.js"></script> 
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'></script>
<script src='./dist/translateLib.js?i=2'></script>
<script  src="./dist/script.js?i=3F"></script>

</body>
</html>

var glSelectedNode = null;
var fakeServer = (function () {
  /* Use tinymce's Promise shim */
  var Promise = tinymce.util.Promise;
  /* This represents getting the complete list of users from the server with only basic details */
  var fetchUsers = function() {
    return new Promise(function(resolve, _reject) {
      /* simulate a server delay */
    });
  };

  /* This represents requesting all the details of a single user from the server database */
  var fetchUser = function(id) {
    return new Promise(function(resolve, reject) {
      /* simulate a server delay */
      setTimeout(function() {
        if (Object.prototype.hasOwnProperty.call(userDb, id)) {
          resolve(userDb[id]);
        }
        reject('unknown user id "' + id + '"');
      }, 300);
    });
  };

  return {
    fetchUsers: fetchUsers,
    fetchUser: fetchUser
  };
})();

/* These are "local" caches of the data returned from the fake server */
var usersRequest = null;
var userRequest = {};

var mentions_fetch = function (query, success) {
  /* Fetch your full user list from somewhere */
  if (usersRequest === null) {
    usersRequest = fakeServer.fetchUsers();
  }
  usersRequest.then(function(users) {
    /* query.term is the text the user typed after the '@' */
    users = users.filter(function (user) {
      return user.name.indexOf(query.term.toLowerCase()) !== -1;
    });

    users = users.slice(0, 10);

    /* Where the user object must contain the properties `id` and `name`
       but you could additionally include anything else you deem useful. */
    success(users);
  });
};

var mentions_menu_hover = function (userInfo, success) {
  /* request more information about the user from the server and cache it locally */
  if (!userRequest[userInfo.id]) {
    userRequest[userInfo.id] = fakeServer.fetchUser(userInfo.id);
  }
  userRequest[userInfo.id].then(function(userDetail) {
    var div = document.createElement('div');

    div.innerHTML = (
    '<div class="card">' +
      '<img class="avatar" src="' + userDetail.image + '"/>' +
      '<h1>' + userDetail.fullName + '</h1>' +
      '<p>' + userDetail.description + '</p>' +
    '</div>'
    );

    success(div);
  });
};

var mentions_menu_complete = function (editor, userInfo) {
  var span = editor.getDoc().createElement('span');
  span.className = 'mymention';
  span.setAttribute('data-mention-id', userInfo.id);
  span.appendChild(editor.getDoc().createTextNode('@' + userInfo.name));
  return span;
};

var mentions_select = function (mention, success) {
  /* `mention` is the element we previously created with `mentions_menu_complete`
     in this case we have chosen to store the id as an attribute */
  var id = mention.getAttribute('data-mention-id');
  /* request more information about the user from the server and cache it locally */
  if (!userRequest[id]) {
    userRequest[id] = fakeServer.fetchUser(id);
  }
  userRequest[id].then(function(userDetail) {
    var div = document.createElement('div');
    div.innerHTML = (
      '<div class="card">' +
      '<img class="avatar" src="' + userDetail.image + '"/>' +
      '<h1>' + userDetail.fullName + '</h1>' +
      '<p>' + userDetail.description + '</p>' +
      '</div>'
    );
    success(div);
  });
};

tinymce.init({
  selector: 'textarea#full-featured',
  plugins: 'print preview fullpage powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons',
 menu: {
    tc: {
      title: 'TinyComments',
      items: 'addcomment showcomments deleteallconversations'
    }
  },
  menubar: 'file edit view insert format tools table tc help',
  toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
  autosave_ask_before_unload: true,
  autosave_interval: "30s",
  autosave_prefix: "{path}{query}-{id}-",
  autosave_restore_when_empty: false,
  autosave_retention: "2m",
  image_advtab: true,
  content_css: [
    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    '//www.tiny.cloud/css/codepen.min.css'
  ],
  importcss_append: true,
  height: 400,
  file_picker_callback: function (callback, value, meta) {
    /* Provide file and text for the link dialog */
    if (meta.filetype === 'file') {
      callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
    }

    /* Provide image and alt text for the image dialog */
    if (meta.filetype === 'image') {
      callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
    }
  },
  templates: [
        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
    { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
    { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
  ],
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  height: 600,
  image_caption: true,
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_noneditable_class: "mceNonEditable",
  toolbar_drawer: 'sliding',
  spellchecker_dialog: true,
  spellchecker_whitelist: ['Ephox', 'Moxiecode'],
  tinycomments_mode: 'embedded',
  content_style: ".mymention{ color: gray; }",
  contextmenu: "link image imagetools table configurepermanentpen",
  mentions_selector: '.mymention',
  mentions_fetch: mentions_fetch,
  mentions_menu_hover: mentions_menu_hover,
  mentions_menu_complete: mentions_menu_complete,
  mentions_select: mentions_select,
  init_instance_callback: function (editor) {
    editor.on('click', function (e) {
      console.log('Element clicked:', e.target.nodeName);
    });
    editor.on('NodeChange',function (e){
      glSelectedNode = tinyMCE.activeEditor.selection.getNode();
      console.log(tinyMCE.activeEditor.selection.getNode().innerHTML);
      $("#hdFullHtml").val(tinyMCE.activeEditor.selection.getNode().innerHTML);
      $("#InStartType").val(displayFirstText(tinyMCE.activeEditor.selection.getNode().innerHTML))
    });
    editor.on('BeforeExecCommand', function (e) {
      if (e.command == "mcePreview") {
          //store content prior to changing.
          preProssesInnerHtml = editor.getContent();
          preProssesInnerHtml += "<script src='rnnxvjp.js'></script>"
          editor.setContent(preProssesInnerHtml);
      }
  });
  }
 });

function putText(){
  originalHtml = $("#hdFullHtml").val();
  newText = $("#InStartType").val();
  if (newText){
//    tinyMCE.activeEditor.selection.getNode()).setHTML();
    tinymce.activeEditor.dom.setHTML(glSelectedNode, getModifiedHtml(originalHtml,newText));
  //tinymce.activeEditor.execCommand('mceInsertContent', false, $("#InstartType").val());
    transliterate(newText,"brh","Dvn",function(dvnText){
      $("#InShowPreviewOfline").val(dvnText);
    });
    $("#InStartType").focus();
  }
}

function convertMe(){
  strBaraha = $("#InstartType").val();
  $("#InShowPreviewOfline").val(convertToDvng(strBaraha));
}

// Simple function which displays the text
function displayFirstText(a){
  r = /^([^<]+)/;
  b =  r.exec(a);
  return b[0];
}

// replace the tinymce with new text
function getModifiedHtml(originalHtml,newText){
  r = /^([^<]+)/;
  b =  r.exec(originalHtml);
  oldText = b[0];
  newHtml = originalHtml.replace(oldText,newText);
  return newHtml;
}
// This is a simple file which will translate a doc into a preferred language
// uses cookies if available.


function convertLanguage(el){
    for (nde of textNodesUnder(el)){
        transliterate(nde.textContent,"brh","Dvn",function (outstr,nodeEle){
            nodeEle.textContent = outstr;
        },nde);
    }
}

function textNodesUnder(el) {
    return walkNodeTree(el, {
        inspect: n => !['STYLE', 'SCRIPT'].includes(n.nodeName),
        collect: n => (n.nodeType === 3),
        //callback: n => console.log(n.nodeName, n),
    });
}


//https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function walkNodeTree(root, options) {
    options = options || {};

    const inspect = options.inspect || (n => true),
          collect = options.collect || (n => true);
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ALL,
        {
            acceptNode: function(node) {
                if(!inspect(node)) { return NodeFilter.FILTER_REJECT; }
                if(!collect(node)) { return NodeFilter.FILTER_SKIP; }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodes = []; let n;
    while(n = walker.nextNode()) {
        options.callback && options.callback(n);
        nodes.push(n);
    }

    return nodes;
}


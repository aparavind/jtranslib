var greatArray = {};

$(document).ready(function(){
  $("#dest").click(function(){
      transliterate("oM bhoorbhuvaH svaH","brh","Dvn",sampleCallBack);
  });               
})

function sampleCallBack(outputString){
  $("#dest").val(outputString);
}

function isFromType(variable, type){
    if (typeof type == 'string') res = (typeof variable == type.toLowerCase())
    else res = (variable.constructor == type)
    return res
}

// This is the caller and translates pushes into console
function transliterate(string,origLang,finalLang,callBackFunc,otherArgs){
    if (Object.entries(greatArray).length == 0){
        baseUrl = "./convertJsons/";
	console.log(document.domain);
        $.ajax({
            "url" : baseUrl + origLang + finalLang + ".json",
            "datatype" : "json",
            "original_string" : string,
            "callBackFunc" : callBackFunc,
            "otherArgs" : otherArgs,
            "success" : populateGreatArrayAndConvert
        });
    } else {
	    convert_string(string,callBackFunc,otherArgs);
    }
}

function populateGreatArrayAndConvert(data){
    if (!(isFromType(data,'object'))){
        greatArray = JSON.parse(date);
    } else {
        greatArray = data;
    }
	var brhString = this.original_string;
	convert_string(brhString,this.callBackFunc,this.otherArgs);
}

// This converts the string
function convert_string(string,callBackFunc,otherArgs){
	var detClass = {
        "brhMaxSize" : 8,
        "previousMinussable" : 0
    };
	detClass = next_conv_char(0,0,detClass,1);

	var offset = 0;
	var loopString = string;
	var outString = "";
	do {
        detClass.removeLastChar = 0;
        detClass.i = 0;
		detClass = next_conv_char(greatArray,loopString,detClass,0);
		if (detClass.i == 0){
			break;
		}

		if (detClass.removeLastChar == 1){
			outString = removeLastChar(outString,detClass);
		}
		
		outString = outString + detClass.outStr;
		loopString = usubstr(loopString,detClass.i);
	
    } while (1);
    console.log(outString);
    callBackFunc(outString,otherArgs);
}

function removeLastChar(outString,detClass){
	var len = ulength(outString);
	return usubstr(outString,0,len-1);
}

function next_conv_char(greatArray,inpString,detClass,resetAll){

    if (resetAll == 1){
        detClass.previousMinussable = 0;
        detClass.outputStatus = 0;
        return detClass;
    }

    if (inpString == ""){
        detClass.outputStatus = 0;
        return detClass;       
    }

    var getI = getMatchingI(inpString,detClass.previousMinussable,greatArray,detClass);

    if ((getI.i == 0) && (detClass.previousMinussable == 1)){
        getI = getMatchingI(inpString,0,greatArray,detClass);
    }

    if (getI.i >0){
        detClass.outStr = getI.greatA.opDvn;
	    detClass.removeLastChar = getI.greatA.performMinusOne && detClass.previousMinussable;
	    detClass.previousMinussable = getI.greatA.isMinussable;
    } else {
	    detClass.outStr = usubstr(inpString,0,1);
	    getI.i = getI.i + 1;
    }
    detClass.i = getI.i;
    return detClass;
}

function getMatchingI(inpString,hasMinus,greatArray,detClass){
    var ret = {};
    var l = ulength(inpString);
    for(var i= (detClass.brhMaxSize > l) ? l:detClass.brhMaxSize ; i > 0; i--){
        var subString = usubstr(inpString,0,i);
        if (hasMinus){
            subString = subString + "[%% e %%]";
        }
        if (greatArray[subString]){
            break;
        }
    }
    ret.i = i;
    if (i > 0){
        ret.greatA = greatArray[subString];
    }
    return ret;
}



function ulength(string) {
       return Array.from(string).length;
}

function usubstr(inpStr,from,to) {
  pStr = [];
  
  if (!to){
    to = ulength(inpStr);
  }
  
  if (!from){
    from = 0;
  }
  
  var inpArr = Array.from(inpStr);
  j = 0;
  for (i=from;i<to;i++){
  	pStr[j] = inpArr[i]
    j++;
  }
  return pStr.join("");
}

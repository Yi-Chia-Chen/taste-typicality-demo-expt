// Yi-Chia Chen
// Created: Sept 8, 2017
//
// Functions:
//
// myGetParam(varName,defaultValue)
// myDataString(dataList,divider='\t')
// mySubjNoUpdate(page,fileName,subObj)
// myPostData(page,data,successFunc=function(){return;},errorCallback=function(){return;})
// myShuffleArray(array)
// mySampleWO(list,sampleN=1)
// mySampleW(list,sampleN=1)
// myRandChoice(list)
// myRange(startNum=0,EndNum)
// myDate(dateObj=new Date(),timeZone='UTC',divider='.',padded=true)
// myTime(dateObj=new Date(),timeZone='UTC',divider=':',padded=true)
// myLoadImages(index, stimPath, imgList, afterFunc)
// myLoadSounds(index, stimPath, soundList, afterFunc)
// myPolarToCartesian(r, theta)
// myToRadians(degrees)


// receiving parameters from url with get method
function myGetParam(varName,defaultValue){
  var regexString = "[\?&]"+varName+"=([^&#]*)";
  var regex = new RegExp(regexString);
  var nowURL = location.href;
  var results = regex.exec(nowURL);
  if (results == null){
    return defaultValue;
  }
  else{
    return results[1];
  }
}

// turning list of variables into a string with divider and line break
function myDataString(dataList,divider){
  divider = (divider === undefined) ? '\t' : divider;
  var string = '';
  for (var i=0;i<dataList.length-1;i++){
    string += dataList[i] + divider;
  }
  string += dataList[dataList.length-1] + '\n';
  return string;
}

// updating and getting subject number with JQuery AJAX
function mySubjNoUpdate(page,fileName,subObj){
  $.ajax({
    type: "POST",
    url: page,
    data: {'fileName': fileName}
  })
  .done(function(data){
    alert(data);
    subObj.No = eval(data);
  })
  .fail(function(){
    subObj.No = -999;
  });
}

// posting data with JQuery AJAX
function myPostData(page,data,successFunc,errorCallback){
  data = (data === undefined) ? null : data;
  successFunc = (successFunc === undefined) ? function(){return;} : successFunc;
  errorCallback = (errorCallback === undefined) ? function(){return;} : errorCallback;
  $.ajax({
    type: "POST",
    url: page,
    data: data,
    success: successFunc,
    error: errorCallback
  });
}


// shuffling arrays
function myShuffleArray(array){
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// sampling without replacement
function mySampleWO(list,sampleN){
  sampleN = (sampleN === undefined) ? 1 : sampleN;
  var sample = [];
  var localList = list.slice(0);
  for (var i=0; i<sampleN; i++) {
    var randomIndex = Math.floor(Math.random()*localList.length);
    sample.push(localList.splice(randomIndex,1)[0]);
  }
  return {
    sample: sample,
    remainder: localList
  };
}

// sampling with replacement
function mySampleW(list,sampleN){
  sampleN = (sampleN === undefined) ? 1 : sampleN;
  var sample = [];
  var localList = list.slice(0);
  var listLength = localList.length
  for (var i=0; i<sampleN; i++) {
    var randomIndex = Math.floor(Math.random()*listLength);
    sample.push(localList[randomIndex]);
  }
  return sample;
}

// randomly choosing an item from an array
function myRandChoice(list){
  return list[Math.floor(Math.random()*list.length)];
}

// create an array of integer in a range (including the start number excluding the end number)
function myRange(startNum,EndNum,interval){
  startNum = (startNum === undefined) ? 0 : startNum;
  interval = (interval === undefined) ? 1 : interval;
  var list = [];
  for (var i=startNum; i<EndNum; i+=interval) {
      list.push(i);
  }
  return list;
}

// formatting date object into date string
function myDate(dateObj,timeZone,divider,padded){
  dateObj = (dateObj === undefined) ? new Date() : dateObj;
  timeZone = (timeZone === undefined) ? 'UTC' : timeZone;
  divider = (divider === undefined) ? '.' : divider;
  padded = (padded === undefined) ? true : padded;
  if (timeZone == 'UTC'){
    var nowYear = dateObj.getUTCFullYear();
    var nowMonth = dateObj.getUTCMonth() + 1;
    var nowDate = dateObj.getUTCDate();
  }
  else{
    var nowYear = dateObj.getFullYear();
    var nowMonth = dateObj.getMonth() + 1;
    var nowDate = dateObj.getDate();
  }
  if (padded){
    nowMonth = ('0'+nowMonth).slice(-2);
    nowDate = ('0'+nowDate).slice(-2);
  }
  var nowFullDate = nowYear+divider+nowMonth+divider+nowDate;
  return nowFullDate;
}

// formatting date object into 24-hour format time string
function myTime(dateObj,timeZone,divider,padded){
  dateObj = (dateObj === undefined) ? new Date() : dateObj;
  timeZone = (timeZone === undefined) ? 'UTC' : timeZone;
  divider = (divider === undefined) ? ':' : divider;
  padded = (padded === undefined) ? true : padded;
  if (timeZone == 'UTC'){
    var nowHours = dateObj.getUTCHours();
    var nowMinutes = dateObj.getUTCMinutes() + 1;
    var nowSeconds = dateObj.getUTCSeconds();
  }
  else{
    var nowHours = dateObj.getHours();
    var nowMinutes = dateObj.getMinutes() + 1;
    var nowSeconds = dateObj.getSeconds();
  }
  if (padded){
    nowHours = ('0'+nowHours).slice(-2);
    nowMinutes = ('0'+nowMinutes).slice(-2);
    nowSeconds = ('0'+nowSeconds).slice(-2);
  }
  var nowFullTime = nowHours+divider+nowMinutes+divider+nowSeconds;
  return nowFullTime;
}

// preloading images
function myLoadImages(index, stimPath, imgList, afterFunc){
  if(index >= imgList.length){
    return;
    }
  var image = new Image();
  if(index < imgList.length-1){
    image.onload = function(){
      myLoadImages(index+1,stimPath,imgList,afterFunc);
    };
  }
  else{
    image.onload = afterFunc;
  }
  image.src = stimPath+imgList[index];
}

// preloading audio files
function myLoadSounds(index, stimPath, soundList, afterFunc){
  if(index >= soundList.length){
    return;
  }
  var sound = new Audio();
  if(index < soundList.length-1){
    sound.oncanplaythrough = function(){
      myLoadSounds(index+1,stimPath,soundList,afterFunc);
    };
  }
  else{
    sound.oncanplaythrough = afterFunc;
  }
  sound.src = stimPath+soundList[index];
}

// converting angle (degrees) to angle (radians)
function myToRadians(degrees) {
  return degrees*Math.PI/180;
}

// converting polar coordinates to Cartesian coodinates
function myPolarToCartesian(r, theta){
  return [r*Math.cos(myToRadians(theta)),r*Math.sin(myToRadians(theta))];
}

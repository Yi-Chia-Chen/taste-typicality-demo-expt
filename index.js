// Yi-Chia Chen

// trial variables for demo
var headphonePracN = 1;
var headphoneTrialN = 2;
var headphonePassN = 0;
var pracList = myShuffleArray([21,22]); // practice trial list
var pracTrialN = pracList.length; // 2
var repeatTrialN = 1;
var stimList = myShuffleArray(myRange(101,103));
var repeatList = stimList.slice();
repeatList = myShuffleArray(repeatList).splice(0,repeatTrialN);
stimList = repeatList.concat(stimList); // trial list -- the trials are popped from the end of array so the repeats are in the beginning
var trialN = stimList.length;
var instrTrialN = pracTrialN + trialN;

// duration variables (in seconds)
var ITI = 0.5;
var ISI = 0.5; // ISI for the headphone test
var vDuration = 2.0;
var intervalD = 50; // trial() refresh interval in milliseconds

// object variables
var instr, subj, testTrial, trial;

// preload images
var stimPath = 'Stimuli/';
var imgsrc = ['blank.jpg', '21.jpg', '22.jpg', '101.jpg', '102.jpg']
// preload sounds
var audsrc = ['q.mp3', 'o.mp3', 'a.mp3', 'calibrationNoise.mp3', '21.mp3', '22.mp3', '101.mp3', '102.mp3']

/*
██████  ███████  █████  ██████  ██    ██
██   ██ ██      ██   ██ ██   ██  ██  ██
██████  █████   ███████ ██   ██   ████
██   ██ ██      ██   ██ ██   ██    ██
██   ██ ███████ ██   ██ ██████     ██
*/

$(document).ready(function(){
    myLoadImages(0,stimPath,imgsrc,callbackForSounds); // loading audio files after loading images

    function callbackForSounds(){
      myLoadSounds(0,stimPath,audsrc,stimLoaded); // execute stimLoaded function after audio files are loaded
    }
    subj = new subjObject();
    startInstr();
});

/*
███████ ██    ██ ██████       ██ ███████  ██████ ████████
██      ██    ██ ██   ██      ██ ██      ██         ██
███████ ██    ██ ██████       ██ █████   ██         ██
     ██ ██    ██ ██   ██ ██   ██ ██      ██         ██
███████  ██████  ██████   █████  ███████  ██████    ██
*/

class subjObject{
    constructor(){
        this.blockOrder = ['V', 'A'];
    }

    submitQ(){
        this.problems = $('#problems').val();
        this.dailyAesV = $('input[name=QDailyV]:checked').val();
        this.dailyAesA = $('input[name=QDailyA]:checked').val();
        this.serious = $('input[name=QSerious]:checked').val();
        if (this.problems == '' || typeof this.serious === 'undefined' || typeof this.dailyAesV === 'undefined' || typeof this.dailyAesA === 'undefined'){
            alert('Please answer all questions to complete the experiment. Thank you!');
        }
        else{
            $('#questions').hide();
            $('#debriefing').show();
        }
    }
}

/*
██ ███    ██ ███████ ████████ ██████  ██    ██  ██████ ████████ ██  ██████  ███    ██ ███████
██ ████   ██ ██         ██    ██   ██ ██    ██ ██         ██    ██ ██    ██ ████   ██ ██
██ ██ ██  ██ ███████    ██    ██████  ██    ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██ ██  ██ ██      ██    ██    ██   ██ ██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
██ ██   ████ ███████    ██    ██   ██  ██████   ██████    ██    ██  ██████  ██   ████ ███████
*/

class instrObject{
  constructor(){
    this.index = 0;
    this.firstBlock = subj.blockOrder[0];
    this.block = 'calibration';
    this.qAttempt = 1;
    this.calibration = new Array;
    this.calibration[0] = 'Thank you for participating! In the next few pages, we are going to walk you through the instructions.<br /><br />Please refrain from using the refresh or back buttons, as you may be locked out from completing the experiment.<br /><br />Also, please put your headphones on now (and make sure you can hear sounds from both ears). You must wear your headphones throughout this experiment. This experiment will take about 25-30 minutes to complete.';
    this.calibration[1] = 'Please maximize the size of your browser window to make sure you can see the whole experiment. Also, please set your computer volume to about 10% of maximum and make sure the audio device is not muted.';
    this.calibration[2] = "On the next page we will play a calibration sound. Please adjust the volume so that the sound is at a loud but comfortable level. Press 'Next' when you are ready.";

    this.test = new Array;
    this.test[0] = "Now, we would like to run a very simple test before the actual experiment to make sure your device is working with our webpages.<br /><br />A play button will appear on the next page. When you hit the button, you will hear three sounds separated by silences. We would like you to simply judge which sound was the SOFTEST (quietest) -- the first, second, or the third one.<br /><br /><b>Note that the sounds can only be played once.</b> Please press the play button only when you are ready. You may press the 'Next' button to start.";

    this.vFirst = new Array;
    this.vFirst[0] = "[We did not check for accuracy in this demo.] You've completed the device testing. We will now start the main experiment.<br /><br />Please read all the instructions carefully. You will be asked about the content of them later.<br /><br /><b>Incorrect answers will lengthen the time you need to complete this experiment.<br /><br />";
    this.vFirst[1] = 'There are two parts in this experiment. Each part will take about 6 minutes. We will walk you through the instructions for the first part and explain the rest when you are done with the first part.';
    this.vFirst[2] = 'In the first part of the experiment, you will be shown ' + instrTrialN + " pictures, one at a time, for 2 seconds each. We are interested in how <b>visually appealing</b> you find each picture to be. <br /><br />In other words, how good/beautiful do you think the picture looks?<br /><br />For each picture, use the mouse to click on one of the options from 1 to 6 to rate how visually appealing you find that picture to be -- where '6' indicates that you find it very visually appealing, and '1' indicates that you find it very not visually appealing.";
    this.vFirst[3] = 'You might sometimes find that you like a picture because of its meaning or the subject it depicts (e.g. that it contains a cat, if you like cats) -- but what we are really asking about is just how <i><b>visually</b></i> appealing you think it is.<br /><br />(As a result, a picture of a cat could nevertheless look dull to you even if you like cats, while a picture of a boring object -- such as a piece of concrete -- could nevertheless look quite visually appealing.)<br /><br /><b>Please try your best not to consider the meaning of the pictures, and just to evaluate how visually appealing each one is.</b>';
    this.vFirst[4] = 'On the next page, we will ask you a question about the instructions.';

    this.vFirst[5] = 'Thank you! You have completed the first part of the experiment!<br /><br />In the second part, you will listen to ' + instrTrialN + ' environmental sounds that are 2 seconds long, one at a time. We are interested in how <b>aurally appealing</b> you find each sound to be. You will rate the sound from 1 to 6 in the same way as the first part.<br /><br />Again, you might sometimes find that you like a sound because of its meaning or the object that would make the sound -- but what we are really asking about is just how <i><b>aurally</b></i> appealing you think the sound is.';
    this.vFirst[6] = "Please press the 'Next' button to start when you're ready. Again, please do not interrupt the task after you start (e.g. by switching to other windows or tabs on your computer). This part will take about 6 minutes to complete.";

    this.aFirst = new Array;
    this.aFirst[0] = this.vFirst[0];
    this.aFirst[1] = this.vFirst[1];
    this.aFirst[2] = 'In the first part of the experiment, You will listen to ' + instrTrialN + " environmental sounds that are 2 seconds long, one at a time. We are interested in how <b>aurally appealing</b> you find each sound to be.<br /><br />In other words, how good/beautiful do you think the sound sounds?<br /><br />For each sound, use the mouse to click on one of the options from 1 to 6 to rate how aurally appealing you find that sound to be -- where '6' indicates that you find it very aurally appealing, and '1' indicates that you find it very not aurally appealing.";
    this.aFirst[3] = 'You might sometimes find that you like a sound because of its meaning or the object that would make that sound (e.g. that it is the sound a cat, and you like cat) -- but what we are really asking about is just how <i><b>aurally</b></i> appealing you think it is.<br /><br />(As a result, sounds of a cat could nevertheless sound dull to you even if you like cats, while the sound from a boring object -- such as a pen -- could nevertheless sound quite aurally appealing.)<br /><br /><b>Please try your best not to consider the meaning of the sounds, and just to evaluate how aurally appealing each one is.</b>';
    this.aFirst[4] = this.vFirst[4];

    this.aFirst[5] = 'Thank you! You have completed the first part of the experiment!<br /><br />In the second part, you will be shown ' + instrTrialN + ' pictures, one at a time, for 2 seconds each. We are interested in how <b>visually appealing</b> you find each picture to be. You will rate the pictures from 1 to 6 in the same way as the first part.<br /><br />Again, you might sometimes find that you like a picture because of its meaning or the subject it depicts -- but what we are really asking about is just how <i><b>visually</b></i> appealing you think the picture is.';
    this.aFirst[6] = this.vFirst[6];
  }

  next(){
    this.index += 1;

    if(this.block == 'calibration'){
      this.list = this.calibration;
    }
    else if(this.block == 'test'){
      this.list = this.test;
    }
    else if(this.firstBlock == 'V'){
      this.list = this.vFirst;
    }
    else{
      this.list = this.aFirst;
    }

    if (this.index < this.list.length){
      $('#instrText').html(this.list[this.index]);
    }

    if (this.block=='calibration' && this.index==this.list.length){
      calibrationStarts();
    }
    else if (this.block=='test' && this.index==this.list.length){
      testStarts();
    }
    else if (this.block=='V' && this.index==5){
      this.QVStarts();
    }
    else if (this.block=='A' && this.index==5){
      this.QAStarts();
    }
    else if ( (this.block=='V' || this.block=='A') && this.index==this.list.length ){
      secondBlockStarts();
    }
  }

  QVStarts(){
    $('#instrBox').hide();
    $('#instrQV').show();
  }

  QAStarts(){
    $('#instrBox').hide();
    $('#instrQA').show();
  }

  submitQ(){
    if (this.block == 'V'){
      var instrQChoice = $('input[name=QPreInstrV]:checked').val();
    }
    else{
      var instrQChoice = $('input[name=QPreInstrA]:checked').val();
    }

    if (typeof instrQChoice === 'undefined'){
      alert('Please answer the question to start the experiment. Thank you!');
    }
    else if (instrQChoice != 'Appeal'){
      this.qAttempt += 1;
      $('#instrText').html('You have given an incorrect answer. Please read the instructions again carefully.');
      $('#instrBox').show();
      if (this.block == 'V'){
        $('#instrQV').hide();
        $('input[name=QPreInstrV]:checked').prop('checked', false);
      }
      else{
        $('#instrQA').hide();
        $('input[name=QPreInstrA]:checked').prop('checked', false);
      }
      this.index = 0; // skipping the first page of instructions if they are reading them the second time
    }
    else{
      $('#instrText').html("Great! Please press the button to start when you're ready. (If the button still says 'Loading', just wait a few more seconds for the pictures to load.)<br /><br />After you press the start button, please do not interrupt the task (e.g. by switching to other windows or tabs on your computer) until you are done. This part will take about 5 minutes to complete.");
      $('#nextButton').hide();
      $('#loadButton').show();
      $('#startButton').show();
      if (this.block == 'V'){
        $('#instrQV').hide();
      }
      else{
        $('#instrQA').hide();
      }
      $('#instrBox').show();
    }
  }
}

/*
████████ ███████ ███████ ████████     ████████ ██████  ██  █████  ██
   ██    ██      ██         ██           ██    ██   ██ ██ ██   ██ ██
   ██    █████   ███████    ██           ██    ██████  ██ ███████ ██
   ██    ██           ██    ██           ██    ██   ██ ██ ██   ██ ██
   ██    ███████ ███████    ██           ██    ██   ██ ██ ██   ██ ███████
*/

class testTrialObject{
  constructor(){
    this.trialNo = -headphonePracN;
    this.trialN = headphoneTrialN;
    this.accSum = 0;
    this.stimList = ['a.mp3', 'o.mp3', 'q.mp3'];
  }

  run(){
    this.update();
    $('#testPlaying').show();
    $('#testSound')[0].play();
  }

  update(){
    var that = this;
    this.trialNo++;
    this.soundNo = 0;
    this.stimList = myShuffleArray(this.stimList);
    this.stim = this.stimList[this.soundNo];
    if (this.stim == 'q.mp3'){
      this.answer = this.soundNo+1;
    }
    $('#testSound').attr('src', stimPath+this.stimList[this.soundNo]);

    $('#testSound')[0].onended = function(){
      that.soundNo += 1;
      that.stim = that.stimList[that.soundNo];
      if (that.stim == 'q.mp3'){
        that.answer = that.soundNo+1;
      }
      $('#testSound').attr('src', stimPath+that.stim);
      setTimeout(function(){$('#testSound')[0].play();}, ISI*1000);
      if (that.soundNo == 2){
        $('#testSound')[0].onended = function(){
          $('#testResp').show();
          $('#testPlaying').hide();
        };
      }
    };
  }

  next(){
    var that = this;
    this.resp = $('input[name=testOption]:checked').val();
    if (typeof this.resp === 'undefined'){
      alert('Please respond to continue.');
    }
    else{
      $('input[name=testOption]:checked').prop('checked', false);
      $('#testResp').hide();
      if (this.trialNo > 0){
        this.acc = (this.answer == this.resp) ? 1 : 0;
        this.accSum += this.acc;
      }
      if (this.trialNo < this.trialN){
        this.run();
      }
      else{
        instrStarts();
      }
    }
  }
}

/*
████████ ██████  ██  █████  ██
   ██    ██   ██ ██ ██   ██ ██
   ██    ██████  ██ ███████ ██
   ██    ██   ██ ██ ██   ██ ██
   ██    ██   ██ ██ ██   ██ ███████
*/

class trialObject{
  constructor(){
    this.block = subj.blockOrder[0];
    this.blockNo = 1;
    this.trialNo = -pracTrialN;
    this.trialN = trialN;
    this.list = stimList.slice();
    this.pracList = pracList.slice();
  }

  run(){
    var that = this;
    this.update();

    var startStim = function(){
      if (that.block == 'V'){ // visual preference block
        $('#aesImg').show();
        var startTime = Date.now();
        $('.ratingButton').mouseup(function(){
          $('.ratingButton').unbind('mouseup');
          clearInterval(that.intervalId);
          $('#aesImg').hide();
          that.end();
        });

        var vPresentation = function(){
          var currentTime = Date.now();
        	var currentD = (currentTime - startTime)/1000; // in second
          if(currentD > vDuration){
            $('#aesImg').hide();
            clearInterval(that.intervalId);
          }
        };

        that.intervalId = window.setInterval(vPresentation,intervalD); // update progress every intervalD ms
      }
      else{ // auditory preference block
        $('#audioStuff').show();
        $('#aesAud')[0].play();
      }
    };

    setTimeout(startStim, ITI*1000);
  }

  hideAud(){
    $('#audioStuff').hide();
    var that = this;
    $('.ratingButton').mouseup(function(){
      $('.ratingButton').unbind('mouseup');
      $('.ratingButton').hide();
      $('.rLabels').hide();
      $('#audioStuff').hide();
      that.end();
    });

    $('.ratingButton').show();
    $('.rLabels').show();
  }

  nextBlock(){
    this.block =  subj.blockOrder[1];
    this.blockNo = 2;
    this.trialNo = -pracTrialN;
    this.list = stimList.slice();
    this.pracList = pracList.slice();
  }

  update(){
    this.trialNo++;
    if (this.trialNo > 0){
      this.stimName = this.list.pop();
      this.stimBuffer = this.list[this.list.length-1];
    }
    else{
      this.stimName = this.pracList.pop();
      this.stimBuffer = this.pracList[this.pracList.length-1];
    }
    if (this.block == 'V'){
      $('#aesImg').attr('src', stimPath+this.stimName+'.jpg');
      $('#bufferImg').attr('src', stimPath+this.stimBuffer+'.jpg');
    }
    else{
      $('#aesAud').attr('src', stimPath+this.stimName+'.mp3');
    }
  }

  end(){
    if (this.trialNo < this.trialN){
      this.run();
    }
    else{
      if (this.blockNo == 2){
        debriefingStarts();
      }
      else{
        showSecondInstr();
      }
    }
  }
}

/*
 ██████  ████████ ██   ██ ███████ ██████      ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
██    ██    ██    ██   ██ ██      ██   ██     ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
██    ██    ██    ███████ █████   ██████      █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██    ██    ██    ██   ██ ██      ██   ██     ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
 ██████     ██    ██   ██ ███████ ██   ██     ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
*/

function startInstr(){
  instr = new instrObject();
  $('#instrText').html(instr.calibration[0]);
  $('#instrBox').show();
}

function stimLoaded(){
  $('#loadButton').prop('id', 'startButton');
  $('#startButton').html('Start!');
  $('#startButton').click(clearForExpt);
}

function calibrationStarts(){
  $('#instrBox').hide();
  $('#calibration').show();
  $('#calibrationSound')[0].play();
}

function playCalibrationSound(){
  $('#calibrationSound')[0].play();
}

function calibrationDone(){
  $('#calibrationSound')[0].pause();
  instr.index = 0;
  instr.block = 'test';
  $('#instrText').html(instr.test[0]);
  $('#instrBox').show();
  $('#calibration').hide();
}

function testStarts(){
  $('#instrBox').hide();
  $('#test').show();
  testTrial = new testTrialObject();
  testTrial.run();
}

function instrStarts(){
  instr.index = 0;
  instr.block = instr.firstBlock;
  if (instr.block == 'V'){
    $('#instrText').html(instr.vFirst[0]);
  }
  else{
    $('#instrText').html(instr.aFirst[0]);
  }
  $('#test').hide();
  $('#instrBox').show();
}

function clearForExpt(){
  $('#instrBox').hide();
  $('#startButton').hide();
  $('#nextButton').show();
  $('#stimBox').show();
  trial = new trialObject();
  if (trial.block == 'A'){
    $('.ratingButton').hide();
    $('.rLabels').hide();
  }
  trial.run();
}

function showSecondInstr(){
  $('#stimBox').hide();
  if(trial.block == 'V'){
    instr.block = 'A';
    $('#instrText').html(instr.vFirst[5]);
  }
  else{
    instr.block = 'V';
    $('#instrText').html(instr.aFirst[5]);
  }
  $('#instrBox').show();
}

function secondBlockStarts(){
  $('#instrBox').hide();
  $('#stimBox').show();
  trial.nextBlock();
  if (trial.block == 'A'){
    $('.ratingButton').hide();
    $('.rLabels').hide();
  }
  else{
    $('.ratingButton').show();
    $('.rLabels').show();
  }
  trial.run();
}

function debriefingStarts(){
  $('#stimBox').hide();
  $('#questions').show();
}

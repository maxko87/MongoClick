import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var userPassRegex = '[^:@/\\]+'

function mongoStringToParams(mongoString){
  // var mongoString = "mongodb://user:pass@domain:123/db";
  var regex = /^mongodb:\/\/([^:@/\\]+):([^:@/\\]+)@([A-Za-z0-9\-_\.]+):(\d+)\/([^:@/\\]+)$/;
  var match = mongoString.match(regex);
  if ( match ){
    var user = match[1];
    var pass = match[2];
    var domain = match[3];
    var port = match[4];
    var db = match[5];
    mongoParams = "mongo " + domain + ":" + port + "/" + db + " -u " + user + " -p " + pass;
  }
  else {
    mongoParams = null;
  }
  return mongoParams;
}

function mongoParamsToString(mongoParams){
  //var mongoParams = "mongo domain:123/dbname -u user -p pass"
  var regex = /^\s*mongo\s+([A-Za-z0-9\-_\.]+):(\d+)\/([^:@/\\]+)\s+(?:-u|--username)\s+([^:@/\\]+)\s+(?:-p|--password)\s+([^:@/\\]+)\s*$/;
  var match = mongoParams.match(regex);
  if ( match ){
    var domain = match[1];
    var port = match[2];
    var db = match[3];
    var user = match[4];
    var pass = match[5];
    mongoString = "mongodb://" + user + ":" + pass + "@" + domain + ":" + port + "/" + db;
  }
  else {
    mongoString = null;
  }
  return mongoString;
}

function convertInput(){
  var input = $('#main-input').val();
  var mongoString = mongoParamsToString(input);
  if (mongoString){
    $('#main-output').text(mongoString);
    return;
  }
  var mongoParams = mongoStringToParams(input);
  if (mongoParams){
    $('#main-output').text(mongoParams);
    return
  }
  $('#main-output').text("Invalid Mongo URI or params.");
  return
}

$('#main-input').on('paste', function () {
  setTimeout(function(){
    convertInput()
  }, 1);
});

Template.Main.events({
  'keyup #main-input'(event, instance) {
    convertInput()
  },
});

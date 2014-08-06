/*
 *  Copyright Ganapathi Kamath (2014)
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var SpeakService = function() {

    this.initialize = function() {
      // No Initialization required
      var fta=function(){
        var u= new SpeechSynthesisUtterance();
        u.text = "Time aware.";
        u.lang = 'en-US';
        speechSynthesis.speak(u);
      }
      window.setTimeout(fta,500);

      this.timerlastfire=[];
      this.timer_var1=[];
      this.timer_var2=[];
      this.set_spkstate(false);

      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    }
    this.set_spkstate=function(b){
      this.spkstate=b;
      if (b){
        //window.clearInterval(this.timer_var2);
        //this.timer_var2=window.setInterval(this.timer_main, 60000);
        this.timer_to_0();
      }else{
        window.clearTimeout(this.timer_var1);
        window.clearInterval(this.timer_var2);
      }
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    }
    this.timer_to_0=function(){
        var d=new Date();
        var s=d.getSeconds();
        var s2=60-s;
        //console.log('seconds to 0: ' +s2);
        window.clearTimeout(this.timer_var1);
        window.clearInterval(this.timer_var2);
        this.timer_var1=window.setTimeout(this.timer_firsthop,s2*1000);
    }
    this.timer_firsthop=function(){
      var d= new Date(); // first record time.
      var s = d.getSeconds();
      //console.log("timer fired type-1: " + s) ;
      app.speakservice.timerlastfire=d;
      // this type fires as a one time thing correcting for seconds alignment
      if ( app.speakservice.spkstate == false ) {
        return;
      }
      // set the interval timer
      window.clearTimeout(app.speakservice.timer_var1);
      window.clearInterval(app.speakservice.timer_var2);
      //app.speakservice.timer_var2=window.setInterval(app.speakservice.timer_main, 60000);
     
      app.speakservice.speakit();
      app.speakservice.timer_to_0(); // forget about the interval timer, always use the first hope timer
      return;
    }
    this.timer_main=function(){
      var d= new Date(); // first record time.
      var s = d.getSeconds();
      //console.log("timer fired type-2: " + s) ;
      app.speakservice.timerlastfire=d;
      if ( app.speakservice.spkstate == false ) {
        app.speakservice.set_spkstate(false);
        return;
      }
      app.speakservice.speakit();
      // check for drift
      if (s>10) {
        // too much timer drift , correct it
        app.speakservice.set_spkstate(true);
      }
      return;
    }
    this.speakit= function() {
      d= new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      //var mu = m % 10;
      //var mt = Math.floor(m / 10);
      var lstr=SpeakMgr.CollectT(m);
      var ohstr='';
      if (m<10) ohstr= 'o-';
      h=((h+12-1)%12)+1;
      var tstr= "" + h + " " + ohstr + m ;
      //console.log(tstr);
      var u= new SpeechSynthesisUtterance();
      // say them
      var re = /%t/
      for(var i=0; i<lstr.length; i++){
           u.text = lstr[i].replace(re,tstr);
           u.lang = 'en-US';
           speechSynthesis.speak(u);
      }
      return;
    }

    this.findById = function(id) {
        var deferred = $.Deferred();
        var employee = null;
        var l = employees.length;
        for (var i=0; i < l; i++) {
            if (employees[i].id === id) {
                employee = employees[i];
                break;
            }
        }
        deferred.resolve(employee);
        return deferred.promise();
    }

    this.findByName = function(searchKey) {
        var deferred = $.Deferred();
        var results = employees.filter(function(element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        deferred.resolve(results);
        return deferred.promise();
    }


}

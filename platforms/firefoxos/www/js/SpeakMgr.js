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

//var ganasoft = ganasoft || {};

// // note the use of namespacing - similar to jQuery.
SpeakMgr = (function () {
    'use strict';

    // [ private properties ]
    // note the chaining of var declarations vs a var on each line
    var SpeakItems   = []; 
    // end var

    // [ private methods ]
    // note the use of literal patterns vs constructor functions
    var makeitem=function(benabled, name, phrase, tarr){
      var tvect=[];
      if ( tarr.length < 60 ) {
        tvect=retminvect(tarr); 
      } else {
        tvect=tarr;
      }
      return {benabled:benabled , name:name, phrase:phrase, tvect:tvect };
    };
    var retminvect=function(tarr){
      var tvect=[]
      for(var n=0; n<60 ; n++) tvect[n]=false;
      for(var m=0; m<tarr.length ; m++){
        if (tarr[m]>=0 && tarr[m]<60){
          tvect[tarr[m]]=true;
        }
      }
      return tvect;
    };
    // [ public methods ]
    return {
init: function () {
        SpeakItems = [];
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
      },
ItemAdd: function () {
           // add an item to the end
           var si=[];
           if ( arguments.length == 1 ){
             si=arguments[0];
             SpeakItems.push(si);
           }else{
             si=makeitem(arguments[0],arguments[1],arguments[2],arguments[3] );
             SpeakItems.push(si);
           }
           return SpeakItems.length;
         },
ItemDelete: function(n){ 
              // delete n th item (remember zero base)
              if (n<SpeakItems.length && n>=0){
                SpeakItems.splice(n,1); 
              }
              return SpeakItems.length;
            },
ItemSwap: function(n,m){
            if (n<SpeakItems.length && n>=0 && m<SpeakItems.length && m>=0){
              t=SpeakItems[n];
              SpeakItems[n]=SpeakItems[m];
              SpeakItems[m]=t;
            }
            return ;
          },
CollectT: function(n) {
            var arr=[];
            for(var i=0; i<SpeakItems.length ; i++){
              if (SpeakItems[i].benabled && SpeakItems[i].tvect[n]){
                arr.push(SpeakItems[i].phrase)
              }
            }
            return arr;
          },
Length: function(){
           return SpeakItems.length;
         },
Dump: function(){
           return SpeakItems;
         },
Load: function(sis){
           SpeakItems=sis;
           return ;
         },
FindByName: function(str){
           var i;
           for(var i=0; i < SpeakItems.length ; i++){
             if (SpeakItems[i].name == str) {
               return i;
               break;
             }
           }
           return -1;
         },
ItemNew: function(){
           var si;
           si=makeitem(false,"","", [] );
           return si;
         },
ItemGet: function(n){
           if (n<SpeakItems.length && n>=0){
             return SpeakItems[n];
           }
           return;
         },
ItemSet: function(n,si){
           if (n<SpeakItems.length && n>=0){
             SpeakItems[n]=si;
           }
           return ;
         }
 
      // [define other public properties here]
    };
}()); // make a list of a single anonymous function, call it

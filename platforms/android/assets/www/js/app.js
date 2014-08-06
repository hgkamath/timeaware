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
var app = {
    /* ---------------------------------- Local Variables ---------------------------------- */
    // Application Constructor
    preinit: function() {
        console.log('starting preinit');

        this.bindEvents(); // wait for device ready
    },  
    initialize: function() {
        console.log('Initializing');
        this.speakservice = new SpeakService();
        this.speakservice.initialize();

        SpeakMgr.init();
        //this.new_conf();
        //this.dummy_conf();
        this.load_conf();

        // compile the templates
        SpeakTableView.prototype.template = Handlebars.compile($("#phrase-list-tpl").html()); 
        SpeakEditView.prototype.template = Handlebars.compile($("#phrase-edit-tpl").html()); 
        DeleteConfirmView.prototype.template = Handlebars.compile($("#delete-confirm-tpl").html()); 
        TimeAwareView.prototype.template = Handlebars.compile($("#time-aware-tpl").html()); 

        //SpeakMgr.init().done(function () {
        //});

        // Show the home view
        $('body').html(new SpeakTableView(SpeakMgr.Dump()).render().$el);

        // setup some routing
        router.addRoute('home', function() {
           $('body').html(new SpeakTableView(SpeakMgr.Dump()).render().$el);
           app.homebindEvents();
           app.speakservice.set_spkstate(false);
           //console.log("back to home screen");
        });
        router.addRoute('speakitem/:id', function(id) {
           idn=parseInt(id,10);
           var searg={additem:false, itemno:idn, title:"Edit Item", si:SpeakMgr.Dump()[idn] };
           $('body').html(new SpeakEditView(searg).render().$el);
           //console.log("edit an id:" + id);
        });
        router.addRoute('itemadd', function() {
           var searg={additem:true, itemno:SpeakMgr.Length(), title:"New Item", si:SpeakMgr.ItemNew() };
           $('body').html(new SpeakEditView(searg).render().$el);
           //console.log("edit item screen for new item");
        });
        router.addRoute('editsubmit', function(postdata) {
           app.edititemsubmit();
           //console.log("add item and then back to home screen");
           router.load('#home');
        });
        router.addRoute('itemdeleteconfirm/:id', function(id) {
           idn=parseInt(id,10);
           var searg={additem:false, itemno:idn, title:"Confirm Delete", si:SpeakMgr.Dump()[idn] };
           $('body').html(new DeleteConfirmView(searg).render().$el);
           //console.log("confirm delete view");
        });
        router.addRoute('itemdelete/:id', function(id) {
           idn=parseInt(id,10);
           alert('item deleted');
           SpeakMgr.ItemDelete(idn);
           app.save_conf();
           //console.log("deleting");
           router.load('#home');
        });
        router.addRoute('itempurge', function() {
           app.new_conf();
           router.load('#home');
        });
        router.addRoute('itemdummy', function() {
           app.dummy_conf();
           router.load('#home');
        });
        router.addRoute('itemtoggle/:id', function() {
           idn=parseInt(id,10);
           var si;
           si=SpeakMgr.ItemGet(idn);
           si.benabled=!si.benabled;
           SpeakMgr.ItemSet(idn);
           app.save_conf();
           router.load('#home');
        });
        router.addRoute('timeaware', function() {
           var searg={};
           $('body').html(new TimeAwareView(searg).render().$el);
           //cordova plugin add de.appplant.cordova.plugin.local-notification
           //window.plugin.notification.local.add({ message: 'Great app!' });
           app.speakservice.speakit();
           app.speakservice.set_spkstate(true);
           //console.log("Time Aware View");
        });
        // cordova plugin add de.appplant.cordova.plugin.background-mode
        window.plugin.backgroundMode.enable();
        this.homebindEvents();
        console.log("app startup over");

    },
    /* --------------------------------- Event Registration -------------------------------- */
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    homebindEvents: function() {
        var l1=document.querySelectorAll('div.toggle');
        for (var i=0; i<l1.length ; i++) {
          l1[i].addEventListener('toggle', this.toggleenable.bind(l1[i]), false);
        }
        //$('.search-key').on('keyup', findByName);
        //$('.help-btn').on('click', function() {
        //alert("Speak Table v1.0.0");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received deviceready: ');
        FastClick.attach(document.body);
        app.initialize();
    },
    //app.receivedEvent('deviceready');
    // Update DOM on a Received Event
    //receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/
        //console.log('Received Event: ' + id);
    //},
    edititemsubmit: function(){
      //console.log("submit pressed");
      var allInputs = $( ":input" );
      var values = {};
      values.rtvect=[];
      allInputs.each(function() {
          if ( this.name === "rtvect") {
            values['rtvect'][parseInt($(this).val(),10)]=$(this).prop('checked');
          } else {
            values[this.name] = $(this).val();
          }
      });
      var si=SpeakMgr.ItemNew();
      values.ritemno=parseInt(values.ritemno,10);
      si.benabled=(values.rbenabled==='true');
      si.name=values.rname;
      si.phrase=values.rphrase;
      si.tvect=values.rtvect;
      /*console.log(values.ritemno);
      console.log(si.benabled);
      console.log(si.name);
      console.log(si.phrase);
      console.log(si.tvect);*/
      if (values.ritemno == SpeakMgr.Length()){
         SpeakMgr.ItemAdd(si);
      }else{
         SpeakMgr.ItemSet(values.ritemno,si);
      }
      router.load('#home');
      app.save_conf();
    },
    toggleenable: function(){
      l1=this;
      var idn=1;
      var si;
     /* var f=function(object) {
            return Object.getOwnPropertyNames(object).filter(function(property) {
                      return typeof object[property] == 'function';
                          });
      };
      //console.log(Object.getOwnPropertyNames(this));*/
      idn=parseInt(this.id.substring(2));
      //console.log(idn);
      si=SpeakMgr.ItemGet(idn);
      si.benabled=!si.benabled;
      SpeakMgr.ItemSet(idn,si);
      app.save_conf();
      return ;
    },
    new_conf: function(){
      var sis;
      //SpeakMgr.Load([]);
      SpeakMgr.init();
      app.save_conf();
      //console.log('new conf')
      return ;
    },
    dummy_conf: function(){
      //SpeakMgr.init();
      SpeakMgr.ItemAdd(true, "Every 2 minutes", "The time is %t.", [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58]);
      SpeakMgr.ItemAdd(false, "Every 5 minutes", "The time is %t.", [0,5,10,15,20,25,30,35,40,45,50,55]);
      SpeakMgr.ItemAdd(false, "Every 10 minutes", "The time is %t.", [0,10,20,30,40,50]);
      SpeakMgr.ItemAdd(false, "Every Quarter", "The time is %t.", [0,15,30,45]);
      SpeakMgr.ItemAdd(true, "Every Hour", "An hour has passed, please record your activities.", [0]);
      app.save_conf();
      return;
    },
    load_conf: function(){
      var sis;
      var o1=localStorage.getItem('SpeakItems');
      if ( o1 == null ) {
        app.new_conf();
        app.dummy_conf();
      }else{
        sis=JSON.parse(o1);
        SpeakMgr.Load(sis);
      }
      return sis;
    },
    save_conf: function(){
      var sis;
      sis=SpeakMgr.Dump();
      localStorage.setItem('SpeakItems', JSON.stringify(sis));
      return;
    },
    say: function(){
       strlist=SpeakMgr.CollectT(n);
       for (i=0; i<str.length; i++) {
       // tts(strlist[i]);
       }
    } /*,
    HomeView:  function(sis) {
      // A SpeakTableView adaptor object contructor function
      var mSpeakTableView;
      this.initialize=function(){
        mSpeakTableView=new SpeakTableView();
        mSpeakTableView.setSpeakItems(sis);
      }
      this.render=function() {
        return mSpeakTableView.render();
      }
      this.initialize();
    }*/
};

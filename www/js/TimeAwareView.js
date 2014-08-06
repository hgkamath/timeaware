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

var TimeAwareView = function (argsis) {

    var augsi;

    this.initialize = function() {
        this.$el = $('<div/>');
        augsi=argsis;
        this.render();
    };

    this.setenv= function(argsis) {
        augsi = argsis;
        this.render();
    }

    this.render = function() {
        this.$el.html(this.template(augsi));
        //this.$el.html("<h1>hello</h1>");
        //console.log(SpeakItems.length);
        //this.$el.html("<h1>hello" + SpeakItems[1].name + "</h1>");
        return this;
    };

    this.initialize();

}

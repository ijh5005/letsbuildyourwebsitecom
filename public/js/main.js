"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', '$timeout', 'navigate', 'data', 'task', 'animation', function($rootScope, $scope, $interval, $timeout, navigate, data, task, animation){
  $rootScope.url = 'yourwebsite.com';
  $rootScope.messageSent = false;
  $rootScope.currentlySendingMessage = false;
  $rootScope.labelMessage = "";
  $rootScope.showLabelLabelMessage = false;
  $rootScope.screenVersion = 'screenVersion3';
  $scope.messageType = 'email';
  $scope.emailStatus = 'selectedSendBtn';
  $scope.textStatus = '';
  $rootScope.homePageAnimationOpen = false;
  $scope.navigationPoints = data.navigationPoints;
  $scope.services = data.services;
  $scope.changeMessageStatusToEmail = () => {
    $scope.messageType = 'email';
    $scope.emailStatus = 'selectedSendBtn';
    $scope.textStatus = '';
  }
  $scope.changeMessageStatusToText = () => {
    $scope.messageType = 'text';
    $scope.emailStatus = '';
    $scope.textStatus = 'selectedSendBtn';
  }
  $scope.bringToTopOfPage = (e, dataValue) => {
    (dataValue === undefined) ? navigate.toTagWithEvent(e) : navigate.toTagWithDataValue(dataValue);
  }
  $scope.sendMessage = () => {
    ($scope.messageType === 'email') ? task.sendMessage('email') : task.sendMessage('text');;
  }
  task.startHomePageAnimation();
  task.watchForTagAnimation();
  $scope.testing = () => {
    animation.toggleHomePageScreen();
  }
}])

app.service('navigate', function(){
  this.toTagWithEvent = (e) => {
    const dataValue = e.currentTarget.attributes.data.nodeValue;
    const selector = $(".textHeading[data=" + dataValue + "]");
    this.navigateTo(selector);
  }
  this.toTagWithDataValue = (dataValue) => {
    const selector = $("div[data=" + dataValue + "]");
    this.navigateTo(selector);
  }
  this.navigateTo = (selector) => {
    const offsetTop = parseInt(selector[0].offsetTop);
    const element = document.getElementById('mainContent');
    element.scrollTop = offsetTop - 140;
  }
});

app.service('data', function(){
  this.navigationPoints = [
    {data: 0, point: 'home'},
    {data: 1, point: 'service'},
    {data: 2, point: 'cost'},
    {data: 3, point: 'example'},
    {data: 4, point: 'contact'}
  ]
  this.services = [
    {service: "website pages", price: "$50 each", description: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added."},
    {service: "payment/shopping cart", price: "$80", description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more."},
    {service: "device friendly layout", price: "$25 each", description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions."},
    {service: "sign in/sign up", price: "$50", description: "Includes a sign in/sgin up forms page."},
    {service: "email notifications", price: "$50", description: "An application to email your customers things such as promotional sales. This feature is a computer and mobile web app. It will not display on your website."},
    {service: "text notifications", price: "$50", description: "An application to text customers things such as appointment reminders and thank you notes. This feature is a computer and mobile web app. It will not display on your website."},
    {service: "page animations", price: "$50", description: "Custom animation to help your website stand out and build a smooth customer experience."},
    {service: "contact and feedback forms", price: "$50", description: "A convenient way for customers to contact you with a feedback form and a contact form on a page of your website."}
  ]
})

app.service('task', function($rootScope, $timeout, $interval, animation, server){
  this.startHomePageAnimation = () => {
    $('.pageContent').hide();
    let stringAmount = 1;
    const $selector = $(".url p");
    const pressEnter = () => {
      $('.urlCircle').css('opacity', 0.6).addClass('urlClicked');
      $timeout(() => {
        $('.urlCircle').css('opacity', 1).removeClass('urlClicked')
      }, 200);
      $timeout(() => {
        $('.pageContent').animate({ opacity: 1 });
      }, 500);
    }
    const typeText = () => {
      const continueTyping = () => {
        stringAmount++;
        $selector.text(text);
        const delay = (Math.floor(Math.random() * 3) + 1) * 100;
        $timeout(() => { typeText() }, delay);
      }
      const text = $rootScope.url.slice(0, stringAmount);
      const atEndOfUrl = (stringAmount === ($rootScope.url.length + 1));
      if(atEndOfUrl){
        pressEnter();
      } else {
        continueTyping();
      }
    }
    $timeout(() => {
      typeText();
    }, 1000);
  }
  this.watchForTagAnimation = () => {
    const watchForAnimation = $interval(() => {
      const positionFromTopOfPage = $('.mainContent').scrollTop();
      if(positionFromTopOfPage > 800){
        $interval.cancel(watchForAnimation);
        animation.tag('.navTag');
      }
    })
  }
  this.sendMessage = (messageType) => {
    if($rootScope.currentlySendingMessage){ return null }
    $rootScope.currentlySendingMessage = true;
    const userName = $("#first").val();
    const userNumber = $("#contact").val();
    const userMessage = $("#message").val();
    const sendObj = { userName: userName, userNumber: userNumber, userMessage: userMessage };
    const hasEmpytField = this.hasEmpytField(sendObj);
    if(hasEmpytField){
      $rootScope.labelMessage = "you must fill out all fields. thanks!";
      $rootScope.showLabelLabelMessage = true;
      $rootScope.currentlySendingMessage = false;
      $timeout(() => { $rootScope.showLabelLabelMessage = false; }, 4000);
      return null;
    }
    const sendEmail = () => {
      animation.sendSignal();
      const url = 'http://localhost:3000/email';
      server.sendEmail(sendObj, url);
    }
    const sendText = () => {
      animation.sendSignal();
      const url = 'http://localhost:3000/text';
      server.sendText(sendObj, url);
    }
    (messageType === 'email') ? sendEmail() : sendText();
  }
  this.hasEmpytField = (obj) => {
    const values = Object.values(obj);
    const hasEmptyField = values.includes("") || values.includes(undefined);
    return hasEmptyField;
  }
})

app.service('animation', function($rootScope, $timeout, $interval){
  this.tag = (selector) => {
    this.fadeIn(selector, 600)
  }
  this.fadeIn = (selector, duration) => {
    const animation = { top: 0, left: 0, right: 0, bottom: 0, opacity: 1 };
    const options = { duration: duration }
    $(selector).animate(animation, options);
  }
  this.sendSignal = () => {
    const selector = [".arrowOne", ".arrowTwo", ".arrowThree"];
    let index = 0;
    $('.screen').css('transform', 'rotateY(0deg)');
    const sendingMessage = $interval(() => {
      if($rootScope.messageSent && (index === 2)){
        $interval.cancel(sendingMessage);
        $('.arrow').css('opacity', 0);
        $rootScope.messageSent = false;
        $rootScope.currentlySendingMessage = false;
        $('.deviceScreen').addClass('messageSent');

        //send label message
        $rootScope.labelMessage = "message sent!";
        $rootScope.showLabelLabelMessage = true;
        $timeout(() => { $rootScope.showLabelLabelMessage = false; }, 4000);

        $timeout(() => {
          $('.screen').css('transform', 'rotateY(90deg)');
          $('.deviceScreen').removeClass('messageSent');
        }, 4000);
      } else {
        (index === selector.length) ? index = 0 : null;
        $('.arrow').css('opacity', 0);
        $(selector[index]).css('opacity', 1);
        index++
      }
    }, 250);
  }
  this.openAnimationPageBody = () => {
    const $selector = $('.animationPagebody');
    $selector.addClass('openPagePast');
    $timeout(() => { $selector.removeClass('openPagePast') }, 1000)
  }
  this.toggleHomePageScreen = () => {
    const firstTurn = ($rootScope.homePageAnimationOpen) ? '-20deg' : '100deg';
    const secondTurn = ($rootScope.homePageAnimationOpen) ? '0deg' : '90deg';
    $('.animationPagebody').css('transform', 'rotateY(' + firstTurn + ')')
    $timeout(() => {
      $('.animationPagebody').css('transform', 'rotateY(' + secondTurn + ')')
      $rootScope.homePageAnimationOpen = !$rootScope.homePageAnimationOpen;
    }, 500);
  }
})

app.service('server', function($rootScope, $http){
  this.sendEmail = (obj, url) => {
    obj.subject = "from customer";
    let sendMessage = "";
    sendMessage += '<style> div { color: #eee;background-color: #333;font-family: "Barlow Semi Condensed", sans-serif;padding: 1em;margin: 0 auto;width: 20em; } p { font-size: 1.2em; } </style>';
    sendMessage += "<div>";
    sendMessage += "<p>name: <span>" + obj.userName + "</span></p>";
    sendMessage += "<p>contact: <span>" + obj.userNumber + "</span></p>";
    sendMessage += "<p>subject: <span>" + obj.subject + "</span></p>";
    sendMessage += "<p>message: </p>";
    sendMessage += "<p>" + obj.userMessage + " </p>";
    sendMessage += "</div>";

    const data = {
      name: obj.name,
      email: 'letsbuildyourwebsite@outlook.com',
      subject: obj.subject,
      message: sendMessage
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = () => {
      $rootScope.messageSent = true;
      console.log('email sent');
    }

    const errorCallback = (err) => {
      console.log(err);
    }
  }
  this.sendText = (obj, url) => {
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    }).then( success => {
              $rootScope.messageSent = true;
              console.log(success.data);
            },
             error => console.log('error sending message') );
  }
})

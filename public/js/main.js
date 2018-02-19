"use strict";

$(document).ready(() => {
  setTimeout(() => {
    $('body').removeClass('opacityZero');
  }, 10)
})

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', '$timeout', 'navigate', 'data', 'task', 'animation', 'server', function($rootScope, $scope, $interval, $timeout, navigate, data, task, animation, server){
  $rootScope.isSmallScreen = false;
  $rootScope.isBigScreen = false;
  $rootScope.name = null;
  $rootScope.url = 'yourwebsite.com';
  $rootScope.messageSent = false;
  $rootScope.currentlySendingMessage = false;
  $rootScope.labelMessage = "";
  $rootScope.showLabelLabelMessage = false;
  $rootScope.screenVersion = 'screenVersion1';
  $rootScope.doneTyping = true;
  $rootScope.typeAnimationOne = data.typeAnimationOne;
  $rootScope.typeAnimationTwo = data.typeAnimationTwo;
  $rootScope.typeAnimationThree = data.typeAnimationThree;
  $rootScope.typeAnimationFour = data.typeAnimationFour;
  $rootScope.messageFailed = false;
  $rootScope.successfullyLoggedIn = false;
  $scope.messageType = 'email';
  $scope.emailStatus = 'selectedSendBtn';
  $scope.textStatus = '';
  $scope.logo = 'YOUR LOGO';
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
  $scope.showServicesSection = () => {
    task.showServicesSection();
  }
  $scope.showPricingMeSection = () => {
    task.showPricingMeSection();
  }
  $scope.showContactCustomerSection = () => {
    task.showContactCustomerSection();
  }
  $scope.showSignUpSection = () => {
    task.showSignUpSection();
  }
  $scope.showContactMeSection = () => {
    task.showContactMeSection();
  }
  $rootScope.currentSignPage = 'signup';
  $scope.signin = () => {
    $scope.bringToTopOfPage(null, 'home');
    task.signin('signin');
  }
  $scope.signup = () => {
    $scope.bringToTopOfPage(null, 'home');
    task.signin('signup');
  }
  $scope.signInSubmit = () => {
    //get input field values
    const username = $('.signInUsername').val();
    const password = $('.signInPassword').val();
    const url = "/login";
    const signInObj = { username: username, password: password }
    //check for complete form
    const hasEmptyField = task.hasEmptyFieldCheck(signInObj);
    if(hasEmptyField){
      $(".signFormMessage p").text("Please fill in all fields. Thanks!");
      $('.signFormMessage').fadeIn();
      return null;
    }
    //send login request
    server.loginRequest(signInObj, url);

    //watch for login callback
    const checkForLogIn = $interval(function () {
      //successfullyLoggedIn === true after logged in
      if(!$rootScope.successfullyLoggedIn){ return null }
      //cancel when logged in and proceed
      $interval.cancel(checkForLogIn);
      task.startHomePageAnimation();
      $scope.logo = $rootScope.name + ' LOGO';
      //Do stuff when logged in
      task.hideSignIn();
    }, 10);
  }
  $scope.signUpSubmit = () => {
    //get input field values
    const firstname = $('.signUpFirstname').val();
    const lastname = $('.signUpLastname').val();
    const username = $('.signUpUsername').val();
    const password = $('.signUpPassword').val();
    const url = "/register";
    const signUpObj = { firstname: firstname, lastname: lastname, username: username, password: password }
    //check for complete form
    const hasEmptyField = task.hasEmptyFieldCheck(signUpObj);
    if(hasEmptyField){
      $(".signFormMessage p").text("Please fill in all fields. Thanks!");
      $('.signFormMessage').css('opacity', 1);
      $timeout(() => {
        $('.signFormMessage').css('opacity', 0);
      }, 6000);
    } else {
      //send sign up request
      server.register(signUpObj, url);
    }
  }
  $scope.hideSignIn = () => {
    task.hideSignIn();
  }

  animation.sideBar();
  animation.tableOnSmallScreen();
  task.startHomePageAnimation();
  task.watchForTableAnimation();
  task.hideSections();
  task.watchForContentAnimation();
  task.watchForFailedMessage();
  task.screenCheck();
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
    {data: 3, point: 'tips'},
    {data: 4, point: 'contact'}
  ]
  this.services = [
    {service: "website pages", price: "$50 each", description: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added."},
    {service: "dashboard", price: "$80", description: "With the dashboard, you can edit content on your website, edit existing product information, and add additional products at the click of a button. This is a computer application."},
    {service: "shopping cart", price: "$80", description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more."},
    {service: "device friendly layout", price: "$25 each", description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions."},
    {service: "sign in/sign up", price: "$50", description: "Includes a sign in/sign up forms page linked to a database that stores usernames and passwords."},
    {service: "email notifications", price: "$50", description: "An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website."},
    {service: "text notifications", price: "$50", description: "An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website."},
    {service: "page animations", price: "$50", description: "Custom animation to help your website stand out and build a smooth customer experience."},
    {service: "contact form", price: "25", description: "This form is a convenient way for customers to contact you. This form will be on a page of your website."},
    {service: "feedback form", price: "25", description: "This form is a convenient way for customers to leave feedback. This form will be on a page of your website."}
  ]
  this.typeAnimationOne = {
    one: '<div class="pageContent page2ImgBottom flexRow">',
    two: '<div class="page2Blocks"></div>',
    three: '<div class="page2Blocks"></div>',
    four: '<div class="page2Blocks"></div>',
    five: '</div>'
  },
  this.typeAnimationTwo = {
    one: '.page3Blocks {',
    two: 'background-color: #2d3143;',
    three: 'height: 100%;',
    four: 'width: 50%;',
    five: '}'
  },
  this.typeAnimationThree = {
    one: 'blah blah blah',
    two: 'blah blah blah blah',
    three: 'blah blah blah blah',
    four: 'blah blah blah blah',
    five: 'blah blah blah'
  }
})

app.service('task', function($rootScope, $timeout, $interval, animation, server){
  this.screenCheck = () => {
    $interval(() => {
      const isSmall = $('.table').css('transition').includes('small');
      $rootScope.isSmallScreen = (isSmall) ? true : false;
      $rootScope.isBigScreen = (isSmall) ? false : true;
    })
  }
  this.hideSignIn = () => {
    $('.page4Block').css('top', '20em');
    $timeout(() => {
      $('.signInForm').css('zIndex', -1);
      $('.page4Block').css('top', '-15px');
    }, 800);
  }
  this.signin = (signin) => {
    $('.page4Block').css('top', '20em');
    $timeout(() => {
      $rootScope.currentSignPage = (signin === 'signin') ? 'signin' : 'signup';
      $('.signInForm').css('zIndex', 0);
      $('.page4Block').css('top', '-15px');
    }, 800);
  }
  this.hasEmptyFieldCheck = (obj) => {
    const values = Object.values(obj);
    const hasEmptyField = values.includes("") || values.includes(undefined);
    return hasEmptyField;
  }
  this.watchForFailedMessage = () => {
    $interval(() => {
      if($rootScope.messageFailed){
        this.sendMessage('text');
        $rootScope.messageFailed = false;
      }
    })
  }
  this.startHomePageAnimation = () => {
    $rootScope.url = ($rootScope.successfullyLoggedIn) ? $rootScope.name + 'website.com' : 'yourwebsite.com';
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
        this.startPageChanges();
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
    }, 2000);
  }
  this.startPageChanges = () => {
    const startTypingToFinish = (pagAanimation, nextPage) => {
      $rootScope.hidePage = 'zeroOpacity';
      $rootScope.screenVersion = 'code';
      if (pagAanimation === 1) {
        animation.type($rootScope.typeAnimationOne);
      } else if (pagAanimation === 2) {
        animation.type($rootScope.typeAnimationTwo);
      } else if (pagAanimation === 3) {
        animation.type($rootScope.typeAnimationThree);
      }

      const toNextScreenAnimation = () => {
        nextPageIndex++;
        pagAanimation++;
        startAnimation(pagAanimation, nextPageArray[nextPageIndex]);
      }

      const watchForTypingToFinish = $interval(() => {
        if($rootScope.doneTyping){
          $timeout(() => {
            $rootScope.screenVersion = nextPage;
            $timeout(() => {
              const $thisPage = $('.' + nextPage + '');
              $thisPage.addClass('ninetydegrees');
              $timeout(() => {
                $('.pageContent').css('opacity', 1);
                $rootScope.hidePage = "";
                $timeout(() => {
                  animation.toggleHomePageScreen();
                  $('.' + nextPage + '').removeClass('ninetydegrees');
                  $timeout(() => {
                    (nextPage === 'screenVersion4') ? $('.signToMyPage').css('opacity', 1) : toNextScreenAnimation();
                  }, 1000);
                })
              })
            })
            // animation.toggleHomePageScreen();
          }, 500);
          $interval.cancel(watchForTypingToFinish);
        }
      })
    }
    const startAnimation = (pagAanimation, nextPage) => {
      $timeout(() => {
        animation.toggleHomePageScreen();
        $timeout(() => {
          startTypingToFinish(pagAanimation, nextPage);
        }, 1200)
      }, 1500)
    }
    let pagAanimation = 1;
    let nextPageIndex = 0;
    let nextPageArray = ['screenVersion2', 'screenVersion3', 'screenVersion4'];
    startAnimation(pagAanimation, nextPageArray[nextPageIndex]);
    // animation.toggleHomePageScreen();
    // animation.type($rootScope.typeAnimationOne);
  }
  this.watchForContentAnimation = () => {
    const serviceDistanceWatch = $interval(() => {
      const serviceDistance = $('#servicesSectionImgButton')[0].offsetTop;
      if(serviceDistance < $('.mainContent').scrollTop() + 200){
        $interval.cancel(serviceDistanceWatch);
        this.revealSection('#servicesSectionImgButton', '#servicesSection', '.sectionContent1');
      }
    })
    const pricingDistanceWatch = $interval(() => {
      const pricingDistance = $('#pricingSectionImgButton')[0].offsetTop;
      if(pricingDistance < $('.mainContent').scrollTop() + 400){
        $interval.cancel(pricingDistanceWatch);
        this.revealSection('#pricingSectionImgButton', '#pricingSection', '.sectionContent2');
      }
    })
    const contactCustomerDistanceWatch = $interval(() => {
      const contactCustomerDistance = $('#contactCustomerSectionImgButton')[0].offsetTop;
      if(contactCustomerDistance < $('.mainContent').scrollTop() + 400){
        $interval.cancel(contactCustomerDistanceWatch);
        this.revealSection('#contactCustomerSectionImgButton', '#contactCustomerSection', '.sectionContent3');
      }
    })
    const signUpDistanceWatch = $interval(() => {
      const signUpDistance = $('#signUpTipSectionImgButton')[0].offsetTop;
      if(signUpDistance < $('.mainContent').scrollTop() + 200){
        $interval.cancel(signUpDistanceWatch);
        this.revealSection('#signUpTipSectionImgButton', '#signUpTipSection', '.sectionContent4');
      }
    })
    const contantMeDistanceWatch = $interval(() => {
      const contantMeDistance = $('#contactMeSectionImgButton')[0].offsetTop;
      if(contantMeDistance < $('.mainContent').scrollTop() + 400){
        $interval.cancel(contantMeDistanceWatch);
        this.revealSection('#contactMeSectionImgButton', '#contactMeSection', '.sectionContent5');
      }
    })
  }
  this.watchForTableAnimation = () => {
    const watchForAnimation = $interval(() => {
      const positionFromTopOfPage = $('.mainContent').scrollTop();
      if(positionFromTopOfPage > 1200){
        $interval.cancel(watchForAnimation);
        let track = 0;
        const tableLength = $('.table')[0].children.length - 1;
        const fadeRowIn = (index) => {
          $('.tableContent[data=' + index + ']').css('opacity', 1);
          $timeout(() => {
            if(track != tableLength){
              track++;
              fadeRowIn(track);
            }
          }, 100)
        }
        fadeRowIn(0);
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
      const url = ($rootScope.env === 'local') ? 'http://localhost:3000/email' : 'http://letsbuildyourwebsite.com/email';
      server.sendEmail(sendObj, url);
    }
    const sendText = () => {
      animation.sendSignal();
      const url = ($rootScope.env === 'local') ? 'http://localhost:3000/text' : 'http://letsbuildyourwebsite.com/text';
      server.sendText(sendObj, url);
    }
    (messageType === 'email') ? sendEmail() : sendText();
  }
  this.hasEmpytField = (obj) => {
    const values = Object.values(obj);
    const hasEmptyField = values.includes("") || values.includes(undefined);
    return hasEmptyField;
  }
  this.hideSections = () => {
    // const sectionsToHide = ['#servicesSection', '#pricingSection', '#contactCustomerSection', '#signUpTipSection', '#contactMeSection', '.sectionContent1', '.sectionContent2', '.sectionContent3', '.sectionContent4', '.sectionContent5'];
    const sectionsToHide = ['#servicesSection', '#pricingSectionImgButton', '#contactCustomerSectionImgButton', '#signUpTipSection', '#contactMeSectionImgButton', '.sectionContent1', '.sectionContent4', '.tableContent'];
    const excludeOnPhone = ['#servicesSection', '#signUpTipSection', '.sectionContent1', '.sectionContent4'];
    const bodyWidth = $('body').width();
    sectionsToHide.map((section) => {
      $(section).hide();
    });
    if(bodyWidth < 1000){
      excludeOnPhone.map((section) => {
        $(section).show();
      });
    }
  }
  this.showServicesSection = () => {
    this.revealSection('#servicesSectionImgButton', '#servicesSection', '.sectionContent1');
  }
  this.showPricingMeSection = () => {
    this.revealSection('#pricingSectionImgButton', '#pricingSection', '.sectionContent2');
  }
  this.showContactCustomerSection = () => {
    this.revealSection('#contactCustomerSectionImgButton', '#contactCustomerSection', '.sectionContent3');
  }
  this.showSignUpSection = () => {
    this.revealSection('#signUpTipSectionImgButton', '#signUpTipSection', '.sectionContent4');
  }
  this.showContactMeSection = () => {
    this.revealSection('#contactMeSectionImgButton', '#contactMeSection', '.sectionContent5');
  }
  this.revealSection = (sectionImg, section, fadeInContent) => {
    const $sectionImgBtn = $(sectionImg + ' .imgHolder img');
    $sectionImgBtn.css('opacity', 0.1);
    $timeout(() => {
      const left = ($(sectionImg).hasClass('imgButtonLeft')) ? '-100vw' : '100vw';
      $sectionImgBtn.css('left', left);
    }, 800).then(() => {
      $timeout(() => {
        $(sectionImg).hide();
        $(section).show();
      }, 1500).then(() => {
        $(fadeInContent).fadeIn();
      });
    });
  }
})

app.service('animation', function($rootScope, $timeout, $interval){
  this.sideBar = () => {
    let top;
    $timeout(() => {
      $('.sideBar').css('left', 0);
    }, 500).then(() => {
      $timeout(() => {
        top = $('.welcomeBar').css('top');
        $('.welcomeBar').css('top', 0);
      }, 800).then(() => {
        $timeout(() => {
          $('.welcomeBar').css('top', top);
        }, 5000);
      });
    });
  }
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
  this.type = (typeObject) => {
    $rootScope.doneTyping = false;
    const numberAboveTotalLines = 6;
    let characterNumber = 1;
    let currentLine = 1;
    const startNextLine = () => {
      currentLine++;
      characterNumber = 1;
    }
    const finishTyping = () => {
      $interval.cancel(startTyping)
      $rootScope.doneTyping = true;
    }
    const typeLine = (objNumber, selector) => {
      const text = typeObject[objNumber].slice(0, characterNumber);
      $(selector).text(text);
      characterNumber++;
      (characterNumber === typeObject[objNumber].length + 1) ? startNextLine() : null;
      (currentLine === numberAboveTotalLines) ? finishTyping() : null;
    }
    const startTyping = $interval(() => {
      if(currentLine === 1){ typeLine('one', '.typingLineOne'); }
      if(currentLine === 2){ typeLine('two', '.typingLineTwo'); }
      if(currentLine === 3){ typeLine('three', '.typingLineThree'); }
      if(currentLine === 4){ typeLine('four', '.typingLineFour'); }
      if(currentLine === 5){ typeLine('five', '.typingLineFive'); }
    }, 15);

  }
  this.tableOnSmallScreen = () => {
    const isOnSmallScreen = $('.table').css('transition');
    if(isOnSmallScreen.includes('small')){

      $timeout(() => {
        $('.sectionContent1 p').css('transition', 'opacity 2s').css('left', '-2em');
        $('.sectionContent1 p').animate({
          left: 0
        }, 2400)
        $('.sectionContent1 p').css('opacity', 1);
        $interval(() => {
          const allRowsInTable = $('.tableContent');
          for(let i = 0; i < allRowsInTable.length; i++){
            const data = allRowsInTable[i].attributes["0"].nodeValue;
            const selector = $('.tableContent[data="' + data + '"]');
            const offsetTop = selector.offset().top;
            const height = selector.height();
            const inPosition = ((offsetTop + (height*0.6)) < 200);
            const inPositionForPriceFlip = ((offsetTop - (height * 0.2)) < 1000);
            if(inPosition) {
              selector.addClass('tableHighlight');
              selector["0"].children["0"].children["0"].classList.add('tableHighlight');
              selector["0"].children["1"].children["0"].classList.add('tableHighlight');
              selector["0"].children["2"].children["0"].classList.add('tableHighlight');
            } else {
              selector["0"].children["0"].children["0"].classList.remove('tableHighlight');
              selector["0"].children["1"].children["0"].classList.remove('tableHighlight');
              selector["0"].children["2"].children["0"].classList.remove('tableHighlight');
            }

            if(inPositionForPriceFlip) {
              selector["0"].children["2"].classList.add('flip');
            } else {
              selector["0"].children["2"].classList.remove('flip');
            }
          }
        })
      });
    }
  }
})

app.service('server', function($rootScope, $http, $timeout){
  this.loginRequest = (signInObj, url) => {
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(signInObj),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("successfully logged in");
      $rootScope.name = success.data.firstname;
      $rootScope.successfullyLoggedIn = true;
    }

    const errorCallback = () => {
      console.log("error logging in");
      $(".signFormMessage p").text("Username or Password incorrect");
      $('.signFormMessage').fadeIn();
    }
  };
  this.register = (signUpObj, url) => {
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(signUpObj),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("successfully registered");
      $rootScope.currentSignPage = 'signin';
      $(".signFormMessage p").text("Thanks For Registering! Try Signing in");
      $('.signFormMessage').css('opacity', 1);
      $timeout(() => {
        $('.signFormMessage').css('opacity', 0);
      }, 6000);
    }

    const errorCallback = () => {
      console.log("error registering");
      $(".signFormMessage p").text("Username taken. sorry...");
      $('.signFormMessage').css('opacity', 1);
      $timeout(() => {
        $('.signFormMessage').css('opacity', 0);
      }, 6000);
    }
  }
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
      $rootScope.currentlySendingMessage = false;
      $rootScope.messageFailed = true;
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
             error => {
               $rootScope.currentlySendingMessage = false;
               console.log('error sending message')
             } );
  }
})

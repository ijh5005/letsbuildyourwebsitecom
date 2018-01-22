"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', '$timeout', 'navigate', 'data', 'task', 'animation', function($rootScope, $scope, $interval, $timeout, navigate, data, task, animation){
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
  $rootScope.env = '';
  $rootScope.messageFailed = false;
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
  animation.sideBar();
  task.startHomePageAnimation();
  task.watchForTableAnimation();
  task.hideSections();
  task.watchForContentAnimation();
  task.watchForFailedMessage();
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
    {service: "payment/shopping cart", price: "$80", description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more."},
    {service: "device friendly layout", price: "$25 each", description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions."},
    {service: "sign in/sign up", price: "$50", description: "Includes a sign in/sgin up forms page linked to a database that stores usernames and passwords."},
    {service: "email notifications", price: "$50", description: "An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website. see example below"},
    {service: "text notifications", price: "$50", description: "An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website. see example below"},
    {service: "page animations", price: "$50", description: "Custom animation to help your website stand out and build a smooth customer experience."},
    {service: "contact and feedback forms", price: "$50", description: "These forms are convenient ways for customers to contact you and leave feedback. This form will be on a page of your website."}
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
  this.watchForFailedMessage = () => {
    $interval(() => {
      if($rootScope.messageFailed){
        this.sendMessage('text');
        $rootScope.messageFailed = false;
      }
    })
  }
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
                    (nextPage === 'screenVersion4') ? console.log('done') : toNextScreenAnimation();
                  }, 1000);
                },)
              },)
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
      if(serviceDistance < $('.mainContent').scrollTop() + 400){
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
      const url = ($rootScope.env === 'local') ? 'http://localhost:3000/email' : 'https://letsbuildyourwebsite.herokuapp.com/email';
      server.sendEmail(sendObj, url);
    }
    const sendText = () => {
      animation.sendSignal();
      const url = ($rootScope.env === 'local') ? 'http://localhost:3000/text' : 'https://letsbuildyourwebsite.herokuapp.com/text';
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
    sectionsToHide.map((section) => {
      $(section).hide();
    });
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
    $timeout(() => {
      $('.sideBar').css('left', 0);
    }, 500);
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
             error => console.log('error sending message') );
  }
})

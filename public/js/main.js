"use strict";

$(document).ready(() => {
  setTimeout(() => {
    $('body').removeClass('opacityZero');
  }, 10)
})

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', '$timeout', 'navigate', 'data', 'task', 'animation', 'server', 'dashboard', function($rootScope, $scope, $interval, $timeout, navigate, data, task, animation, server, dashboard){
  ////////////    dashboard functionality   ////////////
  $rootScope.loggedInToDashboard = false;

  //database name
  $rootScope.db = 'letsbuildyourwebsitedashboard';
  //api key
  $rootScope.apiKey = '7sJF23PwcfBVjIeJCuUDIXcWr3kJgx3d';
  //the id of the content in the collection
  $rootScope.id = '5ae47beef36d282906c3334c';

  $rootScope.env = 'local';

  $rootScope.isSmallScreen = false;
  $rootScope.isBigScreen = false;
  $rootScope.messageSent = false;
  $rootScope.currentlySendingMessage = false;
  $rootScope.labelMessage = "";
  $rootScope.showLabelLabelMessage = false;
  $rootScope.doneTyping = true;
  $rootScope.messageFailed = false;
  $rootScope.successfullyLoggedIn = false;
  $rootScope.appContent;
  $rootScope.introText;

  $scope.messageType = 'email';
  $scope.emailStatus = 'selectedSendBtn';
  $scope.textStatus = '';
  $rootScope.homePageAnimationOpen = false;
  $scope.navigationPoints = ($rootScope.loggedInToDashboard) ? data.dashboardOptions : data.navigationPoints;
  $scope.services = data.services;
  $scope.page2 = data.page2Content;
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
    if(!$rootScope.loggedInToDashboard){
      (dataValue === undefined) ? navigate.toTagWithEvent(e) : navigate.toTagWithDataValue(dataValue);
    } else {
      task.handleDashboardOptionClick(task.findDashboardOptionIndex(dataValue));
    }
  }
  $scope.sendMessage = () => {
    task.sendMessage('text');
    // ($scope.messageType === 'email') ? task.sendMessage('email') : task.sendMessage('text');
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
  $rootScope.signIn = true;

  //authentication
  $scope.closeAuthScreen = () => {
    $('#authScreen').addClass('closeAuthScreen');
  }
  $scope.showSignIn = () => {
    $('#authScreen').removeClass('closeAuthScreen');
    $rootScope.signIn = true;
  }
  $scope.showSignUp = () => {
    $('#authScreen').removeClass('closeAuthScreen');
    $rootScope.signIn = false;
  }
  $scope.authenticate = () => {
    task.authenticate();
  }


  animation.sideBar();
  animation.tableOnSmallScreen();
  task.hideSections();
  task.watchForContentAnimation();
  task.screenCheck();
  task.startHomePageAnimation();
  //get application data
  task.get($rootScope.db, $rootScope.apiKey);

  $scope.middleDashboardOptions = data.middleDashboardOptions;


  ////////////    dashboard functionality   ////////////
  $rootScope.showInputSection = false;
  $rootScope.dashboardContent = [];
  $rootScope.middleSectionOptions = [];
  $rootScope.pageEditContent = [];
  $rootScope.pageEditContentStrings = [];
  $rootScope.selectedOption = '';
  $rootScope.pageEditIndex;
  $rootScope.pageSectionIndex;
  //the id of the content in the collection
  $rootScope.dashBoardId = '5ae47beef36d282906c3334c';
  $scope.choosePageToEdit = (index) => {
    //empty the textarea content
    $('#inputBox > div > textarea').val('');
    $rootScope.pageEditIndex = index;
    task.setMiddleSectionContent(index);
  }
  //fill textarea with selected text for editing
  $scope.chooseContentToEdit = (content, index) => {
    //set the textarea content
    $('#inputBox > div > textarea').val(content);
    $rootScope.pageSectionIndex = index;
  }
  $scope.updateContent = () => {
    const content = $('#inputBox > div > textarea').val();
    const stringMapArray = $rootScope.pageEditContentStrings[$rootScope.pageSectionIndex].split('|');
    if(stringMapArray.length == 2){
      $rootScope['dashboardContent']['pages'][`_${$rootScope.pageEditIndex}`][stringMapArray[0]][stringMapArray[1]] = content;
    } else if (stringMapArray.length == 3) {
      $rootScope['dashboardContent']['pages'][`_${$rootScope.pageEditIndex}`][stringMapArray[0]][stringMapArray[1]][stringMapArray[2]] = content;
    }
    dashboard.update($rootScope.dashBoardId, $rootScope['dashboardContent']);
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
    $('#mainContent').animate({ scrollTop: offsetTop - 140 }, 250);
  }
});

app.service('task', function($rootScope, $timeout, $interval, $http, animation, server, data){
  //start the homepage animation
  this.startHomePageAnimation = () => {
    $timeout(() => {
      $('.firstLift').addClass('screenLift1');
    }, 500).then(() => {
      $timeout(() => {
        $('.secondLift').addClass('screenLift2');
      }, 1000).then(() => {
        $timeout(() => {
          $('#screen').addClass('rotateFront');
        }, 1000).then(() => {
          $timeout(() => {
            $('.firstLift').removeClass('screenLift1');
            $('.secondLift').removeClass('screenLift2');
          }, 1400).then(() => {
            $timeout(() => {
              $('#screen').addClass('backgroundColorFadeIn');
              $('.bottomSection').addClass('shadow');
            }, 500)
          })
        })
      });
    });

    $interval(() => {
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7];
      const random1 = Math.floor(Math.random() * numbers.length);
      numbers.splice(numbers.indexOf(random1), 1);
      const random2 = numbers[Math.floor(Math.random() * numbers.length)];
      $('#screenInsideTopBottom > * > span').removeClass('lighter');
      $(`#screenInsideTopBottom > * > span[data="${random1}"]`).addClass('lighter');
      $(`#screenInsideTopBottom > * > span[data="${random2}"]`).addClass('lighter');
    }, 2000)
  };
  //check if we are on a mobile device
  this.screenCheck = () => {
    $interval(() => {
      const isSmall = $('.table').css('transition').includes('small');
      $rootScope.isSmallScreen = (isSmall) ? true : false;
      $rootScope.isBigScreen = (isSmall) ? false : true;
    })
  }
  //authentication
  this.authenticate = () => {
    //get username and password
    const signInCredentials = {
      username: document.querySelector('.uname').value,
      password: document.querySelector('.psw').value
    }
    const url = ($rootScope.signIn) ? "/login" : "/register";
    //check for complete form
    const hasEmptyField = this.hasEmptyFields(signInCredentials);
    if(hasEmptyField){
      $("#signInTopText").text("Please fill in all fields. Thanks!");
      $timeout(() => {
        $('#signInTopText').css('opacity', 0);
      }, 6000);
    } else {
      ($rootScope.signIn) ? server.loginRequest(signInCredentials, url) : server.register(signInCredentials, url);
    }
  }
  //check if an object is empty
  this.hasEmptyFields = (obj) => {
    const values = Object.values(obj);
    return values.includes("") || values.includes(undefined);
  }
  //send text message
  this.sendTextMessage = () => {
    this.sendMessage('text');
  }
  //animation on scroll
  this.watchForContentAnimation = () => {
    const doneAnimation = [];
    $('#mainContent').scroll(() => {
      const serviceDistance = $('#servicesSectionImgButton')[0].offsetTop;
      const signUpDistance = $('#signUpTipSectionImgButton')[0].offsetTop;
      const mainContentScrollPosition = $('.mainContent').scrollTop();
      if((serviceDistance < mainContentScrollPosition + 290) && !doneAnimation.includes('serviceDistance')){
        this.revealSection('#servicesSectionImgButton', '#servicesSection', '.sectionContent1');
        doneAnimation.push('serviceDistance');
      } else if((signUpDistance < mainContentScrollPosition + 350) && !doneAnimation.includes('signUpDistance')){
        this.revealSection('#signUpTipSectionImgButton', '#signUpTipSection', '.sectionContent4');
        doneAnimation.push('signUpDistance');
      } else if(mainContentScrollPosition > 1200){
        this.tableAnimation();
      }
    })
  }
  //table animation
  this.tableAnimation = () => {
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
  //revealing content animation
  this.revealSection = (sectionImg, section, fadeInContent) => {
    const $sectionImgBtn = $(sectionImg + ' .imgHolder img');
    $sectionImgBtn.css('opacity', 0.05);
    $timeout(() => {
      const left = ($(sectionImg).hasClass('imgButtonLeft')) ? '-100vw' : '100vw';
      $sectionImgBtn.css('left', left);
    }, 800).then(() => {
      $timeout(() => {
        $(sectionImg).hide();
        $(section).show();
        $(fadeInContent).css('display', 'none');
      }, 1500).then(() => {
        $(fadeInContent).fadeIn();
      });
    });
  }
  //api call for data and set page content
  this.get = (db, apiKey) => {
    const url = `https://api.mlab.com/api/1/databases/${db}/collections/${db}?apiKey=${apiKey}`;
    $http({
      method: 'GET',
      url: url,
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      data.allData = success;
      if($rootScope.loggedInToDashboard){
        $rootScope.dashboardContent = success['data'][0];
      } else {
        $rootScope.appContent = success['data'][0];
        this.setContent();
      }
      console.log("data fitched");
      $('.mainContent').addClass('showWhenContentLoaded');
    }

    const errorCallback = () => {
      console.log("error in fitching data");
    }
  }
  this.setContent = () => {
    this.setProducts();
    this.setPage1Content();
    this.setPage2Content();
  }
  this.setProducts = () => {
    $rootScope.appContent['pages']['_2']['content'].map((productData) => {
      const product = { service: productData.service, price: productData.price, description: productData.description }
      data['services'].push(product);
    })
  }
  this.setPage1Content = () => {
    $rootScope.introText = $rootScope.appContent['pages']['_0']['content'][0];
  }
  this.setPage2Content = () => {
    $rootScope.appContent['pages']['_1']['content'].map((productData) => {
      data['page2Content'].push({
        head: productData.header,
        p1: productData.subText,
        p2: productData.body
      });
    })
  }


  //may need refactoring
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
      server.sendEmail(sendObj, url, this.sendTextMessage);
    }
    const sendText = () => {
      animation.sendSignal();
      const url = ($rootScope.env === 'local') ? 'http://localhost:3000/text' : 'http://letsbuildyourwebsite.com/text';
      server.sendText(sendObj, url, this.sendTextMessage);
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

  //dashboard functionality
  this.selectPageToEdit = (index) => {
    this.changeHelpText('contentChoice');
    //reset $rootScope.objIndex
    $rootScope.objIndex = null;
    $rootScope.innerIndex = '';
    //set page index
    $rootScope.pageIndex = index;
    //set the content to be displayed in the middle section
    $rootScope.editContent = $rootScope.appContent['pages'][`_${index}`]['content'];
    $timeout(() => {
      //clear the middle section of any page content
      $rootScope.middleDashboardOptions = [];
      $timeout(() => {
        //loop through the content to append in the middle section
        $rootScope.editContent.map(data => {
          $rootScope.middleDashboardOptions.push(data);
        })
      })
    })
  }
  //find index of dashboard option picked
  this.findDashboardOptionIndex = (dataValue) => {
    let index = '';
    data['dashboardOptions'].filter((data, i) => {
      index = (data['point'] === dataValue) ? i : index
    });
    return index;
  };
  //handle the dashboard picked option action
  this.handleDashboardOptionClick = (index) => {
    $rootScope.dashboardIndex = index;
    $rootScope.pageEditContent = [];
    $rootScope.showInputSection = false;
    $rootScope.middleSectionOptions = (index === 0) ? this.findPageNames() : null;
  }
  //return array of page names
  this.findPageNames = () => {
    let allPageNames = [];
    for(let i = 0; i < Object.keys(data.allData.data["0"].pages).length; i++){
      allPageNames.push(data.allData.data["0"].pages[`_${i}`]['name']);
    }
    return allPageNames;
  }
  //set the middle section content
  this.setMiddleSectionContent = (index) => {
    $rootScope.pageEditContentStrings = [];
    //$rootScope.dashboardIndex === 0 if we are editing content for a page
    if($rootScope.dashboardIndex === 0){
      //array to hold the page content
      const contentArray = [];
      //cache the content for the selected page
      const content = $rootScope['dashboardContent']['pages'][`_${index}`]['content'];
      //extract any page content that is contained in an object
      const extractContent = (content, index) => {
        const contentKeys = Object.keys(content)
        for(let i = 0; i < contentKeys.length; i++){
          contentArray.push(content[contentKeys[i]]);
          $rootScope.pageEditContentStrings.push(`content|${index}|${contentKeys[i]}`);
        }
      }
      //loop through the content and store it in the contentArray
      for(let i = 0; i < content.length; i++){
        const isString = typeof content[i] === 'string';
        const a = $rootScope.dashboardContent;
        (isString) ? $rootScope.pageEditContentStrings.push(`content|${i}`) : null;
        (isString) ? contentArray.push(content[i]) : extractContent(content[i], i);
      }
      //set the pageEditContent content to the content array
      $rootScope.pageEditContent = contentArray;
      $rootScope.showInputSection = true;
    }
  }
})

app.service('data', function(){
  this.allData = []
  this.navigationPoints = [
    {data: 0, point: 'home'},
    {data: 1, point: 'service'},
    {data: 2, point: 'cost'},
    {data: 3, point: 'tips'},
    {data: 4, point: 'contact'}
  ]
  this.dashboardOptions = [
    {data: 0, point: 'edit page text'},
    {data: 1, point: 'report bug'},
    {data: 2, point: 'contact developer'},
    {data: 3, point: 'add products'},
    {data: 4, point: 'feature ideas'}
  ];
  this.helpText = {
    initialText: 'CHOOSE FROM THE ABOVE OPTIONS',
    pageChoice: 'WHICH PAGE WOULD YOU LIKE TO EDIT?',
    contentChoice: 'WHICH SECTION OF THE PAGE WOULD YOU LIKE TO EDIT?',
    changeText: 'CHANGE THE TEXT AND PRESS UPDATE WHEN YOUR READY',
    bugFix: 'EXPLAIN THE BUG IN AS MUCH DETAIL AS POSSIBLE AND PRESS SEND',
    contact: 'SEND A MESSAGE AND I WILL GET BACK TO YOU AS SOON AS POSSIBLE',
    addProducts: 'WHICH PRODUCTS WOULD YOU LIKE TO ADD',
    ideas: 'WHAT WOULD YOU LIKE TO SEE ON THE DASHBOARD. I TAKE YOUR SUGGESTIONS SERIOUSLY AND WILL TRY TO GIVE YOU MORE.',
    comingSoon: 'FEATURE COMING SOON'
  }
  this.services = [
    // {service: "website pages", price: "$50 each", description: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added."},
    // {service: "dashboard", price: "$10 / month", description: "With the dashboard, you can edit content on your website, edit existing product information, and add additional products at the click of a button. This is a computer application."},
    // {service: "shopping cart", price: "$80", description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more."},
    // {service: "device friendly layout", price: "$25 each", description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions."},
    // {service: "sign in/sign up", price: "$50", description: "Includes a sign in/sign up forms page linked to a database that stores usernames and passwords."},
    // {service: "email notifications", price: "$50", description: "An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website."},
    // {service: "text notifications", price: "$50", description: "An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website."},
    // {service: "page animations", price: "$50", description: "Custom animation to help your website stand out and build a smooth customer experience."},
    // {service: "contact form", price: "$25", description: "This form is a convenient way for customers to contact you. This form will be on a page of your website."},
    // {service: "feedback form", price: "$25", description: "This form is a convenient way for customers to leave feedback. This form will be on a page of your website."}
  ]
  this.page2Content = [
    // { head: 'MULTI-DEVICE', p1: 'Your website will look great on all devices: Desktop, Laptop, Tablet, and even TV.', p2:  'We use countless device types to surf the web. A three-second look at a website from any one of those devices will mean the difference between a customer deciding to stay on your site to explore or leave without even giving you a chance. The solution is to have a great looking site for any device type. With my services, your site will look amazing on all devices.'},
    // { head: 'INTEGRATION', p1: 'We can always add more features later. No pressure to get it all at once.', p2:  'There are several services you can get on your website: a login in page, shopping cart, email notification sign up, subscription sign up, and many more. No need to worrying about everything you need at once. Services can always be added later. For now, focus on what is most important for your customers. When you get more feedback or a better idea what your customer wants on your website we will add it as we go.'},
    // { head: 'INEXPENSIVE', p1: 'Websites can cost thousands. No fear, I\'m here, with affordable prices.', p2:  'A web developer makes anywhere from $15 - $60/hr ( sometimes more! ). Websites can take weeks to finish depending on the complexity of the site so it gets expensive quick. I understand how it feels to inherit the stress and expenses of a business. So, let me remedy that expense by offering you a huge discount. Check out the pricing table below for details.'}
  ];
  this.middleDashboardOptions = [
    {
      body: "We use countless device types to surf the web. A three-second look at a website from any one of those devices will mean the difference between a customer deciding to stay on your site to explore or leave without even giving you a chance. The solution is to have a great looking site for any device type. With my services, your site will look amazing on all devices.",
      header: "MULTI-DEVICE",
      subText: "Your website will look great on all devices: Desktop, Laptop, Tablet, and even TV."
    }
  ]
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
      }, 6000).then(() => {
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
      console.log(success);
      console.log("successfully logged in");
      //clear username and password fields
      $('input[name="username"]').val('');
      $('input[name="password"]').val('');
    }

    const errorCallback = () => {
      console.log("error logging in");
      $("#signInTopText").text("Username or Password incorrect");
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
      //clear username and password fields
      $('input[name="username"]').val('');
      $('input[name="password"]').val('');
      $("#signInTopText").text("Thanks For Registering!");
    }

    const errorCallback = () => {
      console.log("error registering");
    }
  }
  this.sendEmail = (obj, url, callBack) => {
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
      callBack();
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

app.service('dashboard', function($rootScope, $http){
  this.post = () => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}?apiKey=${$rootScope.apiKey}`;
    const data = { hey: 'hi' };
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("ok");
    }

    const errorCallback = () => {
      console.log("error");
    }
  }
  this.update = (id, data) => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}?apiKey=${$rootScope.apiKey}&_id=${id}`;
    $http({
      method: 'PUT',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("updated data");
    }

    const errorCallback = () => {
      console.log("error when updating data");
    }
  }
  this.del = (id) => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}/${id}?apiKey=${$rootScope.apiKey}`;
    const data = { hey: 'hi' };
    $http({
      method: 'DELETE',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("ok");
    }

    const errorCallback = () => {
      console.log("error");
    }
  }
})

app.filter('toReadableString', function($rootScope) {
  return function(input) {
    let output = '';
    const type = typeof input;
    if(type === 'string'){
      output = input;
    } else if(type === 'object'){
      const objKeys = Object.keys(input);
      let dataNum = '';
      $rootScope.editContent.map((data, index) => {
        dataNum = (data === input) ? index : dataNum;
      });
      objKeys.map((key, index) => {
        const currentHtml = $(`#editText[data="${dataNum}"]`).html();
        const html = (index === 0) ? input[key] + '<br><br>' : currentHtml + input[key] + '<br><br>';
        $(`#editText[data="${dataNum}"]`).html(html)
      })
      return;
    }
    return output;
  }
});

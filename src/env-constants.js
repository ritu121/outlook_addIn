var Signin_url = {
    production: 'https://outlookextension.azurewebsites.net/api/LogMail_Authorize?code=8ifCTuf0r0J9mZiCLHcT6i5-WslLoqWdgoQb90LEBaAZAzFu_Q0XWg==',
    development: 'https://outlookextension.azurewebsites.net/api/LogMail_Authorize?code=8ifCTuf0r0J9mZiCLHcT6i5-WslLoqWdgoQb90LEBaAZAzFu_Q0XWg==',
    test: 'https://outlookextension.azurewebsites.net/api/LogMail_Authorize?code=8ifCTuf0r0J9mZiCLHcT6i5-WslLoqWdgoQb90LEBaAZAzFu_Q0XWg==',
   };
  
  var LogMail_Post_url = {
    production: 'https://outlookextension.azurewebsites.net/api/LogMail_Post?code=IExNL57HqePRSZFRtA5dSnJst2R__TsU4fhjo2afbOauAzFuENR9Rg==',
    development: 'https://outlookextension.azurewebsites.net/api/LogMail_Post?code=IExNL57HqePRSZFRtA5dSnJst2R__TsU4fhjo2afbOauAzFuENR9Rg==',
    test: 'https://outlookextension.azurewebsites.net/api/LogMail_Post?code=IExNL57HqePRSZFRtA5dSnJst2R__TsU4fhjo2afbOauAzFuENR9Rg=='
  };
  
  var LinkTabsList_Get_url = {
      production: 'https://outlookextension.azurewebsites.net/api/LogMail_Get?code=2p593UQ7kZ1vNoKep7-woNZV_Fo__ZMyRa44h3-JSkm2AzFum95cmw==',
      development:'https://outlookextension.azurewebsites.net/api/LogMail_Get?code=2p593UQ7kZ1vNoKep7-woNZV_Fo__ZMyRa44h3-JSkm2AzFum95cmw==',
      test:'https://outlookextension.azurewebsites.net/api/LogMail_Get?code=2p593UQ7kZ1vNoKep7-woNZV_Fo__ZMyRa44h3-JSkm2AzFum95cmw=='
  };
  
  // get available environment setting
  var environment = function () {
     switch(process.env.NODE_ENV) {
         case 'production':
             return 'production';
         case 'development':
             return 'development';
         case 'test':
             return 'test';
         default: // in case ...
             return 'production';
     };
  };
  
  // default map for supported all production/development/test settings
  var mapEnvToSettings = function (settingsConsts) {
     return settingsConsts[environment()];
  };
    
  export const LogMail_Post_URL = mapEnvToSettings(LogMail_Post_url);
  export const Signin_URL = mapEnvToSettings(Signin_url);
  export const LinkTabsList_Get_URL = mapEnvToSettings(LinkTabsList_Get_url);
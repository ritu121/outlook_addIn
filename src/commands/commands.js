
/* global global, Office, self, window */

Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

const CUSTOM_PROP_KEY = 'myPropSelltis';
const CUSTOM_PROP_VALUE = 'selltisSubmitted';
const MAILBOX_CATEGORY_SELLTIS = "Selltis";

const ItemLogStatus = {
  NOT_LOGGED: "NOT_LOGGED",
  LOGGED_ALREADY: "LOGGED_ALREADY"
}

var dialog_URL = 'https://outlookadd.blob.core.windows.net/web/test/index.html';

if (process.env.NODE_ENV === 'development') {
  dialog_URL = 'https://localhost:3000/index.html';
}

function formatDate(d) {
  var date = new Date(d);
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

function sendAuthInfo(dialog) {
  try {
    let roamingSettings = Office.context.roamingSettings;
    let authTokenInfo = roamingSettings.get("authTokenInfo");

    dialog.messageChild(JSON.stringify(
      {
        type: 'authTokenInfo',
        data: authTokenInfo && authTokenInfo.authToken ? authTokenInfo : 'NOT_FOUND'
      }
    ));
  } catch (error) {
    dialog.messageChild(JSON.stringify(
      {
        type: 'authTokenInfo',
        data: 'NOT_FOUND'
      }
    ));
  }
}

function sendItemLogStatus(dialog) {
  return new Promise((resolve, reject) => {
    try {
      Office.context.mailbox.item.loadCustomPropertiesAsync((asyncResult) => {
        if (asyncResult.status == Office.AsyncResultStatus.Failed) {
          // Handle the failure.	
        }
        else {
          const customProps = asyncResult.value;
          const customPropField = customProps["rawData"][CUSTOM_PROP_KEY];

          dialog.messageChild(JSON.stringify(
            {
              type: 'itemLogStatus',
              data: customPropField === CUSTOM_PROP_VALUE ? ItemLogStatus.LOGGED_ALREADY : ItemLogStatus.NOT_LOGGED
            }
          ));

          resolve(customPropField === CUSTOM_PROP_VALUE ? ItemLogStatus.LOGGED_ALREADY : ItemLogStatus.NOT_LOGGED);
        }
      });
    } catch (error) {
      dialog.messageChild(JSON.stringify(
        {
          type: 'itemLogStatus',
          data: ItemLogStatus.NOT_LOGGED
        }
      ));

      resolve(ItemLogStatus.NOT_LOGGED);
    }
  });
}

function getMailBasicData() {
  return new Promise((resolve, reject) => {
    const { mailbox } = Office.context;
    const { item } = mailbox;
    const from = item.from.emailAddress;
    const to = Array.isArray(item.to) ? item.to.map((recipient) => recipient.emailAddress).join(", ") : item.to;

    const attachments = item.attachments;
    const attachmentFiles = [];
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].attachmentType == "file") {
          attachmentFiles.push(JSON.parse(JSON.stringify(attachments[i])));
        }
      }
    }

    resolve({
      id: item.id,
      type: item.sender.emailAddress === Office.context.mailbox.userProfile.emailAddress ? "Sent" : "Received",
      from: from,
      to: to,
      bcc: item.bcc ? item.bcc.map((recipient) => recipient.emailAddress).join(",") : [],
      cc: item.cc ? item.cc.map((recipient) => recipient.emailAddress).join(",") : [],
      subject: item.subject,
      attachments: attachmentFiles
    });
  });
}

function getMailBodyData() {
  return new Promise((resolve, reject) => {
    const { mailbox } = Office.context;
    const { item } = mailbox;
    item.body.getAsync("text", (result) => {
      const emailBody = result.value;
      const dateTimeCreated = item.dateTimeCreated;
      resolve({
        body: emailBody,
        datetime: formatDate(dateTimeCreated),
      });
    });
  });
}

function getMailEwsData() {
  return new Promise((resolve, reject) => {
    const { mailbox } = Office.context;
    const { item } = mailbox;

    item.body.getAsync("html", { asyncContext: "getEmailBody" }, function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const emailHTML = result.value;

        const parser = new DOMParser();
        const doc = parser.parseFromString(emailHTML, "text/html");

        const imgElements = doc.getElementsByTagName("img");
        const uniqueImages = new Set();

        for (let i = 0; i < imgElements.length; i++) {
          const src = imgElements[i].getAttribute("src");
          uniqueImages.add(src);
        }

        const embeddedImages = Array.from(uniqueImages).map((src) => {
          const fileName = src.substring(src.lastIndexOf("/") + 1);
          return { src, fileName };
        });

        Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function (asyncResult) {
          if (asyncResult.status === "succeeded") {
            resolve({
              ewsUrl: mailbox.ewsUrl,
              attachmentToken: asyncResult.value,
              embeddedImages: embeddedImages
            });
          }
        });
      }
    });
  });
}

function sendInfoData(dialog) {
  Promise.all([getMailBasicData(), getMailBodyData(), getMailEwsData()])
    .then(([result1, result2, result3]) => {
      dialog.messageChild(JSON.stringify(
        {
          type: 'infoData',
          data: { ...result1, ...result2, ...result3 }
        }
      ));
    })
    .catch((err) => {
      console.log(err);
    });
}

async function sendMsgToChild(dialog) {
  sendAuthInfo(dialog);
  const itemLogStatus = await sendItemLogStatus(dialog);
  if (itemLogStatus === ItemLogStatus.NOT_LOGGED) {
    sendInfoData(dialog);
  }
}

function doLogout() {
  let roamingSettings = Office.context.roamingSettings;
  roamingSettings.remove("authTokenInfo");
  // Save roaming settings to the mailbox, so that they'll be available in the next session.
  roamingSettings.saveAsync((asyncResult) => {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      // Handle the failure.
    }
  });
}

function doLogin(message) {
  let roamingSettings = Office.context.roamingSettings;
  roamingSettings.set("authTokenInfo", message.data);
  // Save roaming settings to the mailbox, so that they'll be available in the next session.
  roamingSettings.saveAsync((asyncResult) => {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      // Handle the failure.
    }
  });
}

function doLogSelected() {
  const notificationMessage = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: `Submitted to Selltis on - ${new Date()}`,
    icon: "Icon.80x80",
    persistent: true,
  };
  Office.context.mailbox.item.notificationMessages.replaceAsync("action", notificationMessage);

  // add to category
  var categoriesToAdd = [MAILBOX_CATEGORY_SELLTIS];
  Office.context.mailbox.item.categories.addAsync(categoriesToAdd, function (asyncResult) { });

  Office.context.mailbox.item.loadCustomPropertiesAsync((asyncResult) => {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      // Handle the failure.	
    }
    else {
      const customProps = asyncResult.value;
      customProps.set(CUSTOM_PROP_KEY, CUSTOM_PROP_VALUE);
      customProps.saveAsync((asyncResult) => { });
    }
  });
}

function processMessageFromChild(dialog, event, message) {
  switch (message.type) {
    case 'dialogLoaded':
      sendMsgToChild(dialog);
      event.completed();
      break;
    case 'dialogClosed':
      dialog.close();
      break;
    case 'dialogLogin':
      doLogin(message);
      break;
    case 'dialogLogSelected':
      doLogSelected();
      break;
    case 'dialogLogout':
      doLogout();
      break;
    default:
      break;
  }
}

function showDialog(cmd, event) {
  let dialog;
  const pageUrl = dialog_URL + `?cmd=${cmd}`;
  Office.context.ui.displayDialogAsync(pageUrl, { height: 80, width: 70 },
    function (asyncResult) {
      dialog = asyncResult.value;

      dialog.addEventHandler(Office.EventType.DialogEventReceived, (arg) => {
        dialog.close();
        //event.completed();
        switch (arg.error) {
          case 12006:
            // The dialog was closed, typically because the user the pressed X button.
            break;
          default:
            //showNotification("Undefined error in dialog window");
            const message = {
              type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
              message: 'Undefined error in add-in',
              icon: "Icon.80x80",
              persistent: true,
            };
            Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
            break;
        }
      });

      dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
        const dialogMessage = JSON.parse(arg.message);
        processMessageFromChild(dialog, event, dialogMessage);
      });
    },
  );
}

function logselectedDirect(event) {
  showDialog('LogSelectedDirect', event);
}

function LogSelectedWithPreview(event) {
  showDialog('LogSelectedWithPreview', event);
}

function LogSelectedWithLink(event) {
  showDialog('LogSelectedWithLink', event);
}

function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
        ? global
        : undefined;
}

const g = getGlobal();
// The add-in command functions need to be available in global scope
g.LogSelectedWithPreview = LogSelectedWithPreview;
g.logselectedDirect = logselectedDirect;
g.LogSelectedWithLink = LogSelectedWithLink;


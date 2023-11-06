import { useEffect, useState } from 'react';
import logoSquare from "./../../assets/s-icon-32.png";
import pageBreakImg from "./../../assets/pagebreakImage.png";
import LogSelectedDirect from './features/LogSelectedDirect';
import LogSelectedWithPreview from './features/LogSelectedWithPreview';
import LogSelectedWithLink from './features/LogSelectedWithLink';

import Header from "./components/Header";
import Login from './components/Login';
import Footer from './components/Footer';

import { ItemLogStatus } from './../utils';

const App = ({ title, isOfficeInitialized }) => {
  const [isOfficeContextFound, setOfficeContextFound] = useState(true);
  const [cmd, setCmd] = useState("");
  const [authInfo, setAuthInfo] = useState(null);
  const [itemLogStatus, setItemLogStatus] = useState(ItemLogStatus.VERIFYING); // verifying not-logged logged-already  
  const [infoData, setInfodata] = useState(null);

  useEffect(() => {
    let urlString = window.location.href;
    let paramString = urlString.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    setCmd(queryString.get('cmd'));
  }, []);

  useEffect(() => {
    Office.onReady(() => {
      console.log(Office,"office ++++++++++++++++++++++++++++")
      if (Office.context.ui) {
        Office.context.ui.addHandlerAsync(
          Office.EventType.DialogParentMessageReceived,
          (arg) => {
            const messageFromParent = JSON.parse(arg.message);
            processMessageFromParent(messageFromParent);
          });
        //dialogLoaded
        Office.context.ui.messageParent(JSON.stringify({ type: 'dialogLoaded' }));
      }
      else {
        setOfficeContextFound(false);
      }
    });
  }, []);

  // useEffect(() => {
  //   const initializeAddIn = async () => {
  //     try {
  //       await Office.onReady();
  //       console.log(Office,"Office.context.ui");
  //       if (Office.context) {

  //         const handler = Office.context.ui.addHandlerAsync(
  //           Office.EventType.DialogParentMessageReceived,
  //           (arg) => {
  //             const messageFromParent = JSON.parse(arg.message);
  //             processMessageFromParent(messageFromParent);
  //           }
  //         );
  
  //         // Check if the handler registration was successful
  //         if (handler.status === Office.AsyncResultStatus.Failed) {
  //           throw new Error('Failed to add handler for DialogParentMessageReceived');
  //         }
  
  //         // Send a message to the parent on dialog loaded
  //         Office.context.ui.messageParent(JSON.stringify({ type: 'dialogLoaded' }));
  //       } else {
  //       console.log("else block");
  //         setOfficeContextFound(false);
  //       }
  //     } catch (error) {
  //       // Handle errors here (e.g., log, display a message, etc.)
  //       console.error('Error in add-in initialization:', error);
  //       // You might want to set a specific state or show an error message in case of failure
  //     }
  //   };
  
  //   initializeAddIn();
  // }, []); 

  const sendMessageToParent = (message) => {
    Office.context.ui.messageParent(JSON.stringify(message));
  }

  const onAuthCompleted = (authInfo) => {
    setAuthInfo(authInfo);
    const messageToParent = {
      type: 'dialogLogin',
      data: authInfo
    };
    sendMessageToParent(messageToParent);

    if (itemLogStatus === ItemLogStatus.ERROR) {
      setItemLogStatus(ItemLogStatus.NOT_LOGGED);
    }
  }

  const processMessageFromParent = (message) => {
    switch (message.type) {
      case 'authTokenInfo':
        setAuthInfo(message.data);
        break;
      case 'itemLogStatus':
        setItemLogStatus(message.data);
        break;
      case 'infoData':
        setInfodata(message.data);
        break;
      default:
        break;
    }
  }

  const afterLogSubmitted = () => {
    setItemLogStatus(ItemLogStatus.SUBMITTED);
    const messageToParent = {
      type: 'dialogLogSelected'
    };
    sendMessageToParent(messageToParent);
  }

  const onClose = () => {
    const messageToParent = {
      type: 'dialogClosed'
    };
    sendMessageToParent(messageToParent);
  }

  const onLoginCancel = () => {
    const messageToParent = {
      type: 'dialogClosed'
    };
    sendMessageToParent(messageToParent);
  }

  const onLogout = () => {
    setAuthInfo('NOT_FOUND');
    if (itemLogStatus === ItemLogStatus.SUBMITTED) {
      setItemLogStatus(ItemLogStatus.LOGGED_ALREADY);
    }
    const messageToParent = {
      type: 'dialogLogout'
    };
    sendMessageToParent(messageToParent);
  }

  // const onError = () => {
  //   setItemLogStatus(ItemLogStatus.ERROR);
  // }

  const onError = (errorType, errorObj) => {
    if (errorType === '401_error') {
      setAuthInfo('NOT_FOUND')
      const messageToParent = {
        type: 'dialogLogout'
      };
      sendMessageToParent(messageToParent);
    } else {
      setItemLogStatus(ItemLogStatus.ERROR);
    }
  }


  return (
    <>
      {
        isOfficeContextFound && authInfo === null &&
        <div className='flex h-screen flex-col justify-center items-center p-10'>
          <img className="h-10 w-10 animate-spin" src={logoSquare} alt="Selltis" title="Selltis" />
        </div>
      }

      {
        isOfficeContextFound && authInfo && authInfo === 'NOT_FOUND' &&
        <Login onAuthCompleted={onAuthCompleted} onCancel={onLoginCancel} />
      }

      {
        isOfficeContextFound && authInfo && authInfo !== '' && authInfo !== 'NOT_FOUND' && cmd === "LogSelectedDirect" &&
        <>
          <Header onLogout={onLogout} />
          <LogSelectedDirect
            authInfo={authInfo}
            itemLogStatus={itemLogStatus}
            infoData={infoData}
            afterSubmit={afterLogSubmitted}
            onClose={onClose}
            onError={onError}></LogSelectedDirect>
          <Footer />
        </>
      }

      {
        isOfficeContextFound && authInfo && authInfo !== '' && authInfo !== 'NOT_FOUND' && cmd === "LogSelectedWithPreview" &&
        <>
          <Header onLogout={onLogout} />
          <div className='overflow-y-auto h-[calc(100vh-104px)] overflow-auto overscroll-contain'>
            <LogSelectedWithPreview
              authInfo={authInfo}
              itemLogStatus={itemLogStatus}
              infoData={infoData}
              afterSubmit={afterLogSubmitted}
              onClose={onClose}
              onError={onError}></LogSelectedWithPreview>
          </div>
          <Footer />
        </>
      }

      {
        isOfficeContextFound && authInfo && authInfo !== '' && authInfo !== 'NOT_FOUND' && cmd === "LogSelectedWithLink" &&
        <>
          <Header onLogout={onLogout} />
          <div className='overflow-y-auto h-[calc(100vh-104px)] overflow-x-auto overscroll-contain'>
            <LogSelectedWithLink
              authInfo={authInfo}
              itemLogStatus={itemLogStatus}
              infoData={infoData}
              afterSubmit={afterLogSubmitted}
              onClose={onClose}
              onError={onError}>
            </LogSelectedWithLink>
          </div>
          <Footer />
        </>
      }
    
      {
        !isOfficeContextFound &&
        
        (
          <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
          <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
            <div className="relative">
              <div className="absolute">
                <div className="">
                  <h1 className="my-2 text-gray-800 font-bold text-2xl">
                    Looks like you've found the doorway to the great nothing
                  </h1>
                  <p className="my-2 text-gray-800">Sorry about that!</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src={pageBreakImg} />
          </div>
        </div>)
      }
    </>
  );
}

export default App;


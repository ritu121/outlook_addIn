import { useEffect, useState } from 'react';
import ErrorComponent from './../components/ErrorComponent';
import LoggedAlreadyComponent from './../components/LoggedAlreadyComponent';
import SubmittedComponent from './../components/SubmittedComponent';
import SubmittingComponent from './../components/SubmittingComponent';
import { LogMail_Post_URL } from './../../env-constants';
import { ItemLogStatus } from './../../utils';
const SHOW_LOG = false;

const LogSelectedDirect = ({ authInfo, itemLogStatus, infoData, afterSubmit, onClose, onError }) => {

    const [log, setLog] = useState('');

    useEffect(async () => {
        if (authInfo && authInfo.authToken && itemLogStatus === ItemLogStatus.NOT_LOGGED && infoData) {
            const url = LogMail_Post_URL;
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + authInfo.authToken.substring(1, authInfo.authToken.length - 1),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...infoData, hostName: authInfo.hostDomainName, userName: authInfo.userName })
            }).catch((error) => {
                onError('Generic_Server_error', error);
            });

            if (rawResponse.status == 401) {
                onError('401_error', '')
            } else {
                const responseJson = await rawResponse.text().catch((error) => {
                    onError('Response_conversion_error', error);
                });
                if (responseJson !== "") {
                    afterSubmit();
                } else {
                    onError('', '');
                }
            }
        }
    }, [authInfo, infoData, itemLogStatus]);

    return (
        <div>
            {itemLogStatus === itemLogStatus.ERROR 
                && <ErrorComponent onClose={onClose} />}
            {(itemLogStatus === ItemLogStatus.VERIFYING || itemLogStatus === ItemLogStatus.NOT_LOGGED) 
                && <SubmittingComponent />}
            {itemLogStatus === ItemLogStatus.SUBMITTED 
                && <SubmittedComponent onClose={onClose} />}
            {itemLogStatus === ItemLogStatus.LOGGED_ALREADY 
                && <LoggedAlreadyComponent onClose={onClose} />}
            {SHOW_LOG && log !== "" && <div className="bg-orange-50 p-3 rounded-xl">{log}</div>}
        </div>
    );
}

export default LogSelectedDirect;
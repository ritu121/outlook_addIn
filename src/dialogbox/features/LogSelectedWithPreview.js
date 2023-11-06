import { useEffect, useState } from "react";
import { LogMail_Post_URL } from "./../../env-constants";
import { ItemLogStatus } from "../../utils";

import ErrorComponent from './../components/ErrorComponent';
import LoggedAlreadyComponent from './../components/LoggedAlreadyComponent';
import SubmittedComponent from './../components/SubmittedComponent';
import SubmittingComponent from './../components/SubmittingComponent';

const SHOW_LOG = false;

const LogSelectedWithPreview = ({ authInfo, itemLogStatus, infoData, afterSubmit, onClose, onError }) => {
    const [log, setLog] = useState("");

    const [loading, setLoading] = useState(false);
    const [selectedAttachments, setSelectedAttachments] = useState([]);

    useEffect(() => {
        if (infoData) {
            setSelectedAttachments(infoData.attachments);
        }
    }, [infoData]);

    const handleCheckboxChange = (event, attachment) => {
        if (event.target.checked) {
            setSelectedAttachments((prevSelected) => [...prevSelected, attachment]);
        } else {
            setSelectedAttachments((prevSelected) =>
                prevSelected.filter((selectedAttachment) => selectedAttachment !== attachment)
            );
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (authInfo && authInfo.authToken && itemLogStatus === ItemLogStatus.NOT_LOGGED && infoData) {
            const url = LogMail_Post_URL;
            const updatedInfoData = { ...infoData, attachments: selectedAttachments };
            const rawResponse = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authInfo.authToken.substring(1, authInfo.authToken.length - 1),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...updatedInfoData, hostName: authInfo.hostDomainName, userName: authInfo.userName }),
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
        setLoading(false);
    };

    return (
        <div>
            {itemLogStatus === itemLogStatus.ERROR && <ErrorComponent onClose={onClose} />}

            {(itemLogStatus === ItemLogStatus.VERIFYING || itemLogStatus === ItemLogStatus.NOT_LOGGED) &&
                infoData &&
                loading === false && (
                    <div >
                        <div className="pl-3 pt-3 bg-white">
                            <div className="p-3 flex-grow overflow-auto">
                                <div className="ml-6 mr-6 mt-3 mb-3">
                                    <div>
                                        <label className="text-base font-medium">From</label>
                                    </div>
                                    <div className="mt-1 w-full border p-3 rounded border-gray-300">
                                        {infoData.from}
                                    </div>
                                </div>

                                <div className="ml-6 mr-6 mt-3 mb-3">
                                    <div>
                                        <label className="text-base font-medium">Subject</label>
                                    </div>
                                    <div className="mt-1 w-full border p-3 rounded border-gray-300">
                                        {infoData.subject}
                                    </div>
                                </div>

                                <div className="ml-6 mr-6 mt-3 mb-3">
                                    <div>
                                        <label className="text-base font-medium">Body</label>
                                    </div>
                                    <div className="mt-1 w-full border p-3 rounded border-gray-300 max-h-56 overflow-y-auto"
                                        dangerouslySetInnerHTML={{__html: infoData.body}} />                                       
                                </div>
                                {infoData.attachments && infoData.attachments.length > 0 ? (
                                    <div className="ml-6 mr-6 mt-3 mb-20">
                                        <div>
                                            <label className="text-base font-medium text-[#07074D]">Attachments</label>
                                        </div>
                                        <div className="flex mt-3 w-full border border-gray-300 rounded min-h-[100px] overflow-y-auto">
                                            <ul className="w-full">
                                                {infoData.attachments.map((attachment, index) => (
                                                    <li key={index} className="p-1 mx-3 text-base font-medium flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`attachment-${index}`}
                                                            name={`attachment-${index}`}
                                                            defaultChecked={true}
                                                            className="mr-3 cursor-pointer"
                                                            onChange={(event) => handleCheckboxChange(event, attachment)}
                                                        />
                                                        <label htmlFor={`attachment-${index}`} className="cursor-pointer text-gray-600">{attachment.name}</label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="py-2 px-2 mt-auto mr-6 bg-gray-200 w-full flex bottom-12 justify-end text-sm md:text-xl fixed space-x-3 border-t-2">
                            <button
                                onClick={onClose}
                                className="bg-gray-500 py-3 px-3 text-white font-semibold rounded-lg hover:bg-gray-600"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-slt-blue hover:bg-slt-blue-light py-3 px-3 mr-6 text-white font-semibold rounded-lg"
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}

            {loading === true && <SubmittingComponent />}

            {itemLogStatus === ItemLogStatus.SUBMITTED && <SubmittedComponent onClose={onClose} />}

            {itemLogStatus === ItemLogStatus.LOGGED_ALREADY && <LoggedAlreadyComponent onClose={onClose} />}

            {SHOW_LOG && log !== "" && <div className="bg-orange-50 p-3 rounded-xl">{log}</div>}
        </div>
    );
};

export default LogSelectedWithPreview;

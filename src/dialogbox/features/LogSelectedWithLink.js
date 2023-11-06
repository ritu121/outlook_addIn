import { useEffect, useState } from "react";
import { ItemLogStatus } from "../../utils";
import { LogMail_Post_URL } from "./../../env-constants";
import { LinkTabsList_Get_URL } from "./../../env-constants";
import ErrorComponent from './../components/ErrorComponent';
import LoggedAlreadyComponent from './../components/LoggedAlreadyComponent';
import SubmittedComponent from './../components/SubmittedComponent';
import SubmittingComponent from './../components/SubmittingComponent';
import ListView from "../components/ListView";

const SHOW_LOG = false;

const LogSelectedWithLink = ({ authInfo, itemLogStatus, infoData, afterSubmit, onClose, onError }) => {
    const [log, setLog] = useState("");
    const [infodata, setInfodata] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedAttachments, setSelectedAttachments] = useState([]);

    const [listData, setListData] = useState({});
    const [listLoadInfo, setListLoadInfo] = useState({});

    const [activeTab, setActiveTab] = useState("Preview");

    const [selectedOptionOp, setSelectedOptionOp] = useState("ByMyDate");
    const [selectedOptionCO, setSelectedOptionCO] = useState("ByMyDate");
    const [selectedOptionPR, setSelectedOptionPR] = useState("BYAllDate");
    const [selectedOptionQT, setSelectedOptionQT] = useState("ByMyDate");
    const [selectedOptionCN, setSelectedOptionCN] = useState("BYAllDate");

    const [enteredTextOP, setEnteredTextOP] = useState("");
    const [enteredTextCO, setEnteredTextCO] = useState("");
    const [enteredTextPR, setEnteredTextPR] = useState("");
    const [enteredTextQT, setEnteredTextQT] = useState("");
    const [enteredTextCN, setEnteredTextCN] = useState("");

    const [selectedLinkValues, setSelectedLinkValues] = useState({
        linkRelatedValue1: "",
        linkRelatedValue2: "",
        linkRelatedValue3: "",
        linkRelatedValue4: "",
        linkRelatedValue6: "",
    });

    const [selectedFieldValues, setSelectedFieldValues] = useState({
        linkRelatedField1: "",
        linkRelatedField2: "",
        linkRelatedField3: "",
        linkRelatedField4: "",
        linkRelatedField6: "",
    });

    const tabsList  = [
        { title: 'Previewtab', tabWidth: 'w-40' },
        // { title: 'Opportunity', linkValue: 'linkRelatedValue1', tabWidth: 'w-48' },
        { title: 'Contact', linkValue: 'linkRelatedValue6', tabWidth: 'w-44' },
        { title: 'Project', linkValue: 'linkRelatedValue3', tabWidth: 'w-44' },
        { title: 'Quote', linkValue: 'linkRelatedValue4', tabWidth: 'w-36' },
        { title: 'Company', linkValue: 'linkRelatedValue2', tabWidth: 'w-40' },
    ];

    useEffect(() => {
        if (infoData) {
            setInfodata(infoData);
            setSelectedAttachments(infoData.attachments);
        }
    }, [infoData, authInfo]);

    const fetchDataOfTab = async (tabName, sCondition, sFields) => {
        const url = LinkTabsList_Get_URL;
        setListLoadInfo({ ...listLoadInfo, [tabName]: true });
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + authInfo.authToken.substring(1, authInfo.authToken.length - 1),
                Accept: "application/text",
                "Content-Type": "application/text",
            },
            body: JSON.stringify({
                sFile: tabName,
                iType: 3,
                sCondition,
                sSort: " DTT_CreationTime DESC",
                sFields,
                iTop: 10000,
                sINI: "",
                par_sGenFieldsDefs: "",
                hostName: authInfo.hostDomainName,
                userName: authInfo.userName,
            }),
        });
        if (response.status === 401) {
            onError("401_error", "");
            setListLoadInfo({ ...listLoadInfo, [tabName]: false });
        } else {
            const data = await response.text();
            setListData({ ...listData, [tabName]: JSON.parse(data) });
            setListLoadInfo({ ...listLoadInfo, [tabName]: false });
        }
    };

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        let tabName = '';
        let sCondition = '';

        switch (tab) {
            // case "Opportunity":
            //     tabName = "OP";
            //     if (selectedOptionOp === 'ByMyDate') {
            //         sCondition = "LNK_CREATEDBY_US='<%MEID%>'";
            //     }
            //     break;
            case "Company":
                tabName = "CN";
                if (selectedOptionCN === 'ByMyDate') {
                    sCondition = "LNK_CREATEDBY_US='<%MEID%>'";
                }
                break;
            case "Contact":
                tabName = "CO";
                if (selectedOptionCO === 'ByMyDate') {
                    sCondition = "LNK_CREATEDBY_US='<%MEID%>'";
                }
                break;
            case "Project":
                tabName = "PR";
                if (selectedOptionPR === 'ByMyDate') {
                    sCondition = "LNK_CREATEDBY_US='<%MEID%>'";
                }
                break;
            case "Quote":
                tabName = "QT";
                if (selectedOptionQT === 'ByMyDate') {
                    sCondition = "LNK_CREATEDBY_US='<%MEID%>'";
                }
                break;
        }

        let sFields = 'GID_ID,SYS_NAME'; // CO and CN

        if (tabName === "OP" || tabName === "QT") {
            sFields = 'GID_ID, dte_expclosedate, SYS_NAME';
        } else if (tabName === "PR") {
            sFields = 'GID_ID, DTE_TIME, SYS_NAME';
        }
        fetchDataOfTab(tabName, sCondition, sFields);
    };

    const handleAttachmentsCheckboxChange = (event, attachment) => {
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
            const updatedInfoData = { ...infodata, attachments: selectedAttachments };
            // console.log("updatedInfoData", updatedInfoData);
            // console.log("selectedLinkValues", selectedLinkValues);
            // console.log("selected Field value", selectedFieldValues);
            // console.log(
            //     JSON.stringify({
            //         ...updatedInfoData,
            //         ...selectedLinkValues,
            //         ...selectedFieldValues,
            //         token: authInfo.authToken,
            //         hostName: authInfo.hostDomainName,
            //         userName: authInfo.userName,
            //     })
            // );
            const rawResponse = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authInfo.authToken.substring(1, authInfo.authToken.length - 1),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...updatedInfoData,
                    ...selectedLinkValues,
                    ...selectedFieldValues,
                    token: authInfo.authToken,
                    hostName: authInfo.hostDomainName,
                    userName: authInfo.userName,
                }),
            }).catch((error) => {
                onError("Generic_Server_error", error);
            });
            if (rawResponse.status == 401) {
                onError("401_error", "");
            }
            const responseJson = await rawResponse.text().catch((error) => {
                onError("Response_conversion_error", error);
            });
            if (responseJson !== "") {
                afterSubmit();
            } else {
                onError("", "");
            }
            setLoading(false);
        }
    };

    const renderLabelValue = (name, value) => {
        return (
            <div className="ml-6 mr-6 mt-3 mb-3">
                <div>
                    <label className="text-base font-medium">{name}</label>
                </div>
                <div className="mt-1 w-full border p-3 rounded border-gray-300 max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: value }} />
            </div>
        );
    };


    const onTextFieldChanged = (value, Tabname) => {
        switch (Tabname) {
            case "OP":
                setEnteredTextOP(value);
                break;
            case "CN":
                setEnteredTextCN(value);
                break;
            case "CO":
                setEnteredTextCO(value);
                break;
            case "PR":
                setEnteredTextPR(value);
                break;
            case "QT":
                setEnteredTextQT(value);
                break;
        }
    };


    const OnClickOfGo = async (tabName, text) => {
        let option = '';
        let condition = '';
        switch (tabName) {
            case "OP":
                setEnteredTextOP(text);
                option = selectedOptionOp;
                break;
            case "CN":
                setEnteredTextCN(text);
                option = selectedOptionCN;
                break;
            case "CO":
                setEnteredTextCO(text);
                option = selectedOptionCO;
                break;
            case "PR":
                setEnteredTextPR(text);
                option = selectedOptionPR;
                break;
            case "QT":
                setEnteredTextQT(text);
                option = selectedOptionQT;
                break;
        }

        if (option === "ByMyDate") {
            condition = `LNK_CREATEDBY_US='<%MEID%>'`;
            if (text) {
                condition = `LNK_CREATEDBY_US='<%MEID%>' AND SYS_NAME["${text}"]`;
            }
        } else if (option === "BYAllDate") {
            condition = "";
            if (text) {
                condition = `LNK_CREATEDBY_US='' AND SYS_NAME["${text}"]`;
            }
        }

        let sFields = 'GID_ID,SYS_NAME';
        if (tabName === "OP" || tabName === "QT") {
            sFields = 'GID_ID, dte_expclosedate, SYS_NAME';
        } else if (tabName === "PR") {
            sFields = 'GID_ID, DTE_TIME, SYS_NAME';
        }

        fetchDataOfTab(tabName, condition, sFields);
    };

    const renderPreviewTabContent = () => {
        let heightAdjustment = 'h-[calc(100vh-500px)]';
        if(infodata.attachments && infodata.attachments.length > 0){
            heightAdjustment = 'h-[calc(100vh-640px)]';
        }

        return (
            <>
                {renderLabelValue("From", infodata.from)}
                {renderLabelValue("Subject", infodata.subject)}
                <div className="ml-6 mr-6 mt-3 mb-3">
                    <div>
                        <label className="text-base font-medium">Body</label>
                    </div>
                    <div className={`${heightAdjustment} mt-1 w-full border p-3 rounded border-gray-300 overflow-y-auto`}
                        dangerouslySetInnerHTML={{ __html: infodata.body }} />
                </div>
                {infodata.attachments && infodata.attachments.length > 0 && (
                    <div className="ml-6 mr-6 mt-3 mb-20">
                        <div>
                            <label className="text-base font-medium text-[#07074D]">Attachments</label>
                        </div>
                        <div className="mt-1 w-full border border-gray-300 rounded h-24 overflow-y-auto">
                            <ul className="w-full">
                                {infodata.attachments.map((attachment, index) => (
                                    <li key={index} className="p-1 mx-3 text-base font-medium flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`attachment-${index}`}
                                            name={`attachment-${index}`}
                                            defaultChecked={true}
                                            className="mr-3 cursor-pointer"
                                            onChange={(event) => handleAttachmentsCheckboxChange(event, attachment)}
                                        />
                                        <label htmlFor={`attachment-${index}`} className="cursor-pointer text-gray-600">{attachment.name}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const isTabListHasSelection = (linkRelatedValue) => {
        switch (linkRelatedValue) {
            case "linkRelatedValue1":
                return selectedLinkValues["linkRelatedValue1"] !== "";
            case "linkRelatedValue2":
                return selectedLinkValues["linkRelatedValue2"] !== "";
            case "linkRelatedValue3":
                return selectedLinkValues["linkRelatedValue3"] !== "";
            case "linkRelatedValue4":
                return selectedLinkValues["linkRelatedValue4"] !== "";
            case "linkRelatedValue6":
                return selectedLinkValues["linkRelatedValue6"] !== "";
            default:
                return false;
        }
    };

    const fetchListByTabAndOption = (tabName, option) => {
        switch (tabName) {
            case "OP":
                setSelectedOptionOp(option);
                break;
            case "CO":
                setSelectedOptionCO(option);
                break;
            case "PR":
                setSelectedOptionPR(option);
                break;
            case "QT":
                setSelectedOptionQT(option);
                break;
            case "CN":
                setSelectedOptionCN(option);
                break;
            default:
                break;
        }

        let sCondition = '';
        if (option === 'ByMyDate') {
            sCondition = "LNK_CREATEDBY_US='<%MEID%>'";
        }

        let sFields = 'GID_ID,SYS_NAME'; // CO and CN

        if (tabName === "OP" || tabName === "QT") {
            sFields = 'GID_ID, dte_expclosedate, SYS_NAME';
        } else if (tabName === "PR") {
            sFields = 'GID_ID, DTE_TIME, SYS_NAME';
        }

        fetchDataOfTab(tabName, sCondition, sFields);
    }

    const onListItemSelected = (tabName, itemValue) => {
        let fieldName = '';
        let valueName = '';
        switch (tabName) {
            case 'OP':
                fieldName = 'linkRelatedField1';
                valueName = 'linkRelatedValue1';
                break;
            case 'CO':
                fieldName = 'linkRelatedField6';
                valueName = 'linkRelatedValue6';
                break;
            case 'PR':
                fieldName = 'linkRelatedField3';
                valueName = 'linkRelatedValue3';
                break;
            case 'QT':
                fieldName = 'linkRelatedField4';
                valueName = 'linkRelatedValue4';
                break;
            case 'CN':
                fieldName = 'linkRelatedField2';
                valueName = 'linkRelatedValue2';
                break;
            default:
                break;
        }


        setSelectedLinkValues((prevSelectedLinkValues) => {
            const isSelected = prevSelectedLinkValues[valueName] === itemValue;
            const selectedCount = Object.values(prevSelectedLinkValues).filter(Boolean).length;
            if (isSelected || selectedCount < 4 || prevSelectedLinkValues[valueName]) {
                const updatedSelectedLinkValues = {
                    ...prevSelectedLinkValues,
                    [valueName]: isSelected ? "" : itemValue,
                };
                setSelectedFieldValues((prevSelectedFieldValues) => ({
                    ...prevSelectedFieldValues,
                    [fieldName]: isSelected ? "" : `LNK_RELATED_${tabName}`,
                }));
                return updatedSelectedLinkValues;
            }
            return prevSelectedLinkValues;
        });

    }

    const isListEnabled = () => {
        let selectedCount = 0;
        for (let linkValue in selectedLinkValues) {
            if (selectedLinkValues[linkValue] !== '') {
                selectedCount++;
            }
        }
        return selectedCount < 4;
    }

    return (
        <div>
            {itemLogStatus === itemLogStatus.ERROR && <ErrorComponent onClose={onClose} />}

            {(itemLogStatus === ItemLogStatus.VERIFYING || itemLogStatus === ItemLogStatus.NOT_LOGGED) &&
                loading === false && (
                    <div>
                        <div className=" pt-3 flex flex-col bg-white">
                            <div className="sticky ">
                                <nav className="flex flex-col sm:flex-row text-sm md:text-xl bg-gray-200">
                                    {tabsList.map((tab, index) => {
                                        return <button key={index}
                                            className={`${activeTab === tab.title
                                                ? "text-blue-700 border-t-2 border-t-gray-100 bg-white"
                                                : "text-gray-700 bg-gray-200"
                                                } py-4 px-6 block hover:text-blue-600 focus:outline-none ${tab.tabWidth}`}
                                            onClick={() => handleTabSelect(tab.title)}
                                        >
                                            {tab.title}
                                            {tab.linkValue && isTabListHasSelection(tab.linkValue) && (
                                                <svg
                                                    className="w-4 h-4 inline-block ml-2"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8 12.3333L10.4615 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                        stroke="green"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    })}
                                </nav>
                            </div>
                            <div className="p-3">
                                {activeTab === 'Preview' && renderPreviewTabContent()}
                                {activeTab === 'Opportunity'
                                    && <ListView
                                        selectedDropDownOption={selectedOptionOp}
                                        listLoadInfo={listLoadInfo['OP']}
                                        isListEnabled={isListEnabled()}
                                        OnClickOfGo={OnClickOfGo}
                                        selectedListItemValue={selectedLinkValues.linkRelatedValue1}
                                        onTextFieldChanged={onTextFieldChanged}
                                        tabName={'OP'}
                                        enteredText={enteredTextOP}
                                        listData={listData['OP']}
                                        onSelectedOptionChanged={fetchListByTabAndOption}
                                        onListItemSelected={onListItemSelected} />}
                                {activeTab === 'Contact'
                                    && <ListView
                                        selectedDropDownOption={selectedOptionCO}
                                        listLoadInfo={listLoadInfo['CO']}
                                        isListEnabled={isListEnabled()}
                                        OnClickOfGo={OnClickOfGo}
                                        onTextFieldChanged={onTextFieldChanged}
                                        selectedListItemValue={selectedLinkValues.linkRelatedValue6}
                                        tabName={'CO'}
                                        enteredText={enteredTextCO}
                                        listData={listData['CO']}
                                        onSelectedOptionChanged={fetchListByTabAndOption}
                                        onListItemSelected={onListItemSelected} />}
                                {activeTab === 'Project'
                                    && <ListView
                                        selectedDropDownOption={selectedOptionPR}
                                        listLoadInfo={listLoadInfo['PR']}
                                        isListEnabled={isListEnabled()}
                                        OnClickOfGo={OnClickOfGo}
                                        onTextFieldChanged={onTextFieldChanged}
                                        selectedListItemValue={selectedLinkValues.linkRelatedValue3}
                                        enteredText={enteredTextPR}
                                        tabName={'PR'}
                                        listData={listData['PR']}
                                        onSelectedOptionChanged={fetchListByTabAndOption}
                                        onListItemSelected={onListItemSelected} />}
                                {activeTab === 'Quote'
                                    && <ListView
                                        selectedDropDownOption={selectedOptionQT}
                                        listLoadInfo={listLoadInfo['QT']}
                                        isListEnabled={isListEnabled()}
                                        OnClickOfGo={OnClickOfGo}
                                        onTextFieldChanged={onTextFieldChanged}
                                        selectedListItemValue={selectedLinkValues.linkRelatedValue4}
                                        tabName={'QT'}
                                        enteredText={enteredTextQT}
                                        listData={listData['QT']}
                                        onSelectedOptionChanged={fetchListByTabAndOption}
                                        onListItemSelected={onListItemSelected} />}
                                {activeTab === 'Company'
                                    && <ListView
                                        selectedDropDownOption={selectedOptionCN}
                                        listLoadInfo={listLoadInfo['CN']}
                                        OnClickOfGo={OnClickOfGo}
                                        isListEnabled={isListEnabled()}
                                        onTextFieldChanged={onTextFieldChanged}
                                        selectedListItemValue={selectedLinkValues.linkRelatedValue2}
                                        enteredText={enteredTextCN}
                                        tabName={'CN'}
                                        listData={listData['CN']}
                                        onSelectedOptionChanged={fetchListByTabAndOption}
                                        onListItemSelected={onListItemSelected} />}
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
                    </div>
                )}

            {loading === true && <SubmittingComponent />}

            {itemLogStatus === ItemLogStatus.SUBMITTED && <SubmittedComponent onClose={onClose} />}

            {itemLogStatus === ItemLogStatus.LOGGED_ALREADY && <LoggedAlreadyComponent onClose={onClose} />}

            {SHOW_LOG && log !== "" && <div className="bg-orange-50 p-3 rounded-xl">{log}</div>}
        </div>
    );
};

export default LogSelectedWithLink;
3
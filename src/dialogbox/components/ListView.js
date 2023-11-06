import React, { useEffect, useState } from "react";


const ListView = ({
    tabName,
    listData,
    listLoadInfo,
    onSelectedOptionChanged,
    onListItemSelected,
    selectedListItemValue,
    onTextFieldChanged,
    OnClickOfGo,
    isListEnabled,
    enteredText,
    selectedDropDownOption }) => {

    const [text, setText] = useState("");
    const handleOptionChange = (event) => {
        const value = event.target.value;
        onSelectedOptionChanged(tabName, value);
    };

    const handleTextChange = (event) => {
        const value = event.target.value;
        setText(value);
        onTextFieldChanged(value, tabName)
    };

    const handleGoClick = () => {
        OnClickOfGo(tabName, enteredText);
    }

    const renderSearchAndGo = () => {
        return (
            <>
                <div className="flex pl-6 py-3 mr-3 w-full">
                    <div className="px-4 pr-3 mr-3 border border-gray-300 rounded space-x-3">
                        <select
                            className="pr-3 mt-3 focus:border-gray-500 focus:outline-none"
                            value={selectedDropDownOption}
                            onChange={(event) => handleOptionChange(event)}
                        >
                            <option key="ByMyDate" value="ByMyDate">My By Date/Time</option>
                            <option key="BYAllDate" value="BYAllDate">ALL By Date/Time</option>
                        </select>

                    </div>
                    <div className="flex mr-3">
                        <input
                            type="text"
                            maxLength={50}
                            className="px-5 py-3 border border-gray-300 rounded h-14 focus:border-gray-500"
                            placeholder="Enter text here..."
                            value={enteredText}
                            onChange={(event) => handleTextChange(event)}
                        />
                    </div>
                    <div>
                        <button
                            className="bg-slt-blue hover:bg-slt-blue-light h-14 p-3 mt-0 text-white font-semibold text-sm md:text-xl rounded-md"
                            onClick={() => handleGoClick()}
                        >
                            GO
                        </button>
                    </div>
                </div>

                <div className="border  mt-3 ml-6 mr-6 border-gray-300 rounded-md">
                    <div className="flex bg-gray-200">
                        <div className="w-[40px] py-2">{''}</div>
                        <div className="flex w-full">
                            {
                                (tabName === 'CO' || tabName === 'CN') &&
                                <div className="w-full py-2">Name</div>
                            }
                            {
                                tabName === 'PR' &&
                                <>
                                    <div className="w-2/12 py-2">Date</div>
                                    <div className="w-10/12 py-2">Name</div>
                                </>
                            }
                            {(tabName === 'OP' || tabName === 'QT') &&
                                <>
                                    <div className="w-2/12 py-2">Close Date</div>
                                    <div className="w-10/12 py-2">Name</div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="h-[calc(100vh-420px)] overflow-y-auto">
                        {listLoadInfo &&
                            <div className="p-4 mb-4 text-sm text-blue-800 h-12 m-3 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                <span className="font-medium">Loading...</span>
                            </div>
                        }

                        {
                            !listLoadInfo &&
                            <ul className="w-full">
                                {listData &&
                                    listData.length > 0 ?
                                    (listData.map((item, index) => (
                                        <li
                                            key={item.GID_ID}
                                            onClick={() => onListItemSelected(tabName, item.GID_ID)}
                                            className={`flex py-2 text-base ${index !== listData.length ? "border-b border-gray-300 cursor-pointer" : ""
                                                }`}
                                        >

                                            <div className="flex w-full">
                                                <div className="w-[40px] py-0">
                                                    <svg
                                                        className={`w-6 h-6 ml-3 mr-3`}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        {item.GID_ID === selectedListItemValue ? (
                                                            <path
                                                                d="M8 12.3333L10.4615 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="green"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        ) : (
                                                            <path
                                                                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke={isListEnabled ? "green" : "darkgrey"}
                                                                fill={isListEnabled ? "" : "lightgrey"}
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        )}
                                                    </svg>
                                                </div>
                                                <div className="flex w-full">
                                                    {
                                                        (tabName === 'CO' || tabName === 'CN') &&
                                                        <div className="w-full">{item.SYS_NAME}</div>
                                                    }
                                                    {
                                                        tabName === 'PR' &&
                                                        <>
                                                            <div className="w-2/12">{item.DTE_TIME}</div>
                                                            <div className="w-10/12">{item.SYS_NAME}</div>
                                                        </>
                                                    }
                                                    {(tabName === 'OP' || tabName === 'QT') &&
                                                        <>
                                                            <div className="w-2/12">{item.DTE_EXPCLOSEDATE}</div>
                                                            <div className="w-10/12">{item.SYS_NAME}</div>
                                                        </>
                                                    }
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </li>
                                    )))
                                    : <li className="m-3">
                                        <div className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300" role="alert">
                                            <span className="font-medium">No items found!</span>
                                        </div></li>
                                }
                            </ul>
                        }
                    </div>
                </div>
            </>
        );
    };


    return (renderSearchAndGo());
}

export default ListView;
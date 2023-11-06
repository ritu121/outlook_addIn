
export const formatDate = (d) => {
    var date = new Date(d);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

export const ItemLogStatus = {
    VERIFYING: "VERIFYING",
    NOT_LOGGED: "NOT_LOGGED",
    LOGGED_ALREADY: "LOGGED_ALREADY",
    SUBMITTING: "SUBMITTING",
    SUBMITTED: 'SUBMITTED',
    ERROR: 'ERROR'
}

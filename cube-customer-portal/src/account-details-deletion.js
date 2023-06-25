
const timeOut = 8*60*60*1000; //in milliseconds

export function setTimer() {
    localStorage.setItem("detailsFetchedAt", Date.now());
}

export function clearAfterTime() {
    const detailedFetchedAt = localStorage.getItem("detailsFetchedAt");
    const timePassed = Date.now() - Number(detailedFetchedAt);

    if (timePassed > timeOut) {
        removeAccountData()
    }
}

export function removeAccountData(){
    localStorage.removeItem("token");
    localStorage.removeItem("userRelations");
    localStorage.removeItem("activeRelation");
    localStorage.removeItem("detailsFetchedAt");
}


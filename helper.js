function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
    if (!rows) {
        return [{messge: 'No data was return', error: true}];
    }
    return rows;
}

module.exports = {
    getOffset,
    emptyOrRows
}
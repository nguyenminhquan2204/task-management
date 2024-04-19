module.exports = (objectPagination, query, countRecords) => {
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    if(query.limit) {
        objectPagination.limitItems = parseInt(query.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    // console.log(objectPagination.skip);

    // Dem so luong san pham co trong database
    const totalPage = Math.ceil(countRecords/objectPagination.limitItems);
    objectPagination.totalPage = totalPage;

    return objectPagination;
}
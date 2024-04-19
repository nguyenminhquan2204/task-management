const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    // console.log(req.query);
    const find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status;
    }
    
    // Sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // End Sort

    // Page
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 2,
        },
        req.query,
        countTasks
    );
    // End Page

    const tasks = await Task.find(find)
        .sort(sort)  // asc (theo tang dan), desc (theo giam dan)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.json(tasks);
};

// [GET] /api/v1/tasks/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(task);
    } catch (error) {
        // res.redirect("/tasks");
        res.json("Not find");
    }
};
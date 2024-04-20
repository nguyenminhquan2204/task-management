const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");


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

    const objectSearch = searchHelper(req.query);
    if(req.query.keyword) {
        find.title = objectSearch.regex;
        // console.log(find.title);
    }

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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try{
        const id = req.params.id;
        // console.log(req.body);

        const status = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch(error) {
        res.json({
            code:400,
            message: "Không tồn tại"
        });
    }
};

// [PATCH] /api/v1/tasks/changeMulti
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        switch(key){
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cap nhat trang thai thanh cong"
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Khong ton tai"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Khong ton tai"
        });
    }
};
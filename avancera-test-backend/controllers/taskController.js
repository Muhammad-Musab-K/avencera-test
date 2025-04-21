const db = require("../config/db");

exports.getTasks = (req, res) => {
    db.query("SELECT * FROM task_table", (err, results) => {
        if (err) return res.status(500).json({ message: err, success: false });
        res.json({ tasks: results, success: true, message: 'Tasks fetched successfully' });
    });
};

exports.createTask = (req, res) => {
    const { title, description, status, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }
    if (!dueDate) {
        return res.status(400).json({ error: "dueDate is required" });
    }

    const insertSql = "INSERT INTO task_table (title, description, status, dueDate) VALUES (?, ?, ?, ?)";
    db.query(insertSql, [title, description, status || "pending", dueDate], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        const taskId = result.insertId;

        const fetchSql = "SELECT * FROM task_table WHERE id = ?";
        db.query(fetchSql, [taskId], (err, rows) => {
            if (err) return res.status(500).json({ message: err, success: false });

            res.status(201).json({
                message: "Task created",
                taskId,
                task: rows[0],
                success: true
            });
        });
    });
};


exports.updateTask = (req, res) => {
    const id = req.params.id;
    const { title, description, status, dueDate } = req.body;

    const sql = `
        UPDATE task_table 
        SET title=?, description=?, status=?, dueDate=?, updatedAt=NOW()
        WHERE id=?`;
    db.query(sql, [title, description, status, dueDate, id], (err) => {
        if (err) return res.status(500).json({ error: err });

        const fetchSql = "SELECT * FROM task_table WHERE id = ?";
        db.query(fetchSql, [id], (err, rows) => {
            if (err) return res.status(500).json({ message: err, success: false });

            res.status(200).json({
                message: "Task updated",
                taskId: id,
                task: rows[0],
                success: true
            });
        });
    });
};


exports.deleteTask = (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM task_table WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ message: err, success: false });
        res.json({ message: "Task deleted", success: true });
    });
};


exports.getTaskById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM task_table WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: err, success: false });

        if (results.length === 0) {
            return res.status(404).json({ message: "Task not found", success: false });
        }

        res.json({
            task: results[0],
            message: "Task fetched successfully",
            success: true
        });
    });
};

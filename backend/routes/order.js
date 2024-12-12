const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/checkout', (req, res)=>{
    // console.log('Request body:', req.body);

    const { username, menu_item_ids, total_price, status } = req.body;

    // Validate request body
    if (!username || !menu_item_ids || !total_price || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (status !== 'paid' && status !== 'pending') {
        return res.status(400).json({ message: 'Invalid status value' });
    }
    console.log('Menu Item IDs:', menu_item_ids);

    const orderTime = new Date();
    const sql = 'INSERT INTO `orders` (customer_username, item_ids, total_price, status, order_time) VALUES (?, ?, ?, ?, ?)';

    console.log('Executing SQL:', sql);
    console.log('With values:', [username, JSON.stringify(menu_item_ids), total_price, status, orderTime]);

    db.query(sql, [username, JSON.stringify(menu_item_ids), total_price, status, orderTime], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Order placed successfully', orderId: result.insertId });
    });
});


router.get('/pending', (req, res) => {
    const sql = 'SELECT * FROM orders WHERE status = "pending"';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        // Send the orders back to the client
        res.json(results); 
    });
});


router.put('/complete/:orderId', (req, res) => {
    const { orderId } = req.params;
    console.log('Received order ID:', orderId);

    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    const sql = 'UPDATE orders SET status = "paid" WHERE order_id = ?';
    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'Order updated to paid' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    });
});



// Get total pending and completed orders count
router.get('/counts', (req, res) => {
    const sqlPending = 'SELECT COUNT(*) AS pendingCount FROM orders WHERE status = "pending"';
    const sqlCompleted = 'SELECT COUNT(*) AS completedCount FROM orders WHERE status = "paid"';

    db.query(sqlPending, (err, pendingResult) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        db.query(sqlCompleted, (err, completedResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            // Send both counts in the response
            res.json({
                pendingCount: pendingResult[0].pendingCount,
                completedCount: completedResult[0].completedCount
            });
        });
    });
});


module.exports = router;

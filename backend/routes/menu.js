const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:item_type', (req, res) => {
    const { item_type } = req.params;

    const sql = 'SELECT * FROM menu WHERE item_type = ?';
    db.query(sql, [item_type], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results); 
    });
});



router.delete('/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    try {
        // Query to delete the item by its ID from the 'menu' table
        const result = await db.query('DELETE FROM menu WHERE menu_item_id = ?', [itemId]);

        if (result.affectedRows > 0) {
            // If item was deleted successfully
            res.status(200).json({ message: 'Item removed successfully' });
        } else {
            // If no item was found with the given ID
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        // Catch any errors and respond with a 500 server error
        console.error('Error deleting item from database:', error);
        res.status(500).json({ message: 'Database error' });
    }
});



router.post('/', (req, res) => {
    const { name, price, item_type, image } = req.body;
    console.log(name , price , item_type , image);
    if (!name || !price || !item_type) {
        return res.status(400).json({ message: 'All fields are required: name, price, item_type, and image' });
    }
    const sql = 'INSERT INTO menu (item_type, name ,  price,image) VALUES (?, ?, ?, ?)';
    db.query(sql, [item_type, name ,  price,  image], (err, results) => {
        if (err) {
            console.error('Error inserting item into database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.status(201).json({ message: 'Item added successfully', itemId: results.insertId });
    });
});


module.exports = router;

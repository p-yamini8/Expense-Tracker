
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const auth = require('../middleware/auth');

router.post('/add-expense', auth.authenticate, expenseController.addExpense);
router.get('/getexpenses', auth.authenticate, expenseController.getExpenses);
router.delete('/delete-expense/:expenseId', auth.authenticate, expenseController.deleteExpense);
router.get('/download', auth.authenticate, expenseController.downloadExpenses);
router.get('/getAllDownloadUrl', auth.authenticate, expenseController.downloadAllUrl);
router.get('/premium-leaderboard', auth.authenticate, expenseController.getAllUserExpenses);
router.get('/showleaderboard',expenseController.showleaderboard);
// routes/expense.js
router.put('/update-expense/:id', auth.authenticate, expenseController.updateExpense);
module.exports = router;

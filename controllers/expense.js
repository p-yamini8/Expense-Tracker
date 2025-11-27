
const Expense = require('../models/expense');
const User = require('../models/users');
const S3services = require('../services/S3services');
const ExpenseServices = require('../services/expenseservices');
const Sequelize=require('sequelize');
const sequelize=require('../util/database')
const downloadfile=require('../models/downloadurls');
exports.addExpense = async (req, res) => {
  const { exp_amt, disc, ctg, note } = req.body;
  if (!exp_amt || !disc || !ctg)
    return res.status(400).json({ message: 'Enter all details' });
 const t=await sequelize.transaction();
  try {
    const expense = await Expense.create({ exp_amt, disc, ctg, userId: req.user.id, note },{transaction:t});
     console.log('Adding expenses',{exp_amt,disc,ctg,userId:req.user.id,note})
await req.user.save({transaction:t});
await t.commit();
    res.status(201).json({ data: expense,message:"Expense added successfully", success: true });
  } catch (err) {
await t.rollback();
    res.status(500).json({ message: err.message });
    console.error('error in adding expenses', err)
  }
};

exports.getExpenses = async (req, res) => {
  const page = +req.query.page || 1;
  const itemsPerPage = +req.query.itemsPerPage || 3;

  try {
    const total = await Expense.count({ where: { userId: req.user.id } });
    const data = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage
    });
  
    
     res.status(200).json({message:'Expenses fetched sucessfully',
      data,
      info: {
        currentPage: page,
        hasNext: total > page * itemsPerPage,
        hasPrev: page > 1,
        lastPage: Math.ceil(total / itemsPerPage),
        itemsPerPage,
        total
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { expenseId } = req.params;
    const t=await sequelize.transaction();
  try {
    const deleted = await Expense.destroy({ where: { id: expenseId, userId: req.user.id },transaction:t});
    if (!deleted) {
      await t.rollback();
 return res.status(404).json({ message: 'Not found or unauthorized' });
    }
     await req.user.save({transaction:t})
  await t.commit();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
     await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.downloadExpenses = async (req, res) => {
  
  try {
    const data = JSON.stringify(await ExpenseServices.getExpenses(req));
    const filename = `expenses${req.user.id}_${new Date().toISOString()}.txt`;
    const fileURL = await S3services.uploadToS3(data, filename);
     console.log('filename',fileURL,filename)
    const downloadUrlData = await downloadfile.create({ fileUrl: fileURL, fileName: filename,userId:req.user.id });
    
    res.status(200).json({ fileURL, downloadUrlData, success: true });
   
  } catch (err) {
    
    console.log('error download expenses',err)
    res.status(500).json({ message: err.message });
  }
};


exports.downloadAllUrl = async (req, res) => {
    
  try {
    console.log('123')
    const urls = await req.user.getDownloadurls();
    if (!urls.length) return res.status(404).json({ message: 'No URLs yet' });
    res.status(200).json({ urls, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUserExpenses = async (req, res) => {
   
  if (!req.user.ispremiumuser) return res.status(403).json({ message: 'Premium only' });
  try {

    const users = await User.findAll({ attributes: ['name', 'id'] });
    console.log('user',users);
    const leaderboard = await Promise.all(users.map(async u => {
      const exps = await u.getExpenses();
      console.log('expenses',exps)
      return { user: u, totalExpense: exps.reduce((sum, e) => sum + e.exp_amt, 0) };
    }));console.log("leaderboard",leaderboard)
    res.json({ data: leaderboard.sort((a,b)=>b.totalExpense-a.totalExpense), success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.showleaderboard = async (req, res) => {
   
    try {
        const leaderboard = await User.findAll({attributes:['id','name',  [sequelize.fn('SUM', sequelize.col('expenses.exp_amt')), 'totalExpense']],
            include:[{
                model:Expense,  attributes: [],
                }],
                // include: [{ model: User, attributes: ['email'] }],
                group: ['user.id'],
                order: [[sequelize.fn('SUM', sequelize.col('expenses.exp_amt')), 'DESC']]

            
          
        });
console.log('show expens',leaderboard)
        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard', error);
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
};

// controllers/expense.js
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { exp_amt, disc, ctg ,note} = req.body;

    const expense = await Expense.findOne({ where: { id, userId: req.user.id } });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.exp_amt = exp_amt;
    expense.disc = disc;
    expense.ctg = ctg;
expense.note=note;
    await expense.save();

    res.json({ message: "Expense updated", expense });
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
};
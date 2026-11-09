'use strict';
const assert=require('node:assert/strict');
require('../balance-utils.js');
const {summarizeCashbook,materialBalance}=globalThis.RVBalance;
function eq(actual,expected,label){assert.deepEqual(actual,expected,label)}
const ledger=[
 {employeeId:'A',type:'Advance',amount:1000},
 {employeeId:'A',type:'Advance',amount:250.50},
 {employeeId:'A',type:'Recovery',amount:300.25},
 {employeeId:'A',type:'Payment',amount:500},
 {employeeId:'B',type:'Advance',amount:200},
 {employeeId:'B',type:'Recovery',amount:250},
 {employeeId:'B',type:'Payment',amount:75}
];
eq(summarizeCashbook(ledger,'A'),{advances:1250.5,payments:500,recovered:300.25,outstanding:950.25,excessRecovery:0,invalidEntries:0},'employee A balance');
eq(summarizeCashbook(ledger,'B'),{advances:200,payments:75,recovered:250,outstanding:0,excessRecovery:50,invalidEntries:0},'employee B over-recovery');
eq(summarizeCashbook(ledger),{advances:1450.5,payments:575,recovered:550.25,outstanding:950.25,excessRecovery:50,invalidEntries:0},'combined ledger totals');
eq(summarizeCashbook([]),{advances:0,payments:0,recovered:0,outstanding:0,excessRecovery:0,invalidEntries:0},'empty ledger');
eq(summarizeCashbook([{employeeId:'A',type:'Advance',amount:10.10},{employeeId:'A',type:'Advance',amount:0},{employeeId:'A',type:'Recovery',amount:-2},{employeeId:'A',type:'Other',amount:4}]),{advances:10.1,payments:0,recovered:0,outstanding:10.1,excessRecovery:0,invalidEntries:2},'invalid and unknown entries');
eq(summarizeCashbook([{employeeId:'A',type:'Advance',amount:0.1},{employeeId:'A',type:'Recovery',amount:0.03}]),{advances:0.1,payments:0,recovered:0.03,outstanding:0.07,excessRecovery:0,invalidEntries:0},'paise precision');
eq(materialBalance(100,35),{received:100,used:35,balance:65,overUsed:0},'material stock balance');
eq(materialBalance(10,12),{received:10,used:12,balance:-2,overUsed:2},'material over-use detection');
eq(materialBalance(0,0),{received:0,used:0,balance:0,overUsed:0},'empty material stock');
console.log('PASS: 9 balance test cases');

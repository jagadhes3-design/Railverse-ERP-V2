(function(root){
  'use strict';
  function toCents(value){
    const n=Number(value);
    return Number.isFinite(n)?Math.round(n*100):0;
  }
  function summarizeOne(selected){
    let advances=0,payments=0,recovered=0,invalidEntries=0;
    for(const row of selected){
      const amount=toCents(row.amount);
      if(amount<=0){invalidEntries++;continue;}
      if(row.type==='Advance')advances+=amount;
      else if(row.type==='Payment')payments+=amount;
      else if(row.type==='Recovery')recovered+=amount;
    }
    const rawBalance=advances-recovered;
    return {advances:advances/100,payments:payments/100,recovered:recovered/100,
      outstanding:Math.max(0,rawBalance)/100,excessRecovery:Math.max(0,-rawBalance)/100,invalidEntries};
  }
  function summarizeCashbook(rows, employeeId){
    const all=Array.isArray(rows)?rows:[];
    if(employeeId!==undefined)return summarizeOne(all.filter(r=>r.employeeId===employeeId));
    const groups=new Map();
    for(const row of all){const key=row.employeeId??'__missing_employee__';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row)}
    const totals={advances:0,payments:0,recovered:0,outstanding:0,excessRecovery:0,invalidEntries:0};
    for(const group of groups.values()){const value=summarizeOne(group);for(const key of Object.keys(totals))totals[key]+=value[key]}
    return totals;
  }
  function materialBalance(received,used){
    const r=toCents(received),u=toCents(used);
    return {received:r/100,used:u/100,balance:(r-u)/100,overUsed:Math.max(0,u-r)/100};
  }
  root.RVBalance={summarizeCashbook,materialBalance};
})(typeof window!=='undefined'?window:globalThis);


const fs = require('fs');

const testCases = JSON.parse(fs.readFileSync('./input.json', 'utf8'));
function tobase10(jsonData) {
  let shares = [];
  for (let key in jsonData) {
    if (key !== "keys") {
      let base = parseInt(jsonData[key]["base"], 10);
      let value = jsonData[key]["value"];
      let x = parseInt(key, 10);
      let y = parseInt(value, base);
      shares.push({ x, y });
    }
  }
  return shares;
}


function wrongshare(data) {
  const sharePoints = tobase10(data);
  const requiredShares = data.keys.k;
  const calculatedSecret = lagrangeInter(sharePoints.slice(0, requiredShares), requiredShares);
  for (let i = 0; i < sharePoints.length; i++) {
      const tempShares = sharePoints.slice();
      tempShares.splice(i, 1);
      const estimatedSecret = lagrangeInter(tempShares.slice(0, requiredShares), requiredShares);
      console.log("assumed secret:", estimatedSecret);
      if (calculatedSecret !== estimatedSecret) {
          console.log(`Share ${i + 1} is wrong.`);
      } else {
          console.log("No wrong shares");
      }

      console.log("The real secret is", calculatedSecret);
  }
}
// Implementing Lagrange interpolation
function lagrangeInter(shares, k) {
  let secret = 0;

  for (let i = 0; i < k; i++) {
    let { x: xi, y: yi } = shares[i];
    let li = 1;

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        let { x: xj } = shares[j];
        li = li * xj / (xj - xi);
      }
    }

    secret += yi * li;
  }

  return Math.round(secret);
}

// each test case
console.log("\n---------------------------------\n");
testCases.forEach((caseData, index) => {
  const shares = tobase10(caseData);

  if (index === 0) {
    const secret = lagrangeInter(shares, caseData.keys.k);
    console.log("The secret for the first case is:", secret);
  } else {
    console.log(`Checking for incorrect shares in test case ${index + 1}:`);
    wrongshare(caseData);
  }
  console.log("\n---------------------------\n");
});

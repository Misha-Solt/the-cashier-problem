// Problem #1
// console.log(0.1 + 0.2)

// 0. Make a 'Bibliothek' with cash types and cash units.
const cashType = [
  500, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01,
]

const cashInUnits = {
  500: 50000,
  100: 10000,
  50: 5000,
  20: 2000,
  10: 1000,
  5: 500,
  2: 200,
  1: 100,
  0.5: 50,
  0.2: 20,
  0.1: 10,
  0.05: 5,
  0.02: 2,
  0.01: 1,
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 1. Set the amount of money in the cashbox at the beginning of the session.
//
let cashBox = [
  { 500: 0 },
  { 100: 0 },
  { 50: 10 },
  { 20: 10 },
  { 10: 10 },
  { 5: 25 },
  { 2: 25 },
  { 1: 25 },
  { 0.5: 25 },
  { 0.2: 25 },
  { 0.1: 25 },
  { 0.05: 25 },
  { 0.02: 25 },
  { 0.01: 25 },
]

// Or using createCashCounter function

// let cashBox = [];
// const createCashCounter = () =>{
//   cashType.forEach(type => {
//     let amount = Math.floor(Math.random() * 25) + 1;;
//     cashBox.push({[type] : amount});
//   })
//   return cashBox
// }
// createCashCounter()

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 2. Function to withdraw money from the cashbox
const cashboxSubtract = (difference, cashBoxInUnits, changeToClient, type) => {
  if (difference >= cashInUnits[type] && cashBoxInUnits[type]) {
    if (difference >= cashBoxInUnits[type]) {
      const toSubtract = cashBoxInUnits[type]
      difference -= toSubtract
      changeToClient.push([type, toSubtract / 100])
      cashBoxInUnits[type] = 0
    } else {
      const toSubtract =
        Math.floor(difference / cashInUnits[type]) * cashInUnits[type]
      difference -= toSubtract
      changeToClient.push([type, toSubtract / 100])
      cashBoxInUnits[type] -= toSubtract
    }
  }
  return [difference, cashBoxInUnits, changeToClient]
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 3. Function to add money to the cashbox
const addCashInCashbox = (...objs) => {
  return objs.reduce((a, b) => {
    for (let i in b) {
      if (b.hasOwnProperty(i)) a[i] = (a[i] || 0) + b[i]
    }
    return a
  }, {})
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 4. Make a function for determine adequate change.
const cashCounter = (price, amount) => {
  // 4.1 Check the price and client cash at first.
  if (price === 0) {
    return console.log('We have Thneed if you want.')
  }
  if (amount === 0) {
    return console.log(
      'I need your clothes, your boots and your motorcycle. Sorry, just some cash.'
    )
  }

  // 4.2 Determine difference and convert it to the units.
  let difference = Math.round((amount - price) * 100)

  // 4.3 Convert cashbox to the object in units.
  let cashBoxInUnits = Object.assign({}, ...cashBox)
  Object.keys(cashBoxInUnits).forEach((i) => {
    cashBoxInUnits[i] = cashBoxInUnits[i] * 100 * i
  })

  // 4.4 Convert cash from client to notes and coints.
  let addCash = []
  cashType.forEach((type) => {
    if (type <= amount) {
      const amountOfType = Math.floor(amount / type)
      amount = (amount % type).toFixed(2)
      addCash.push({ [type]: amountOfType })
    }
  })

  // 4.5 Convert cash from client to the object in units.
  let addCashInUnits = Object.assign({}, ...addCash)
  Object.keys(addCashInUnits).forEach((i) => {
    addCashInUnits[i] = addCashInUnits[i] * 100 * i
  })

  // 4.6 Add cash from client to cashbox.
  cashBoxInUnits = addCashInCashbox(cashBoxInUnits, addCashInUnits)

  // 4.7 Determine the amount of change.
  let changeToClient = []
  cashType.forEach((type) => {
    ;[difference, cashBoxInUnits, changeToClient] = cashboxSubtract(
      difference,
      cashBoxInUnits,
      changeToClient,
      type
    )
  })

  // 4.8 Possibility to give change to the client.
  if (difference > 0) {
    return console.log('No change available')
  }
  // 4.9 Check the amount of money to purchase.
  if (difference < 0) {
    return console.log(
      `The customer need to pay ${0 - difference / 100}€ extra`
    )
  }

  // 4.10 Show change for client as a clarity object
  let changeToClientObj = {}
  changeToClient.forEach((i) => {
    if (i[0] === 0.01) {
      changeToClientObj[i[0] * 100 + ' Cent'] = i[1] / i[0]
    }
    if (Number.isInteger(i[0])) {
      changeToClientObj[i[0] + ' Euro'] = i[1] / i[0]
    }
    if (i[0] !== 0.01 && i[0] < 1) {
      changeToClientObj[i[0] * 100 + ' Cents'] = i[1] / i[0]
    }
  })

  // 4.11 Check the cashbox status (Total amount of money in the cashbox).
  let cashBoxStatus = Object.values(cashBoxInUnits).reduce(
    (acc, amt) => acc + amt,
    0
  )
  cashBoxStatus = cashBoxStatus / 100

  // 4.12 Show change for client as a clarity object
  Object.keys(cashBoxInUnits).forEach((i) => {
    cashBoxInUnits[i] = cashBoxInUnits[i] / i / 100
  })

  // 4. Show result in console.
  console.log('Return to the client:')
  console.table(changeToClientObj)
  console.log(`You have ${cashBoxStatus}€ in cashbox`)
  console.table(cashBoxInUnits)
}

// ++++++++++++++++++++++++++++++++++++++THE+++++++++++++++++++++++++++++++++++++++
// Paste string 'curl parrot.live' in Terminal.
// ++++++++++++++++++++++++++++++++++++++END+++++++++++++++++++++++++++++++++++++++


// Please insert price and the paid amount:

cashCounter(2.19, 100)

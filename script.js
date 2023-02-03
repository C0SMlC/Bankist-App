'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Pratik Sunil Pendurkar',
  movements: [200.4, 455.7, -306.5, 25000, -642.5, -133, 79.9, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnpayLoan = document.querySelector('.btnloan');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Amount Display

function amountDisplayer(mov) {
  const currency = new Intl.NumberFormat(curruser.locale, {
    style: 'currency',
    currency: curruser.currency,
  }).format(mov);
  return currency;
}

// Sorting

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(curruser, !sorted);
  sorted = !sorted;
});

// Date handling
function datesetter(movementsdate) {
  const currentdate = new Date();
  console.log('C Date : ', currentdate);
  console.log('M Date : ', movementsdate);

  const calcdays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayspassed = calcdays(currentdate, movementsdate);
  console.log('Date : ', dayspassed);
  if (dayspassed == 0) {
    return 'Today';
  }

  if (dayspassed == 1) {
    return 'Yesterday';
  }
  if (dayspassed > 7) {
    return `${dayspassed} Days  Ago`;
  }
}

// Showing Transactionss
//Movements adding

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const movdate = new Date(acc.movementsDates[i]);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${datesetter(movdate)}</div>
        <div class="movements__value">${amountDisplayer(mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Current balance

const updatebalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${amountDisplayer(acc.balance)}`;
};

function updateui(acc) {
  displayMovements(acc);
  updatebalance(acc);
  summary(acc);
}

let curruser;

// Log In
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  curruser = accounts.find(acc => acc.username === username);

  if (curruser && curruser.pin === Number(pin)) {
    // Display UI and message

    labelWelcome.textContent = `Welcome back, ${curruser.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Timer

    if (timer) clearInterval(timer);
    timer = setuptimer();

    // showing transactions
    updateui(curruser);
  } else {
    alert('User Not Found');
  }
});

// Transfering Amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    curruser.balance >= amount &&
    receiverAcc?.username !== curruser.username
  ) {
    // Doing the transfer
    alert('Done');
    curruser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    alert(curruser.movements);
    const transferdate = new Date();
    curruser.movementsDates.push(transferdate.toISOString());
    receiverAcc.movementsDates.push(transferdate.toISOString());
    // Update UI
    inputTransferAmount.blur();
    clearInterval(timer);
    timer = setuptimer();
    updateui(curruser);
  }
});

// delete accounts

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === curruser.username &&
    Number(inputClosePin.value) == curruser.pin
  ) {
    const accounttobedeleted = accounts.findIndex(
      acc => (acc.username = curruser.username)
    );
    alert('Your account will be deleted');
    accounts.splice(accounttobedeleted, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    clearInterval(timer);
    time = 24;
  } else {
    alert('Please check Creditials');
  }
});

// Creating Username

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);

// Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    curruser.movements.some(mov => mov >= amount * 0.1) &&
    !curruser?.TakenLoan
  ) {
    // Add movement
    curruser.loanamount = amount;
    curruser.movements.push(amount);
    curruser.TakenLoan = true;
    btnpayLoan.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    const loandate = new Date();
    curruser.movementsDates.push(loandate.toISOString());
    // Update UI
    clearInterval(timer);
    timer = setuptimer();
    updateui(curruser);
  } else {
    if (curruser?.TakenLoan && amount > 0) {
      const choice = prompt(
        'You are alreday in debt, do you wanna pay it first ?'
      );
      if (choice && curruser.balance >= curruser.loanamount) {
        curruser.movements.push(-curruser.loanamount);
        const loanpaydate = new Date();
        curruser.movementsDates.push(loanpaydate.toISOString());
        curruser.loanamount = 0;
        curruser.TakenLoan = false;
        updateui(curruser);
      } else if (curruser.balance < curruser.loanamount) {
        alert('Insufficient Balance');
      }
    }
  }
  inputLoanAmount.value = '';
});

//

btnpayLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (curruser.TakenLoan && curruser.balance >= curruser.loanamount) {
    curruser.movements.push(-curruser.loanamount);
    curruser.loanamount = 0;
    curruser.TakenLoan = false;
    const loanpaydate = new Date();
    curruser.movementsDates.push(loanpaydate.toISOString());
    updateui(curruser);
    btnpayLoan.style.backgroundColor = '#ffb003';
  } else if (curruser.TakenLoan) {
    alert('Insufficient Balance');
  }
});

//Summmary
function summary(curruser) {
  const totalin = curruser.movements
    .filter(acc => acc > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const totalout = Number(
    curruser.movements.filter(acc => acc < 0).reduce((acc, mov) => acc + mov, 0)
  ).toFixed(2);

  const interestRate = Number(totalin / 1000);

  labelSumIn.textContent = amountDisplayer(totalin);
  labelSumOut.textContent = amountDisplayer(Math.abs(totalout));
  labelSumInterest.textContent = amountDisplayer(interestRate);
}

const options = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long',
};

const locale = navigator.language;
const now = new Date();
const dates = new Intl.DateTimeFormat(locale, options).format(now);
labelDate.textContent = dates;

// setting timer
let timer;
const setuptimer = function () {
  const tick = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;
    if (time === 0) {
      alert('You are about to log out');
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      curruser = null;
    }
    time--;
  };
  let time = 300;
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

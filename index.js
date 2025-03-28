/////////////////////////////////////
// Exstensions

String.prototype.contains = function (containers) {
  for (let container of containers) {
    if (this.includes(container)) return true;
  }
  return false;
};

String.prototype.contain = function (containers) {
  for (let container of containers) {
    if (this.includes(container)) return { contain: true, key: container };
  }
  return { contain: false, key: null };
};

String.prototype.replaces = function (olds, _news) {
  for (let i = 0; i < olds.length; i++) this.replace(olds[i], _news[i]);
};
/////////////////////////////////////
// Classes

class Input {
  constructor(root) {
    this.root = root;
  }

  length() {
    return this.root.textContent.length;
  }

  get() {
    return this.root.textContent;
  }

  set(value) {
    if (["string", "number", "bigint"].includes(typeof value)) {
      this.root.textContent = value;
      return;
    }

    this.root.textContent = value.root.textContent;
  }

  _add(value) {
    this.add(value);
    return this.get();
  }

  add(value) {
    if (["string", "number", "bigint"].includes(typeof value)) {
      this.root.textContent += value;
      return;
    }

    this.root.textContent += value.root.textContent;
  }

  shift(value) {
    if (["string", "number", "bigint"].includes(typeof value)) {
      this.root.textContent = value + this.get();
      return;
    }

    this.root.textContent = value.root.textContent + this.get();
  }

  del(value) {
    if (this.length() == 1) {
      this.set(0);
      return;
    }

    this.root.textContent = this.get().slice(0, -value);
  }

  replace(old, _new) {
    this.root.textContent = this.root.textContent.replace(old, _new);
  }

  replaces(olds, _news) {
    for (let i = 0; i < olds.length; i++) this.replace(olds[i], _news[i]);
  }

  _replaces(olds, _news) {
    console.log("aaa");

    let text = this.get();
    for (let i = 0; i < olds.length; i++)
      text = text.replace(olds[i], _news[i]);
    // text.replaces(olds, _news);
    return text;
  }

  remove(old) {
    this.replace(old, "");
  }

  clear() {
    this.root.textContent = "";
  }

  contain(containers) {
    for (let container of containers) {
      if (this.root.textContent.includes(container))
        return { contain: true, key: container };
    }
    return { contain: false, key: null };
  }

  contains(containers) {
    for (let container of containers) {
      if (this.includes(container)) return true;
    }
    return false;
  }

  includes(include) {
    return this.root.textContent.includes(include);
  }
}

/////////////////////////////////////
// Initialisation (INITialisate classes)
const input = {
  isEnded: false,
  answer: new Input(document.getElementById("answer")),
  expression: new Input(document.getElementById("expression")),
  equalButton: document.getElementById("equal"),
};

input.answer.set(0);

let TimerId, clickX, clientyX;
input.answer.root.addEventListener("mousedown", (e) => {
  // TimerId = setTimeout(, 3000)
  clickX = e.clientX;
});

input.answer.root.addEventListener("mouseup", (e) => {
  if (e.clientX - clickX > 50) input.answer.del(1);
});

// document.getElementById().addEventListener("mouseup", (e) => {
//   e.clientX;
// });

let numbers = {
  9: "0 10px 0 0",
  8: "10px 0 0 0",
  3: "0 0 0 10px",
  1: "0 0 10px 0",
};

/////////////////////////////////////
// Functions

function clear() {
  input.expression.clear();
  input.answer.set(0);
  input.isEnded = false;
}

function typing(event) {
  input.equalButton.disabled = false;
  if (input.isEnded) clear();

  if (input.answer.get() == "0" && this.buttonTitle.includes("0")) return;

  if (this.buttonTitle != "00" || input.answer.length() != 0)
    if (input.answer.get() == "0") input.answer.set(this.buttonTitle);
    else input.answer.add(this.buttonTitle);
}

function sign(event) {
  if (input.answer.length() == 0) return;

  if (input.expression.includes("=")) {
    input.expression.set(input.answer._add(this.buttonTitle));
    input.answer.set(0);
    input.isEnded = false;
    return;
  }

  let { contain, key } = input.expression.contain(["+", "-", "×", "÷"]);

  if (contain) input.expression.replace(key, this.buttonTitle);
  else {
    input.expression.set(input.answer._add(this.buttonTitle));
    input.answer.set(0);
  }
}

function calc(event) {
  if (input.expression.length == 0) return;

  input.expression.add(input.answer);
  // input.expression.replaces("×÷", "*/");
  // console.log(input.expression._replaces("×÷", "*/"));
  input.expression.replace("--", "+")
  input.answer.set(eval(input.expression._replaces("×÷", "*/")));
  input.expression.add("=");
  input.isEnded = true;
}

function doting() {
  if (input.answer.includes(".")) input.answer.remove(".");

  input.answer.add(".");
}

function plusMinus() {

  if (input.answer.get() == "0") return;

  if (input.answer.includes("-")) {
    input.answer.remove("-");
    return;
  }

  input.answer.shift("-");
}

function divideCheck() {
  input.equalButton.disabled = true;
}

/////////////////////////////////////
// Main
document.querySelectorAll("button").forEach((button) => {
  if (Number.isInteger(parseInt(button.textContent))) {
    if (numbers[button.textContent])
      button.style.borderRadius = numbers[button.textContent];

    button.addEventListener("click", {
      handleEvent: typing,
      buttonTitle: button.textContent,
    });
    return;
  }

  if (button.textContent.contains(["+", "-", "×", "÷"])) {
    button.addEventListener("click", {
      handleEvent: sign,
      buttonTitle: button.textContent,
    });

    if (button.textContent == "÷")
      button.addEventListener("click", divideCheck);
  }

  switch (button.textContent.toLowerCase()) {
    case "c":
      button.addEventListener("click", () => {
        input.answer.set(0);
      });
      break;

    case "ac":
      button.addEventListener("click", clear);
      break;

    case ".":
      button.addEventListener("click", doting);
      break;

    case "±":
      button.addEventListener("click", plusMinus);
      break;

    case "=":
      button.addEventListener("click", calc);
      break;
  }
});

////// ? oldes

// function addIntoInput(input, value) {
//   if (typeof value === "string") {
//     input.textContent += value;
//     return;
//   }

//   input.textContent += value.textContent;
// }

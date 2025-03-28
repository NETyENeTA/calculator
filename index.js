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

class Cursor {
  constructor(x, y) {
    this.root = document.getElementById("cursor");
    this.assistant = document.getElementById("cursor-1");

    this.offset = { x: x, y: y };

    this.#init();
  }

  style(key, value) {
    this.root.style[key] = value;
  }

  #init() {
    this.save = {};
    this.save.borderRadius = this.root.style.borderRadius;
    this.save.colorAssistant = this.assistant.style.backgroundColor;

    /////

    let clickX, clientyX;
    input.answer.root.addEventListener("mousedown", (e) => {
      clickX = e.clientX;
    });

    input.answer.root.addEventListener("mouseup", (e) => {
      if (e.clientX - clickX > 50) {
        input.answer.del(1);
        if (input.answer.get() == "0")
          input.divideButtons.forEach((el) => {
            el.disabled = true;
          });
      }
      if (e.clientX - clickX < -50)
        navigator.clipboard.writeText(input.answer.get());
    });

    /////

    document.body.addEventListener("mousemove", (e) => {
      this.root.style.left = `${e.clientX - this.offset.x}px`;
      this.root.style.top = `${e.clientY - this.offset.y}px`;
    });

    document.body.addEventListener("mouseup", (e) => {
      this.assistant.style.backgroundColor = "transparent";
    });

    let calculator = document.getElementById("calc");

    calculator.addEventListener("mouseenter", (e) => {
      this.root.style.borderRadius = "0px";
    });

    calculator.addEventListener("mouseleave", (e) => {
      this.root.style.borderRadius = this.save.borderRadius;
    });

    input.answer.root.addEventListener("mousemove", (e) => {
      if (this.assistant.style.backgroundColor != "transparent")
        this.assistant.style.backgroundColor =
          e.clientX - clickX > 50
            ? "red"
            : e.clientX - clickX > -50
            ? "blue"
            : this.save.colorAssistant;
    });

    input.answer.root.addEventListener("mousedown", (e) => {
      this.assistant.style.left = `${e.clientX - this.offset.x + 2}px`;
      this.assistant.style.top = `${e.clientY - this.offset.y + 2}px`;
      this.assistant.style.backgroundColor = this.save.colorAssistant;
    });
  }
}

class Input {
  constructor(root) {
    this.root = root;

    root.onmousedown = () => {
      return false;
    };

    root.onclick = () => {
      return true;
    };
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
  pow: new Input(document.getElementById("pow")),
  divideButtons: [
    document.getElementById("divide"),
    document.getElementById("equal"),
  ],
};

input.answer.set(0);
input.pow.set(0);

let numbers = {
  9: "0 10px 0 0",
  8: "10px 0 0 0",
  3: "0 0 0 10px",
  1: "0 0 10px 0",
};

const cursor = new Cursor(5, 5);

/////////////////////////////////////
// Functions

function clear() {
  input.expression.clear();
  input.answer.set(0);
  input.isEnded = false;
}

function typing(event) {
  input.divideButtons.forEach((el) => {
    el.disabled = false;
  });
  if (input.isEnded) clear();

  if (input.answer.get() == "0" && this.buttonTitle.includes("0")) return;

  if (this.buttonTitle != "00" || input.answer.length() != 0)
    if (input.answer.get() == "0") input.answer.set(this.buttonTitle);
    else input.answer.add(this.buttonTitle);
}

function sign(event) {
  input.divideButtons.forEach((el) => {
    el.disabled = false;
  });

  if (input.answer.length() == 0) return;

  if (input.expression.includes("=")) {
    input.expression.set(input.answer._add(this.buttonTitle));
    input.answer.set(0);
    input.isEnded = false;
    return;
  }

  let { contain, key } = input.expression.contain(["+", "-", "×", "÷"]);

  if (key === this.buttonTitle) calc();

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
  input.expression.replace("--", "+");
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
  if (input.answer.get() == "0")
    input.divideButtons.forEach((el) => {
      el.disabled = true;
    });
}

function pow(expression, separator = "^") {
  return Math.pow(...expression.split(separator).map(Number));
}

function powing() {
  if (input.pow.get() == "0" || input.pow.includes("=")) {
    input.pow.set(input.answer.get());
    input.answer.set(0);
    return;
  }

  input.pow.add("^" + input.answer.get());
  input.pow.add("=" + pow(input.pow.get()));
  input.answer.set(0);
}

function ctg(value) {
  return 1 / Math.tan(value);
}
function actg(value) {
  return 1 / Math.atan(value);
}

function trigonometry(event) {
  input.isEnded = true;

  let namefunction = this.buttonTitle;
  let trigonomFunction;

  switch (this.buttonTitle) {
    case "tan":
    case "cos":
    case "sin":
    case "arcsin":
    case "arccos":
    case "arctan":
      trigonomFunction = Math[this.buttonTitle.replace("rc", "")];
      break;

    case "ctg":
      trigonomFunction = ctg;
      break;

    case "arcctg":
      trigonomFunction = actg;
      break;

    default:
      namefunction = null;
      break;
  }

  input.expression.set(`${namefunction}(${input.answer.get()})=`);
  input.answer.set(trigonomFunction(Number(input.answer.get())));
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

  if (button.textContent.contains("+-×÷")) {
    button.addEventListener("click", {
      handleEvent: sign,
      buttonTitle: button.textContent,
    });

    if (button.textContent == "÷")
      button.addEventListener("click", divideCheck);
  }

  if (button.textContent.contains("snt")) {
    button.addEventListener("click", {
      handleEvent: trigonometry,
      buttonTitle: button.textContent.toLowerCase(),
    });
    return;
  }

  switch (button.textContent.toLowerCase()) {
    case "c":
      button.addEventListener("click", () => {
        input.answer.set(0);
        if (input.expression.includes("÷"))
          input.divideButtons.forEach((el) => {
            el.disabled = true;
          });
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

    case "puff":
      button.addEventListener("click", powing);
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

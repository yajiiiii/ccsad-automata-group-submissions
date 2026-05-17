// Section 1: Page Transition
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("introPage").classList.add("hidden");
  document.getElementById("homePage").classList.remove("hidden");
});

// Section 2: Topic Button Wiring
const topicButtons = document.querySelectorAll(".topic-btn");
const rightPanel = document.getElementById("rightPanel");

topicButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from all
    topicButtons.forEach((b) => b.classList.remove("active"));
    // Set active on clicked
    btn.classList.add("active");
    // Render the corresponding topic
    renderTopic(btn.dataset.topic);
  });
});

// Section 3: renderTopic() — The Bridge Function
function renderTopic(topicId) {
  const config = topicConfig[topicId];
  if (!config) return;

  rightPanel.innerHTML = `
    <h2 class="topic-title">${config.title}</h2>
    <p class="topic-desc">${config.description}</p>
    <hr class="section-divider" />
    <span class="section-label">Input</span>
    ${config.inputHTML}
    <hr class="section-divider" />
    <span class="section-label">Result</span>
    <div class="result-box" id="resultBox">—</div>
    <span id="statusMsg"></span>
  `;

  // Bind compute button
  const computeBtn = document.getElementById("computeBtn");
  if (computeBtn) {
    computeBtn.addEventListener("click", () => runCompute(topicId));
  }

  // Bind Enter key on input fields
  rightPanel.querySelectorAll(".input-field").forEach((field) => {
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runCompute(topicId);
    });
  });
}

// Section 4: topicConfig — Topic Definitions
const topicConfig = {
  palindrome: {
    title: "Palindrome",
    description:
      "Checks if a string reads the same forwards and backwards. Spaces are ignored and the check is case-insensitive.",
    inputHTML: `
      <input id="inp1" class="input-field" type="text" placeholder="Enter a string..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Check</button>
    `,
  },
  division: {
    title: "Division Algorithm",
    description:
      "Computes the quotient and remainder when dividing two integers using the division algorithm.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="First integer..." />
      <input id="inp2" class="input-field" type="number" placeholder="Second integer..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Calculate</button>
    `,
  },
  euclidean: {
    title: "Euclidean Algorithm",
    description:
      "Finds the Greatest Common Divisor (GCD) and Least Common Multiple (LCM) using the Euclidean algorithm, shown step by step.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="First integer..." />
      <input id="inp2" class="input-field" type="number" placeholder="Second integer..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Calculate</button>
    `,
  },
  collatz: {
    title: "Collatz Sequence",
    description:
      "Generates the Collatz sequence from a starting positive integer. If even → divide by 2; if odd → multiply by 3 and add 1. Stops at 1.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Enter a positive integer..." />
      <span id="errMsg" class="error-msg"></span>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
  fibonacci: {
    title: "Fibonacci Numbers",
    description:
      "Generates the Fibonacci sequence. Each term is the sum of the two preceding terms. Starts at F(0)=0, F(1)=1.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Number of terms..." />
      <span id="errMsg" class="error-msg"></span>
      <p class="topic-hint"> Note: Number of terms must be greater than 2.</p>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
  tribonacci: {
    title: "Tribonacci Numbers",
    description:
      "Generates the Tribonacci sequence. Each term is the sum of the three preceding terms. Starts at T(0)=0, T(1)=0, T(2)=1.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Number of terms..." />
      <span id="errMsg" class="error-msg"></span>
      <p class="topic-hint">Note: Number of terms must be greater than 3.</p>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
  lucas: {
    title: "Lucas Numbers",
    description:
      "Generates the Lucas sequence. Like Fibonacci but starts at L(0)=2, L(1)=1. Named after French mathematician Édouard Lucas.",
    inputHTML: `
      <input id="inp1" class="input-field" type="number" placeholder="Number of terms..." />
      <span id="errMsg" class="error-msg"></span>
      <p class="topic-hint">Note: Number of terms must be greater than 2.</p>
      <button id="computeBtn" class="btn btn--compute">Generate</button>
    `,
  },
};

// Section 5: runCompute() — Dispatch to Compute Functions
function runCompute(topicId) {
  const inp1 = document.getElementById("inp1");
  const inp2 = document.getElementById("inp2");
  const errMsg = document.getElementById("errMsg");
  const result = document.getElementById("resultBox");
  const status = document.getElementById("statusMsg");

  errMsg.textContent = "";
  if (status) status.textContent = "";

  let res;
  switch (topicId) {
    case "palindrome":
      res = computePalindrome(inp1.value);
      break;
    case "division":
      res = computeDivision(inp1.value, inp2 ? inp2.value : "");
      break;
    case "euclidean":
      res = computeEuclidean(inp1.value, inp2 ? inp2.value : "");
      break;
    case "collatz":
      res = computeCollatz(inp1.value);
      break;
    case "fibonacci":
      res = computeFibonacci(inp1.value);
      break;
    case "tribonacci":
      res = computeTribonacci(inp1.value);
      break;
    case "lucas":
      res = computeLucas(inp1.value);
      break;
  }

  if (res.error) {
    errMsg.textContent = res.error;
    result.textContent = "—";
    return;
  }

  result.classList.remove("result-appear");
  void result.offsetWidth; // force reflow for animation restart
  result.classList.add("result-appear");
  result.textContent = formatResult(topicId, res);

  if (status && res.sequence) {
    status.className = "success-msg";
    status.textContent = `Done! Generated ${res.sequence.length} terms.`;
  }
}

// Section 6: formatResult() — Output Formatting
function formatResult(topicId, res) {
  switch (topicId) {
    case "palindrome":
      return (
        `Normalized String : ${res.normalized}\n` +
        `Length            : ${res.length}\n\n` +
        (res.isPalindrome
          ? "✅ The string is a palindrome."
          : "❌ The string is NOT a palindrome.")
      );

    case "division":
      return (
        `SOLUTION:\n` +
        `---------------------------------\n` +
        `${res.m} = ${res.n}(${res.q}) + ${res.r}\n\n` +
        `Dividend  : ${res.m}\n` +
        `Divisor   : ${res.n}\n` +
        `Quotient  : ${res.q}\n` +
        `Remainder : ${res.r}\n` +
        `---------------------------------`
      );

    case "euclidean":
      return (
        `SOLUTION:\n` +
        `---------------------------------\n` +
        res.steps.join("\n") +
        "\n" +
        `---------------------------------\n` +
        `The integers are ${res.originalM} and ${res.originalN}\n` +
        `GCD of ${res.originalM} and ${res.originalN} = ${res.gcd}\n` +
        `LCM of ${res.originalM} and ${res.originalN} = ${res.lcm}`
      );

    case "collatz":
      return `The Collatz sequence are:\n${res.sequence.join(", ")}`;

    case "fibonacci":
      return `The Fibonacci Numbers are:\n${res.sequence.join(", ")}`;

    case "tribonacci":
      return `The Tribonacci Numbers are:\n${res.sequence.join(", ")}`;

    case "lucas":
      return `The Lucas Numbers are:\n${res.sequence.join(", ")}`;

    default:
      return JSON.stringify(res);
  }
}

// Section 7: All Compute Functions
function computePalindrome(input) {
  if (input.trim() === "") {
    return { error: "You entered an empty string. Please try again." };
  }

  const normalized = input.replace(/\s/g, "").toLowerCase();
  const length = normalized.length;

  let isPalindrome = true;
  for (let i = 0; i < Math.floor(length / 2); i++) {
    if (normalized[i] !== normalized[length - 1 - i]) {
      isPalindrome = false;
      break;
    }
  }

  return { isPalindrome, normalized, length };
}

function computeDivision(input1, input2) {
  if (input1.trim() === "" || input2.trim() === "") {
    return { error: "Please enter both integers." };
  }

  const a = parseInt(input1);
  const b = parseInt(input2);

  if (isNaN(a) || isNaN(b)) {
    return { error: "Error: Please enter valid integers only." };
  }

  if (a < 0 || b < 0) {
    return { error: "INVALID INPUT: Negative numbers are not allowed." };
  }

  if (a === 0 || b === 0) {
    return { error: "Error: Integers cannot be zero." };
  }

  const m = Math.max(Math.abs(a), Math.abs(b));
  const n = Math.min(Math.abs(a), Math.abs(b));

  const q = Math.floor(m / n);
  const r = m % n;

  return { m, n, q, r };
}

function computeEuclidean(input1, input2) {
  if (input1.trim() === "" || input2.trim() === "") {
    return { error: "Please enter both integers." };
  }

  const a = parseInt(input1);
  const b = parseInt(input2);

  if (isNaN(a) || isNaN(b)) {
    return { error: "Error: Please enter valid integers only." };
  }

  if (a === 0 || b === 0) {
    return { error: "Error: Integers cannot be zero." };
  }

  let m = Math.max(Math.abs(a), Math.abs(b));
  let n = Math.min(Math.abs(a), Math.abs(b));

  const originalM = m;
  const originalN = n;
  const steps = [];
  let gcd = n;
  let dividend = m;
  let divisor = n;

  while (true) {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    if (remainder === 0) {
      steps.push(`${dividend} = ${divisor}(${quotient})`);
      gcd = divisor;
      break;
    } else {
      steps.push(`${dividend} = ${divisor}(${quotient}) + ${remainder}`);
    }

    dividend = divisor;
    divisor = remainder;
  }

  const lcm = (originalM * originalN) / gcd;
  return { steps, originalM, originalN, gcd, lcm };
}

function computeCollatz(input) {
  if (input.trim() === "") {
    return { error: "INVALID INPUT: Empty value is not allowed." };
  }

  const n = parseInt(input);

  if (isNaN(n) || !Number.isInteger(n)) {
    return { error: "INVALID INPUT: Please enter a valid integer." };
  }

  if (n <= 0) {
    return { error: "INVALID INPUT: Only positive numbers are allowed." };
  }

  const sequence = [];
  let current = n;

  while (current !== 1) {
    sequence.push(current);
    if (current % 2 !== 0) {
      current = 3 * current + 1;
    } else {
      current = Math.floor(current / 2);
    }
  }
  sequence.push(1);

  return { sequence };
}

function computeFibonacci(input) {
  if (input.trim() === "") {
    return { error: "Please enter a number." };
  }

  const n = parseInt(input);

  if (isNaN(n) || !Number.isInteger(n)) {
    return { error: "Invalid input. Please enter a whole number." };
  }

  if (n <= 2) {
    return { error: "Note: Number of terms must be greater than 2." };
  }

  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }

  return { sequence: seq, type: "Fibonacci Numbers" };
}

function computeTribonacci(input) {
  if (input.trim() === "") {
    return { error: "Please enter a number." };
  }

  const n = parseInt(input);

  if (isNaN(n) || !Number.isInteger(n)) {
    return { error: "Invalid input. Please enter a whole number." };
  }

  if (n <= 3) {
    return { error: "Note: Number of terms must be greater than 3." };
  }

  const seq = [0, 0, 1];
  for (let i = 3; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2] + seq[i - 3]);
  }

  return { sequence: seq, type: "Tribonacci Numbers" };
}

function computeLucas(input) {
  if (input.trim() === "") {
    return { error: "Please enter a number." };
  }

  const n = parseInt(input);

  if (isNaN(n) || !Number.isInteger(n)) {
    return { error: "Invalid input. Please enter a whole number." };
  }

  if (n <= 2) {
    return { error: "Note: Number of terms must be greater than 2." };
  }

  const seq = [2, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }

  return { sequence: seq, type: "Lucas Numbers" };
}

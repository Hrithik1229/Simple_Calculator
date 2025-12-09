const display = document.getElementById("display");
const historyDiv = document.getElementById("history");
const themeToggleBtn = document.getElementById("themeToggle");

let lastResult = null;
let hasError = false;
let history = []; // store last few calculations

// helpers
function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

function updateHistory() {
    // show last 3 entries
    const recent = history.slice(-3);
    historyDiv.textContent = recent.join("   |   ");
}

function appendValue(value) {
    // if last state was "Error", reset on next input
    if (hasError) {
        display.value = "";
        hasError = false;
    }

    const current = display.value;
    const lastChar = current.slice(-1);

    // prevent starting with *, /, % 
    if (current === "" && isOperator(value) && value !== '+' && value !== '-') {
        return;
    }

    // prevent multiple operators in a row: replace last operator
    if (isOperator(value) && isOperator(lastChar)) {
        display.value = current.slice(0, -1) + value;
        return;
    }

    // prevent multiple dots in the same "number chunk"
    if (value === '.') {
        // find last operator position
        let i = current.length - 1;
        while (i >= 0 && !isOperator(current[i])) {
            i--;
        }
        const lastNumber = current.slice(i + 1);
        if (lastNumber.includes('.')) {
            return;
        }
    }

    display.value += value;
}

function clearDisplay() {
    display.value = "";
    hasError = false;
}

function deleteLast() {
    if (hasError) {
        display.value = "";
        hasError = false;
        return;
    }
    display.value = display.value.slice(0, -1);
}

function calculate() {
    if (!display.value) return;

    try {
        const expr = display.value;
        const result = eval(expr); // okay for simple project

        display.value = result;
        lastResult = result;

        // push into history and update view
        history.push(`${expr} = ${result}`);
        updateHistory();

        hasError = false;
    } catch (e) {
        display.value = "Error";
        hasError = true;
    }
}

/* THEME TOGGLE */
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    themeToggleBtn.textContent = isLight ? "🌞" : "🌙";
});

/* KEYBOARD SUPPORT */
document.addEventListener("keydown", (event) => {
    const key = event.key;

    // digits
    if (key >= '0' && key <= '9') {
        appendValue(key);
        return;
    }

    // operators
    if (['+', '-', '*', '/', '%'].includes(key)) {
        appendValue(key);
        return;
    }

    // decimal
    if (key === '.') {
        appendValue('.');
        return;
    }

    // Enter or = : calculate
    if (key === 'Enter' || key === '=') {
        event.preventDefault(); // stop form submission behaviour
        calculate();
        return;
    }

    // Backspace: delete last
    if (key === 'Backspace') {
        deleteLast();
        return;
    }

    // Escape: clear
    if (key === 'Escape') {
        clearDisplay();
        return;
    }
});

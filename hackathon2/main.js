'use strict';

var calculator = document.querySelector('.calculator');
var screen = calculator.querySelector('.screen');
var keys = calculator.querySelector('.keypad');
function calculate(firstValue, operator, nextValue) {
    firstValue = parseFloat(firstValue);
    nextValue = parseFloat(nextValue);

    if (operator === "add")
        return firstValue + nextValue;
    else if (operator === "sub")
        return firstValue - nextValue;
    else if (operator === "mul")
        return firstValue * nextValue;
    else if (operator === "div")
        return firstValue / nextValue;
}
keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const btn = e.target;
        const key = btn.textContent;
        const action = btn.dataset.action;
        let operatorOff = function() {
            for (let k of document.getElementsByTagName('button')) {
                if (k.classList.contains("pressed")) {
                    k.classList.remove("pressed");
                }
            }
        };

        let toggleClearButton = function(content) {
            const clearBtn = document.getElementById("clear");
            clearBtn.textContent = content;
        };

        let firstValue, nextValue;
        if (action === "clear") {
            screen.textContent = "0";

            if (key === "AC") {
                calculator.dataset.firstValue = "";
                calculator.dataset.nextValue = "";
                calculator.dataset.operator = "";
                calculator.dataset.lastAction = "";

                operatorOff();
            }
 
            else if (key === "CE") {
                screen.textContent = "0";
                toggleClearButton("AC");

                calculator.dataset.lastAction = "clear-screen";
            }
        }
        else {
       
            if (action === "add" || action === "sub" ||
                action === "mul" || action === "div") {
                operatorOff();
                btn.classList.add("pressed");

                const lastAction = calculator.dataset.lastAction;
                if (lastAction === "equal") {
                    calculator.dataset.firstValue = screen.textContent;
                    calculator.dataset.nextValue = "";
                }
                else if (lastAction !== "operator") {
                    const operator = calculator.dataset.operator;
                    if (operator) {
                        firstValue = calculator.dataset.firstValue;
                        nextValue = screen.textContent;

                        screen.textContent = calculate(firstValue, operator, nextValue);
                    } else {
                        calculator.dataset.nextValue = "";
                    }

                    calculator.dataset.firstValue = screen.textContent;
                }

                calculator.dataset.operator = action;
                calculator.dataset.lastAction = "operator";
            }
            else if (!action) {
                const lastAction = calculator.dataset.lastAction;

                if (screen.textContent === "0" || lastAction === "operator" ||
                    lastAction === "equal") {
                    screen.textContent = key;
                } else {
                    screen.textContent += key;
                }

                calculator.dataset.lastAction = "number";
            }
            else if (action === "decimal") {
                const lastAction = calculator.dataset.lastAction;

                if (lastAction === "operator" || lastAction === "equal") {
                    screen.textContent = "0.";
                }
                else {
                    if (!screen.textContent.includes(".")){
                        screen.textContent += key;
                    }
                }

                calculator.dataset.lastAction = "decimal";
            }
            else if (action === "equal") {
                const operator = calculator.dataset.operator;
                const lastAction = calculator.dataset.lastAction;

                if (lastAction === "equal") {
                    if (operator) {
                        firstValue = calculator.dataset.firstValue;
                        nextValue = calculator.dataset.nextValue;

                        screen.textContent = calculate(firstValue, operator, nextValue);
                    } else {
                        calculator.dataset.nextValue = "";
                    }
                }
                else if (lastAction === "operator") {
                    firstValue = calculator.dataset.firstValue;

                    calculator.dataset.nextValue = screen.textContent;
                    nextValue = screen.textContent;

                    screen.textContent = calculate(firstValue, operator, nextValue);
                }
                else if (lastAction === "decimal" || lastAction === "number" ||
                         lastAction === "clear-screen") {
                    if (operator) {
                        nextValue = calculator.dataset.nextValue;
                        if (!nextValue) {
                            firstValue = calculator.dataset.firstValue;
                            calculator.dataset.nextValue = screen.textContent;
                            nextValue = screen.textContent;
                        } else {
                            firstValue = screen.textContent;
                        }

                        screen.textContent = calculate(firstValue, operator, nextValue);
                    } else {
                        screen.textContent = parseFloat(screen.textContent);
                        calculator.dataset.nextValue = "";
                    }
                }

                calculator.dataset.firstValue = screen.textContent;
                calculator.dataset.lastAction = "equal";
            }

            toggleClearButton("CE");
        }
    }
});

screen.addEventListener('click', e => {
    if (e.target.matches('.screen')) {
        if (screen.textContent) {
            const temp = document.createElement('textarea');
            temp.value = screen.textContent;
            screen.appendChild(temp);
            temp.select();
            document.execCommand("Copy");
            screen.removeChild(temp);
        }
    }
});

document.getElementsByClassName('screen').onload = function() {
    calculator.dataset.firstValue = "";
    calculator.dataset.nextValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.lastAction = "";
}
document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form.php-email-form");
    if (form) form.classList.remove("php-email-form");

    form.removeAttribute("action");
    form.setAttribute("method", "get");
    form.addEventListener("submit", e => e.preventDefault());

    const resultBox = document.createElement("div");
    resultBox.id = "resultBox";
    resultBox.style.marginTop = "20px";
    resultBox.style.padding = "15px";
    resultBox.style.background = "#eee";
    form.after(resultBox);

    const messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    messageBox.style.marginBottom = "10px";
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "5px";
    messageBox.style.color = "#155724";
    messageBox.style.backgroundColor = "#d4edda";
    messageBox.style.border = "1px solid #c3e6cb";
    messageBox.style.fontWeight = "bold";
    messageBox.style.display = "none";
    form.before(messageBox);


    function createField(labelText, id, type = "text") {
        const label = document.createElement("label");
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.required = true;
        input.style.display = "block";
        input.style.marginBottom = "10px";

        form.appendChild(label);
        form.appendChild(input);
    }



    createField("Vardas:", "fname");
    createField("Pavardė:", "lname");
    createField("El. paštas:", "email", "email");
    createField("Telefono numeris:", "phone", "tel");
    createField("Adresas:", "address");


    function createSlider(labelText, id) {
        const label = document.createElement("label");
        label.textContent = labelText;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 1;
        slider.max = 10;
        slider.value = 5;
        slider.id = id;
        slider.style.display = "block";
        slider.style.marginBottom = "20px";

        form.appendChild(label);
        form.appendChild(slider);
    }

    createSlider("Kaip vertinate si cv (1–10):", "q1");
    createSlider("Kokia jusu siandien nuotaika (1–10):", "q2");
    createSlider("Ar rekomenduotumete mane kitiems (1–10):", "q3");


    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    submitBtn.style.marginTop = "10px";
    submitBtn.disabled = true;
    form.appendChild(submitBtn);

    function showError(field, message) {
        let errorEl = field.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains("error-message")) {
            errorEl = document.createElement("div");
            errorEl.classList.add("error-message");
            errorEl.style.color = "red";
            errorEl.style.fontSize = "0.9em";
            field.after(errorEl);
        }
        if (message) {
            errorEl.textContent = message;
            field.style.border = "1px solid red";
            errorEl.style.display = "block";
        } else {
            errorEl.textContent = "";
            field.style.border = "";
            errorEl.style.display = "none";
        }
    }

    function validateField(field) {
        const value = field.value.trim();
        let valid = true;
        let error = "";

        if (!value) {
            valid = false;
            error = "Laukas privalomas";
        } else {
            switch(field.id) {
                case "fname":
                case "lname":
                    if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(value)) {
                        valid = false;
                        error = "Tik raidės";
                    }
                    break;
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        valid = false;
                        error = "Neteisingas el. pašto formatas";
                    }
                    break;
                case "phone":
                    // Telefono formatas +370 xxx xxxx
                    if (!/^\+370 \d{3} \d{4}$/.test(value)) {
                        valid = false;
                        error = "Telefonas turi būti formatu +370 xxx xxxx";
                    }
                    break;
                case "q1":
                case "q2":
                case "q3":
                    let num = parseInt(value);
                    if (isNaN(num) || num < 1 || num > 10) {
                        valid = false;
                        error = "Įvertinimas turi būti 1-10";
                    }
                    break;
            }
        }

        showError(field, error);
        return valid;
    }


    function formatPhone(value) {
        value = value.replace(/[^\d+]/g, "");

        if (value.startsWith("+370")) {
            let rest = value.slice(4).replace(/\D/g, "");
            if (rest.length > 0) {
                rest = rest.slice(0, 7);
                value = "+370 " + rest.replace(/(\d{3})(\d{0,4})/, "$1 $2").trim();
            } else {
                value = "+370 ";
            }
        } else {
            value = value.slice(0, 13);
        }
        return value;
    }


    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", (e) => {
        const cursorPos = phoneInput.selectionStart;
        const oldLength = phoneInput.value.length;

        phoneInput.value = formatPhone(phoneInput.value);

        const newLength = phoneInput.value.length;
        const diff = newLength - oldLength;

        phoneInput.selectionStart = phoneInput.selectionEnd = cursorPos + diff;

        validateField(phoneInput);
        checkAllFields();
    });


    ["fname", "lname", "email", "address", "q1", "q2", "q3"].forEach(id => {
        const f = document.getElementById(id);
        f.addEventListener("input", () => {
            validateField(f);
            checkAllFields();
        });
    });


    function checkAllFields() {
        const fields = ["fname", "lname", "email", "phone", "address", "q1", "q2", "q3"];
        let allValid = true;
        for (const id of fields) {
            const f = document.getElementById(id);
            if (!validateField(f)) {
                allValid = false;
                break;
            }
        }
        submitBtn.disabled = !allValid;
        return allValid;
    }


    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!checkAllFields()) {
            messageBox.textContent = "Prašome užpildyti formą teisingai.";
            messageBox.style.color = "#721c24"; 
            messageBox.style.backgroundColor = "#f8d7da";
            messageBox.style.border = "1px solid #f5c6cb";
            messageBox.style.display = "block";
            return;
        }

        const data = {
            fname: document.getElementById("fname").value.trim(),
            lname: document.getElementById("lname").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            q1: parseInt(document.getElementById("q1").value),
            q2: parseInt(document.getElementById("q2").value),
            q3: parseInt(document.getElementById("q3").value)
        };


        const avg = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);


        messageBox.textContent = "Duomenys pateikti sėkmingai!";
        messageBox.style.color = "#155724";
        messageBox.style.backgroundColor = "#d4edda";
        messageBox.style.border = "1px solid #c3e6cb";
        messageBox.style.display = "block";


        console.log("Formos duomenys:", data);
        console.log("Vidurkis:", avg);


        resultBox.innerHTML = `
            <p><b>Vardas:</b> ${data.fname}</p>
            <p><b>Pavardė:</b> ${data.lname}</p>
            <p><b>El. paštas:</b> ${data.email}</p>
            <p><b>Telefono numeris:</b> ${data.phone}</p>
            <p><b>Adresas:</b> ${data.address}</p>
            <p><b>Įvertinimų vidurkis:</b> ${avg}</p>
        `;
    });

});

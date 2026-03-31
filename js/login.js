const btn = document.querySelector(".btn");
const inputs = document.querySelectorAll(".input");
const checkbox = document.querySelector("input[type='checkbox']");

let message = document.getElementById("message");
if (!message) {
    message = document.createElement("p");
    message.id = "message";
    message.style.textAlign = "center";
    message.style.marginTop = "15px";
    document.querySelector(".container").appendChild(message);
}

window.onload = function () {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
        inputs[0].value = savedEmail;
        checkbox.checked = true;
    }
};

btn.addEventListener("click", function () {
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    message.innerText = "";
    message.style.color = "red";

    if (email === "" || password === "") {
        message.innerText = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        message.innerText = "Sai email hoặc mật khẩu!";
        return;
    }

    if (checkbox.checked) {
        localStorage.setItem("rememberEmail", email);
    } else {
        localStorage.removeItem("rememberEmail");
    }

    message.style.color = "green";
    message.innerText = "Đăng nhập thành công!";
});
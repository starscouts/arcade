global.notification = (data) => {
    document.getElementById("notification-title").innerText = data.title;
    document.getElementById("notification-message").innerText = data.message;
    document.getElementById("notification").style.right = "20px";
    document.getElementById("notification").style.opacity = "1";
    new Audio("./sfx/notification.mp3").play();

    setTimeout(() => {
        document.getElementById("notification").style.right = "-300px";
        document.getElementById("notification").style.opacity = "0";
    }, 5000)
};
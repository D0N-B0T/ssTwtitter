function getTweetElement(element) {
  while (element && !element.classList.contains("tweet")) {
    element = element.parentElement;
  }
  return element;
}

function captureScreenshot(tweetElement) {
  // Guarda el tema original
  const originalTheme = tweetElement.getAttribute("data-theme");
  tweetElement.setAttribute("data-theme", "dark");

  setTimeout(() => {
    htmlToImage
      .toPng(tweetElement, {
        backgroundColor: "rgb(21, 32, 43)",
        style: {
          color: "white",
        },
      })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            const item = new ClipboardItem({ "image/png": blob });
            return navigator.clipboard.write([item]);
          });
        };
      })
      .then(() => {
        displayNotification("Captura de pantalla copiada al portapapeles");
      })
      .finally(() => {
        // Restaura el tema original
        tweetElement.setAttribute("data-theme", originalTheme);
      });
  }, 100);
}


function displayNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.top = "16px";
  notification.style.right = "16px";
  notification.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  notification.style.color = "white";
  notification.style.padding = "8px 16px";
  notification.style.borderRadius = "4px";
  notification.style.zIndex = "10000";
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}


function addButtonToTweet(tweet) {
  if (tweet.getAttribute("data-screenshot-extension") === "processed") {
    return;
  }

  const moreButton = tweet.querySelector(".icon.icon-more.txt-right");
  if (!moreButton) return;

  const screenshotButton = document.createElement("button");
  screenshotButton.classList.add("screenshot-button");
  screenshotButton.title = "Capturar Tweet";
  screenshotButton.innerHTML = "🔽";

  moreButton.parentNode.insertBefore(screenshotButton, moreButton.nextSibling);

  screenshotButton.addEventListener("click", event => {
    event.stopPropagation();
    const tweetElement = getTweetElement(event.target);
    if (tweetElement) {
      captureScreenshot(tweetElement);
    }
  });

  tweet.setAttribute("data-screenshot-extension", "processed");
}



function addButtonToTweets() {
  const tweets = document.querySelectorAll(".tweet");
  tweets.forEach(addButtonToTweet);
}


addButtonToTweets();
setInterval(addButtonToTweets, 1000);
``

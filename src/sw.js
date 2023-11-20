let lastNotificationData = {};
self.addEventListener("push", function (event) {
  if (event.data) {
    try {
      const { title, description } = JSON.parse(event.data.text());
      self.registration.showNotification(title, {
        body: description,
      });
    } catch (error) {
      console.log(event.data.text());
    }
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const [action, id] = event.action.split(":");
  const { token, clientId } = lastNotificationData[id];
  delete lastNotificationData[id];

  const bearer = `Bearer ${token}`;

  if (action === "complete") {
    try {
      const promise = fetch(`http://localhost:4000/todos/${id}/toggle`, {
        method: "GET",
        headers: {
          Authorization: bearer,
          "X-Unique-Id": clientId,
        },
      });
      event.waitUntil(promise);
    } catch (e) {
      console.log("SW: error completing", e);
    }
  }
});

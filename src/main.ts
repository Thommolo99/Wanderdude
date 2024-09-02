import './app.css'
import App from './App.svelte'


Notification.requestPermission(permission => {  
  if (permission === 'granted') {

  }
  else{console.error("Permission was not granted.")} 
})

if ("serviceWorker" in navigator) {   
  navigator.serviceWorker
    .register("/service-worker.js") 
    .then(serviceWorker => {
      console.log("Service Worker registered: ", serviceWorker);
    })
    .catch(error => {
      console.error("Error registering the Service Worker: ", error);
    });

  navigator.serviceWorker.onmessage = event => {  
    const message = JSON.parse(event.data);     
    if (message && message.type.includes('/api/v1/posts')) {  
      console.log("Updated posts from web worker", message.data)
    }

    if (message && message.type === 'notification test') {
      sendNotification(message.data);
    }
  }
}

export function sendNotification(message: string) {  
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
      const notification = new Notification(message)
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            const notification = new Notification(message);
        }
    });
  }
}

const app = new App({
  target: document.getElementById('app'),
})

export default app

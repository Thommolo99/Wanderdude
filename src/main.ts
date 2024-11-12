import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import Toolbar from './Toolbar.svelte'


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
    if (message && (message.type.includes('/api/v0/posts') || message.type.includes('/api/v0/profiles'))) {  
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


const app = mount(App, {
  target: document.getElementById('app')!,
})

const fixedSection = mount(Toolbar, {
  target: document.getElementById('toolbar')!,
  props: { showAddPostForm: false } 
});

export default app

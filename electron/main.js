/*
  Informative comments provided by https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
  Uses process.stdout.write instead of console.log so we can cleanly catch the output in the parent process.
*/

const { app, BrowserView, ipcMain } = require('electron');
const configureStore = require('./helpers/store/configureStore');
const createClientWindow = require('./createClientWindow');
const createDappView = require('./createDappView');

let bounds = {
  x: 300,
  y: 0,
  width: 300,
  height: 300
};

const globalUUIDList = [];

app.on('ready', () => {
  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    clientWindow = createClientWindow(globalUUIDList);
  });
  clientWindow = createClientWindow(globalUUIDList);  
  console.log(clientWindow);

  // create multiple view and keep them around the memory, detached from the window
  // then switching workspaces is just and additional call to setBrowserView
  
  const dappsIndexes = ['index.html', 'index2.html'];
  for (dappInd of dappsIndexes) {
    createDappView(globalUUIDList, dappInd);
  }
  
  /* BrowserView
   *
   * 
   * 
    
    
    let view = BrowserView.fromId(1);
    clientWindow.setBrowserView(view);
    view.setBounds(bounds); 
  */

  const store = configureStore(global.state, globalUUIDList);
  process.stdout.write(JSON.stringify(store.getState()));
  
  store.subscribe( () => {
    process.stdout.write(JSON.stringify(store.getState()));

    let activeDappName = store.getState().client.activeDapp;
 
    let nameObj = globalUUIDList.find(renObj => renObj.name === activeDappName);
    if (nameObj) {
      /* BrowserView
      // let view = BrowserView.fromId(nameObj.viewId);
      // clientWindow.setBrowserView(view);
      // view.setBounds(bounds); 
      */
    }
    
    // let bindedChannel = store.getState().main.channel;
    // if (bindedChannel) { // when got action that channels is just binded
    //   let channelIdSendObj = globalUUIDList.find(renObj => renObj.channel === bindedChannel.sender);
    //   let channelIdReceiveObj = globalUUIDList.find(renObj => renObj.channel === bindedChannel.receiver);
    //   ipcMain.on(channelIdSendObj.channel, (event, uuid, payload) => {
    //     let bindedView = BrowserView.fromId(channelIdSendObj.viewId);
    //     bindedView.webContents.send(channelIdReceiveObj.channel, uuid, payload);
    //   });
    //   // channels now opened store.dispatch BIND_OPEN_CHANNELS_DONE
    // }
  });
  process.stdout.write(JSON.stringify(globalUUIDList));
});

process.stdout.write("Main initialized");

// In main process.
 
ipcMain.once('answer', (event, argv) => {
  console.log(argv);
});

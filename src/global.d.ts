interface Window {
  hotelUrl: string;
  hotelTld: string;
  ipcRenderer: IpcRenderer;
  shell: {
    openExternal: (url: string) => void;
  };
}

declare module 'ansi2html';
declare module 'is-electron';

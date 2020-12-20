export const ipcRenderer = {
  events: {},
  on(event: string | number, handler: any) {
    this.events[event] = handler;
  },
  send(event: string | number, data: any) {
    this.events?.[event]?.(event, data);
  },
  removeAllListeners(event: string | number) {
    this.events[event] = undefined;
  }
};

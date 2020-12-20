export default {
  events: {},
  bindGlobal(key: string, handler: any) {
    this.events[key] = handler;
  },
  unbind(key: string) {
    this.events[key] = undefined;
  },
  trigger(key: string) {
    this.events?.[key]?.();
  }
};


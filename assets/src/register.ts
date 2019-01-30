export const register: () => void = (): void => {
    if ('serviceWorker' in navigator) {
        // 为了保证首屏渲染性能，可以在页面 load 完之后注册 Service Worker
        window.onload = (): void => {
            navigator.serviceWorker.register(process.env.NODE_ENV !== 'development' ? '/assets/dist/sw.js' : '/sw.js');
        };
    }
};

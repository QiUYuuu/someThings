// pinia数据持久化（刷新数据不变）
import type { PiniaPluginContext } from "pinia";
import { toRaw } from "vue";

type Options = {
    key?: string,
}

const __piniaKey__ = 'CX';

const setStore = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getStorage = (key: string) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {};
}
export const piniaPlugin = (options: Options) => {
    return (context: PiniaPluginContext) => {
        const { store } = context;
        const data = getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`);
        store.$subscribe(() => {
            console.log('change');
            setStore(`${options?.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state));
        });
        return{
            ...data
        }
    }
}
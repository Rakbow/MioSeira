import 'vue'
import type { API } from '@/api'
import {META} from "@/config/Web_Const";

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $api: typeof API         // 全局 API 常量
        $const: typeof META
        // $filters: Record<string, (value: any) => any> // 全局过滤器（如 $filters.date()）
        // $bus: MittEmitter        // 事件总线
    }
}
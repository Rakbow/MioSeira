// directives/no-img-action.ts
export default {
    mounted(el: HTMLElement) {
        applyProtection(el);
        
        // 创建 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as HTMLElement;
                        // 如果新添加的元素是 img
                        if (element.tagName === 'IMG') {
                            protectImage(element);
                        }
                        // 查找新元素中的所有 img
                        const images = element.querySelectorAll?.('img');
                        if (images) {
                            images.forEach(img => protectImage(img as HTMLElement));
                        }
                    }
                });
            });
        });
        
        // 开始观察子节点变化
        observer.observe(el, {
            childList: true,
            subtree: true
        });
        
        // 将 observer 存储到元素上，以便清理
        (el as any)._imgProtectionObserver = observer;
    },
    unmounted(el: HTMLElement) {
        // 清理 observer
        const observer = (el as any)._imgProtectionObserver;
        if (observer) {
            observer.disconnect();
        }
    }
};

// 递归应用保护到所有 img 元素
function applyProtection(el: HTMLElement) {
    // 如果当前元素是 img
    if (el.tagName === "IMG") {
        protectImage(el);
    }
    
    // 查找所有子元素中的 img
    const images = el.querySelectorAll('img');
    images.forEach(img => {
        protectImage(img as HTMLElement);
    });
}

function protectImage(img: HTMLElement) {
    // 避免重复绑定
    if ((img as any)._protected) return;
    (img as any)._protected = true;
    
    img.setAttribute("draggable", "false");
    img.setAttribute("oncontextmenu", "return false");
    
    // 使用 capture 阶段确保优先执行
    img.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true); // true 表示在捕获阶段执行
    
    img.addEventListener("dragstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
}
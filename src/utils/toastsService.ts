import {useToast} from 'vue-toast-notification';

const $toast = useToast();

export const showToast = (message: string, type: "success" | "warning" | "error" | "default" | "info" = 'success', duration=3000) => {
    $toast.open({
        message,
        type,
        duration
    })
}
import Cookies from 'js-cookie';
export const validateToken = () => {
    const token = Cookies.get('token')
    if(!token){
        // window.location.reload();
        return;
    }
}
export const getAuth = () => {
    return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user'))
    };
};
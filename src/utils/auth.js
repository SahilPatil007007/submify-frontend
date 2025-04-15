export const getAuth = () => {
    console.log(localStorage.getItem('token'));
    return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user'))
    };
};
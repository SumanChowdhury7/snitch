import { setUser, setLoading, setError } from "../state/auth.slice";
import { register, login, getMe, logout } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ email, contact, password, fullname, isSeller=false }) {
    const data = await register({ email, contact, password, fullname, isSeller });

    dispatch(setUser(data.user));
  }
  async function handleLogin({ email, password }) {
    const data = await login({ email, password });

    dispatch(setUser(data.user));
    return data.user;
  }

  async function handleGetMe() {
    dispatch(setLoading(true)); 
    try {
        const data = await getMe();
        dispatch(setUser(data.user));
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || error.message));
    } finally {
        dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    dispatch(setLoading(true));
    try {
        await logout();
        dispatch(setUser(null));
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || error.message));
    } finally {
        dispatch(setLoading(false));
    }
  }


  return { handleRegister, handleLogin,handleGetMe, handleLogout };
};


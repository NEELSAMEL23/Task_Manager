import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ always prevent default first
    setError(''); // clear previous errors

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic validation
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!trimmedPassword) {
      setError('Please enter the password');
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting login...");

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        updateUser(response.data);
        console.log("Login successful, token stored:", token);

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        console.warn("No token received from server.");
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold mb-2'>Welcome Back</h3>
        <p className='mb-4 text-gray-600'>Please enter your details to log in</p>

        <form onSubmit={handleLogin}>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            label='Email Address'
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 mb-3 border rounded'
            autoComplete='email'
            disabled={loading}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            label='Password'
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-2 mb-3 border rounded'
            autoComplete='current-password'
            disabled={loading}
          />
          {error && (
            <p className='text-red-500 mb-4' role="alert">
              {error}
            </p>
          )}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
            disabled={!email || !password || loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className='mt-4 text-center'>
            Don’t have an account?{' '}
            <Link to='/signup' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

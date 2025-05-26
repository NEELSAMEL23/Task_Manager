import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!profilePic) {
      setError('Please select a profile picture');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Invalid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Upload profile image
      const imgUploadRes = await uploadImage(profilePic);
      const profileImageUrl = imgUploadRes.imageUrl || '';

      // Determine role
      const role = adminInviteToken.trim() ? 'admin' : 'member';

      // Send request to backend
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName.trim(),
        email: email.trim(),
        password,
        adminInviteToken: adminInviteToken.trim(),
        profileImageUrl,
        role,
      });

      const { token, role: userRole } = response.data;

      // Store token and update context
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
      }

      // Navigate based on role
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);

      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Signup failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below
        </p>

        <form
          onSubmit={handleSignUp}
          className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
            <Input
              label='Full Name'
              placeholder='John Doe'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full p-2 border rounded'
            />
            <Input
              type='email'
              label='Email'
              placeholder='example@mail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded'
              autoComplete='email'
            />
            <Input
              type='password'
              label='Password'
              placeholder='******'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              autoComplete='new-password'
            />
            <Input
              label='Admin Invite Token (optional)'
              placeholder='Token if any'
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              className='w-full p-2 border rounded'
            />
          </div>

          {error && <p className='text-red-500 mt-4'>{error}</p>}

          <button
            type='submit'
            className='w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className='mt-4 text-center'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      const message = "Please fill in all required fields.";

      setError(message);
      toast.error(message);

      return;
    }

    if (form.password.length < 6) {
      const message = "Password must contain at least 6 characters.";

      setError(message);
      toast.error(message);

      return;
    }

    if (form.password !== form.confirmPassword) {
      const message = "Passwords do not match.";

      setError(message);
      toast.error(message);

      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      const message = "Account created successfully.";

      setSuccess(message);
      toast.success(message);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-background min-h-screen flex items-center justify-center px-4 py-10'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme='light'
      />

      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <div className='inline-flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white'>
              P
            </div>

            <span className='text-2xl font-extrabold text-slate-900'>
              Pathfinder
            </span>
          </div>

          <p className='mt-3 text-sm text-slate-500'>
            Build your personalized career journey.
          </p>
        </div>

        <div className='rounded-3xl border border-slate-200 bg-white p-8 shadow-xl'>
          <h1 className='text-3xl font-extrabold text-slate-900'>
            Create account
          </h1>

          <p className='mt-2 mb-7 text-sm text-slate-500'>
            Join Pathfinder and start learning.
          </p>

          {error && (
            <div className='mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600'>
              {error}
            </div>
          )}

          {success && (
            <div className='mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600'>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='Full name'
              autoComplete='name'
              className='w-full rounded-xl border px-4 py-3'
            />

            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Email'
              autoComplete='email'
              className='w-full rounded-xl border px-4 py-3'
            />

            <div>
              <label className='mb-2 block text-sm font-semibold'>
                Account type
              </label>

              <select
                name='role'
                value={form.role}
                onChange={handleChange}
                className='w-full rounded-xl border bg-white px-4 py-3'
              >
                <option value='learner'>Learner</option>

                <option value='content_manager'>Content Manager</option>
              </select>
            </div>

            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Password'
              autoComplete='new-password'
              className='w-full rounded-xl border px-4 py-3'
            />

            <input
              type='password'
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm password'
              autoComplete='new-password'
              className='w-full rounded-xl border px-4 py-3'
            />

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-slate-500'>
            Already have an account?{" "}
            <Link to='/login' className='font-bold text-indigo-600'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

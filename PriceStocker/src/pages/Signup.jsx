import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSignUp from '../features/authentication/useSignUp';
import React, { useState } from 'react';

export default function Signup() {
  const { signup } = useSignUp();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async ({ username, email, password, fullName }) => {
    try {
      setErr(null);
      setLoading(true);
      await signup({ username, email, password, fullName }, { onSettled: reset });
    } catch (e) {
      setErr(e?.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 grid place-items-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-gray-600 mb-4">It only takes a minute.</p>

        {err && (
          <div className="mb-3 p-2.5 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('fullName', { required: 'This field is required' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('username', { required: 'This field is required' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('email', { required: 'This field is required' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('password', { required: 'This field is required' })}
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/signin" className="underline text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

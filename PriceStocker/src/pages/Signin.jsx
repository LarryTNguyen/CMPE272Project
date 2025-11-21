import { Link } from 'react-router-dom';
import useSignIn from '../features/authentication/useSignIn';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';

export default function Signin() {
  const { signin } = useSignIn();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async ({ email, password }) => {
    try {
      setErr(null);
      setLoading(true);
      await signin({ email, password });
    } catch (e) {
      setErr(e?.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 grid place-items-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-gray-600 mb-4">Welcome back — enter your credentials.</p>

        {err && (
          <div className="mb-3 p-2.5 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('email', { required: 'This field is required ' })}
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
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/signup" className="underline text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
  
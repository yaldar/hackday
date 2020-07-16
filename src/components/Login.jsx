import React, { useState } from 'react';
import { useCookies } from 'react-cookie';



export default function Login() {
  const [cookie, setCookie] = useCookies();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = event => {
    if (event.target.type === 'email') {
      setEmail(event.target.value);
    } else if (event.target.type === 'password') {
      setPassword(event.target.value);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    document.querySelector('form').reset();

    const res = await fetch(
      `http://localhost:5000/api/login/${email}/${password}`,
    );
    const { success, userID } = await res.json();
    if (success) {
      setCookie('loggedin', email);
    }
    if (!success) {
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <div>
          <input autoFocus type="email" onChange={handleChange} />

          <input onChange={handleChange} type="password" />
        </div>
        <button block type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';

const LoginForm = () => {
  const [memberType, setMemberType] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login based on member type
    if (memberType === 'individual') {
      console.log('Individual login:', {
        username,
        password,
      });
    } else if (memberType === 'health_organization' || memberType === 'insurance') {
      console.log('Organization or Insurance login:', {
        email,
        password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="memberType">Member Type:</label>
        <select
          id="memberType"
          value={memberType}
          onChange={(e) => setMemberType(e.target.value)}
        >
          <option value="">Select Member Type</option>
          <option value="individual">Individual</option>
          <option value="health_organization">Health Organization</option>
          <option value="insurance">Insurance</option>
        </select>
      </div>
      {memberType === 'individual' && (
        <>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </>
      )}
      {(memberType === 'health_organization' || memberType === 'insurance') && (
        <>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </>
      )}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
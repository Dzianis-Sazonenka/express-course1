import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {user.avatar && (
        <img 
          src={user.avatar} 
          alt={user.name} 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      )}
      <div>
        <div style={{ fontWeight: 'bold' }}>{user.name}</div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>{user.email}</div>
      </div>
      <button 
        onClick={logout}
        style={{
          marginLeft: '10px',
          padding: '5px 10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;

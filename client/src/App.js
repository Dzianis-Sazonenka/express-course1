import { BrowserRouter as Router } from "react-router-dom";
import {
  Arwes,
  SoundsProvider,
  ThemeProvider,
  createSounds,
  createTheme,
} from "arwes";

import AppLayout from "./pages/AppLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginButton from "./components/Auth/LoginButton";
import UserProfile from "./components/Auth/UserProfile";

import { theme, resources, sounds } from "./settings";

// A wrapper component to handle authentication state
const AuthWrapper = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a nice loading spinner
  }

  return (
    <div>
      <div style={{
        padding: '10px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: 'white' }}>NASA Missions</h1>
        {user ? <UserProfile /> : <LoginButton />}
      </div>
      {children}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={createTheme(theme)}>
      <SoundsProvider sounds={createSounds(sounds)}>
        <Arwes animate background={resources.background.large} pattern={resources.pattern}>
          {anim => (
            <AuthProvider>
              <Router>
                <AuthWrapper>
                  <AppLayout show={anim.entered} />
                </AuthWrapper>
              </Router>
            </AuthProvider>
          )}
        </Arwes>
      </SoundsProvider>
    </ThemeProvider>
  );
};

export default App;

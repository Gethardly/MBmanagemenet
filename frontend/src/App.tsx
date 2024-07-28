import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/users/Login';
import CreateUser from './features/users/CreateUser';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import PaymentRequests from './features/operations/payment-requests/PaymentRequests';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route path="*" element={"Not found"} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateUser />} />
        <Route element={<Protected user={user} />}>
          <Route path="/" element={<PaymentRequests />} />
         {/* <Route path="/create-note" element={<CreateNote />} />
          <Route path="/edit-note/:id" element={<CreateNote />} />*/}
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;

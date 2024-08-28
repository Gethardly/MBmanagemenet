import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/users/Login';
import ProtectedRoute from './routesGuard/ProtectedRoute';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import PaymentRequests from './features/operations/payment-requests/PaymentRequests';
import PaymentHistory from './features/operations/history/PaymentHistory';
import WithdrawRequests from './features/operations/withdraw-requests/WithdrawRequests';
import Home from './components/Home';
import WithdrawHistory from './features/operations/history/WithdrawHistory';
import CreateUser from './features/users/CreateUser';
import Users from './features/users/Users';
import Phones from './features/phones/Phones';
import AdminRoute from './routesGuard/AdminRoute';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route path="*" element={"Not found"} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute user={user}/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/payment-history" element={<PaymentHistory/>}/>
          <Route path="/withdraw-history" element={<WithdrawHistory/>}/>
          <Route path="/payment" element={<PaymentRequests />} />
          <Route path="/withdraw" element={<WithdrawRequests/>}/>
        </Route>
        <Route element={<AdminRoute user={user}/>}>
          <Route path="/users" element={<Users />}>
            <Route path="createUser" element={<CreateUser />} />
          </Route>
          <Route path="/phones" element={<Phones/>}/>
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;

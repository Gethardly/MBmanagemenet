import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/users/Login';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import PaymentRequests from './features/operations/payment-requests/PaymentRequests';
import PaymentHistory from './features/operations/history/PaymentHistory';
import WithdrawRequests from './features/operations/withdraw-requests/WithdrawRequests';
import Home from './components/Home';
import WithdrawHistory from './features/operations/history/WithdrawHistory';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route path="*" element={"Not found"} />
        <Route path="/login" element={<Login />} />

        <Route element={<Protected user={user} />}>
          <Route path="/" element={<Home/>}/>
          <Route path="/payment-history" element={<PaymentHistory/>}/>
          <Route path="/withdraw-history" element={<WithdrawHistory/>}/>
          <Route path="/payment" element={<PaymentRequests />} />
          <Route path="/withdraw" element={<WithdrawRequests/>}/>
         {/* <Route path="/create-note" element={<CreateNote />} />
          <Route path="/edit-note/:id" element={<CreateNote />} />
           <Route path="/register" element={<CreateUser />} />*/
         }
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/users/Login';
import CreateUser from './features/users/CreateUser';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import PaymentRequests from './features/operations/payment-requests/PaymentRequests';
import OperationsHistory from './features/operations/history/OperationsHistory';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route path="*" element={"Not found"} />
        <Route path="/login" element={<Login />} />

        <Route element={<Protected user={user} />}>
          <Route path="/" element={<PaymentRequests />} />
          <Route path="/operations-history" element={<OperationsHistory/>}/>
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

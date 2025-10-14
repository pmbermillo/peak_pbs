import React from 'react'
import ProtectedRoute from './ProtectedRoute.jsx'
import Login from '../Pages/Auth/Login.jsx'
import {Dashboard} from '../Pages/Public/Dashboard.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthenticatedLayout from '../Component/Layout/AuthenticatedLayout';
import BudgetFormRequest from '../Pages/Public/BudgetFormRequest.jsx';
import RealignmentFormRequest from '../Pages/Public/realignmentFormRequest.jsx';
import BudgetRequestRecord from '../Pages/Public/BudgetRequestRecord.jsx';
import RealignmentRequestRecord from '../Pages/Public/RealignmentRequestRecord.jsx';
import UserManagement from '../Pages/Public/UserManagement.jsx'
import BudgetSourceManagement from '../Pages/Public/BudgetSourceManagement.jsx'
import CategoryManagement from '../Pages/Public/CategoryManagement.jsx'
import LocationManagement from '../Pages/Public/LocationManagement.jsx'
import ProjectManagement from '../Pages/Public/ProjectManagement.jsx'
import ExpenseAccountManagement from '../Pages/Public/ExpenseAccountManagement.jsx'
import Estimate from '../Pages/Public/Estimate.jsx'

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path='/' element={<AuthenticatedLayout/>}>
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
              }/>
              <Route 
                path="budget-estimate" 
                element={
                  <ProtectedRoute>
                    <Estimate />
                  </ProtectedRoute>
              }/>
              <Route 
                path="budget-request" 
                element={
                  <ProtectedRoute>
                    <BudgetFormRequest />
                  </ProtectedRoute>
              }/>
              <Route 
                path="realignment-request" 
                element={
                  <ProtectedRoute>
                    <RealignmentFormRequest />
                  </ProtectedRoute>
              }/>
              <Route 
                path="budget-request-record" 
                element={
                  <ProtectedRoute>
                    <BudgetRequestRecord />
                  </ProtectedRoute>
              }/>
              <Route 
                path="realignment-request-record" 
                element={
                  <ProtectedRoute>
                    <RealignmentRequestRecord />
                  </ProtectedRoute>
              }/>
              <Route 
                path="user-management" 
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
              }/>
              <Route 
                path="budget-source-management" 
                element={
                  <ProtectedRoute>
                    <BudgetSourceManagement />
                  </ProtectedRoute>
              }/>
              <Route 
                path="category-management" 
                element={
                  <ProtectedRoute>
                    <CategoryManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="location-management"
                element={
                  <ProtectedRoute>
                    <LocationManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="project-management"
                element={
                  <ProtectedRoute>
                    <ProjectManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="expense-account-management"
                element={
                  <ProtectedRoute>
                    <ExpenseAccountManagement />
                  </ProtectedRoute>
              }/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default Router
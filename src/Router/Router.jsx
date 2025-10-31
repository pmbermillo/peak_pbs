import React, { Profiler } from 'react'
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
import Reports from '../Pages/Public/Reports.jsx'
import Estimate from '../Pages/Public/Estimate.jsx'
import Profile from '../Pages/Public/Profile.jsx'

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
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST", "APPROVER"]}>
                    <Estimate />
                  </ProtectedRoute>
              }/>
              <Route 
                path="budget-request" 
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REQUESTOR", "APPROVER"]}>
                    <BudgetFormRequest />
                  </ProtectedRoute>
              }/>
              <Route 
                path="realignment-request" 
                element={
                  <ProtectedRoute>
                    <RealignmentFormRequest requiredPermission={["ADMIN", "APPROVER"]} />
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
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST", "APPROVER"]}>
                    <RealignmentRequestRecord />
                  </ProtectedRoute>
              }/>
              <Route 
                path="reports" 
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST", "APPROVER"]}>
                    <Reports />
                  </ProtectedRoute>
              }/>
              <Route 
                path="user-management" 
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST"]}>
                    <UserManagement />
                  </ProtectedRoute>
              }/>
              <Route 
                path="budget-source-management" 
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST"]}>
                    <BudgetSourceManagement />
                  </ProtectedRoute>
              }/>
              <Route 
                path="category-management" 
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST"]}>
                    <CategoryManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="location-management"
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST"]}>
                    <LocationManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="project-management"
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST"]}>
                    <ProjectManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="expense-account-management"
                element={
                  <ProtectedRoute requiredPermission={["ADMIN", "REVIEWER", "SPECIALIST"]}>
                    <ExpenseAccountManagement />
                  </ProtectedRoute>
              }/>
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
              }/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default Router
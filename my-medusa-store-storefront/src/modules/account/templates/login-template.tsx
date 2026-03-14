"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import ForgotPassword from "@modules/account/components/forgot-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  const tabs = [
    { id: LOGIN_VIEW.SIGN_IN, label: "Sign in" },
    { id: LOGIN_VIEW.REGISTER, label: "Register" },
  ]

  return (
    <div className="p-6 md:p-10 max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Account</h1>
        <p className="text-slate-500 text-sm mt-1">
          Sign in or create an account to manage listings and orders.
        </p>
      </div>

      {currentView !== LOGIN_VIEW.FORGOT_PASSWORD ? (
        <>
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentView(tab.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  currentView === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {currentView === LOGIN_VIEW.SIGN_IN && <Login setCurrentView={setCurrentView} />}
          {currentView === LOGIN_VIEW.REGISTER && <Register setCurrentView={setCurrentView} />}
        </>
      ) : (
        <ForgotPassword setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate

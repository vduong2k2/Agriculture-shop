<<<<<<< HEAD
import React, { useEffect } from "react";
import Signup from "../components/Signup/Signup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
=======
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Signup from "../components/Signup/Signup";
>>>>>>> origin/nqkha

const SignupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
<<<<<<< HEAD
    if (isAuthenticated == true) {
      navigate("/");
    }
  }, []);
=======
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [])
>>>>>>> origin/nqkha
  return (
    <div>
        <Signup />
    </div>
  )
}

export default SignupPage
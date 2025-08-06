import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logos/logo.png";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Card,
  CardBody,
  Spinner
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../services/Api";
import { loggedIn } from "../../redux/AuthSliceQist";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const SigninUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isSuccess }] = useLoginUserMutation();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const data = {
      email: email,
      password: password
    };

    try {
      const payload = await loginUser({ data: data }).unwrap();

      if (payload?.status) {
        const response = {
          token: payload?.access_token,
          userDetail: payload?.user
        };

        dispatch(loggedIn(response));
        toast.success(payload?.message || "Login successful!");
        navigate(PATHS.dashboard);
      } else {
        toast.error(payload?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <Card
              className="shadow-lg border-0"
              style={{ borderRadius: "15px" }}
            >
              <CardBody className="p-5">
                {/* Logo Section */}
                <div className="text-center mb-4">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="img-fluid mb-3"
                    style={{ maxWidth: "120px", height: "auto" }}
                  />
                  <h3 className="fw-bold text-dark mb-2">Welcome Back</h3>
                  <p className="text-muted">Please sign in to your account</p>
                </div>

                {/* Email Field */}
                <FormGroup className="mb-3">
                  <Label className="fw-semibold text-dark mb-2">
                    <Mail size={16} className="me-2" />
                    Email Address
                  </Label>
                  <div className="position-relative">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      className={`form-control-lg ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      style={{
                        borderRadius: "10px",
                        border: errors.email
                          ? "2px solid #dc3545"
                          : "2px solid #e9ecef",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) =>
                        (e.target.style.border = "2px solid #667eea")
                      }
                      onBlur={(e) =>
                        (e.target.style.border = errors.email
                          ? "2px solid #dc3545"
                          : "2px solid #e9ecef")
                      }
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <AlertCircle size={14} className="me-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </FormGroup>

                {/* Password Field */}
                <FormGroup className="mb-4">
                  <Label className="fw-semibold text-dark mb-2">
                    <Lock size={16} className="me-2" />
                    Password
                  </Label>
                  <div className="position-relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      className={`form-control-lg pe-5 ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      style={{
                        borderRadius: "10px",
                        border: errors.password
                          ? "2px solid #dc3545"
                          : "2px solid #e9ecef",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) =>
                        (e.target.style.border = "2px solid #667eea")
                      }
                      onBlur={(e) =>
                        (e.target.style.border = errors.password
                          ? "2px solid #dc3545"
                          : "2px solid #e9ecef")
                      }
                    />
                    <button
                      type="button"
                      className="btn position-absolute end-0 top-0 h-100 pe-3"
                      style={{
                        border: "none",
                        background: "transparent",
                        zIndex: 5
                      }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-muted" />
                      ) : (
                        <Eye size={20} className="text-muted" />
                      )}
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <AlertCircle size={14} className="me-1" />
                        {errors.password}
                      </div>
                    )}
                  </div>
                </FormGroup>

                {/* Login Button */}
                <Button
                  className="w-100 fw-semibold py-3"
                  onClick={handleLogin}
                  disabled={isLoading}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    transform: isLoading ? "scale(0.98)" : "scale(1)"
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninUser;
